import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardCharts from "./DashboardCharts";

// Helper: get date N months ago
function monthsAgo(n: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

type KPIData = {
  totalVehicles: number;
  availableVehicles: number;
  reservedVehicles: number;
  soldVehicles: number;
  totalUsers: number;
  newUsersThisMonth: number;
  reservationsLast30Days: number;
};

type MonthlyPoint = {
  month: string; // e.g. "2025-01"
  count: number;
};

type DistributionPoint = {
  label: string;
  count: number;
};

type DashboardData = {
  kpis: KPIData;
  vehiclesPerMonth: MonthlyPoint[];
  reservationsPerMonth: MonthlyPoint[];
  availabilityDistribution: DistributionPoint[];
  roleDistribution: DistributionPoint[];
  latestReservations: {
    vehicleId: number;
    vehicleLabel: string;
    userLabel: string;
    reservedUntil: string | null;
    availability: string;
  }[];
  latestVehicles: {
    id: number;
    label: string;
    createdAt: string;
    availability: string;
  }[];
};

export default async function DashboardPage() {
  // 🔐 Auth check (you can tighten to ADMIN/EMPLOYEE later)
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twelveMonthsAgo = monthsAgo(12);

  // ─────────────────────────────────────────
  // 1) BASE QUERIES (run in parallel)
  // ─────────────────────────────────────────

  const [
    totalVehicles,
    availableVehicles,
    reservedVehicles,
    soldVehicles,
    totalUsers,
    newUsersThisMonth,
    reservationsLast30Days,
    vehiclesLastYear,
    reservedVehiclesLastYear,
    availabilityGroup,
    rolesGroup,
    latestReservedVehicles,
    latestCreatedVehicles,
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { availability: "AVAILABLE" } }),
    prisma.vehicle.count({ where: { availability: "RESERVED" } }),
    prisma.vehicle.count({ where: { availability: "SOLD" } }),

    prisma.user.count(),

    prisma.user.count({
      where: { createdAt: { gte: startOfMonth } },
    }),

    // Approximation: reservations considered as RESERVED with reservedUntil in the last 30 days
    prisma.vehicle.count({
      where: {
        availability: "RESERVED",
        reservedUntil: { gte: thirtyDaysAgo },
      },
    }),

    // Vehicles created in the last 12 months (for chart)
    prisma.vehicle.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { id: true, createdAt: true },
    }),

    // "Reservations" per month: we approximate by updatedAt on RESERVED
    prisma.vehicle.findMany({
      where: {
        availability: "RESERVED",
        updatedAt: { gte: twelveMonthsAgo },
      },
      select: { id: true, updatedAt: true },
    }),

    // Availability distribution
    prisma.vehicle.groupBy({
      by: ["availability"],
      _count: { _all: true },
    }),

    // Role distribution
    prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
    }),

    // Latest reservations (vehicles currently RESERVED, ordered by reservedUntil desc)
    prisma.vehicle.findMany({
      where: { availability: "RESERVED" },
      orderBy: { reservedUntil: "desc" },
      take: 5,
      include: {
        reservedByUser: true,
      },
    }),

    // Latest vehicles created
    prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // ─────────────────────────────────────────
  // 2) AGGREGATION HELPERS (IN JS)
  // ─────────────────────────────────────────

  // Build a map of months for the last 12 months so empty months show as 0
  function buildEmptyMonthBuckets(): Map<string, number> {
    const map = new Map<string, number>();
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, 0);
    }
    return map;
  }

  function toMonthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  // Vehicles per month
  const vehicleMonthBuckets = buildEmptyMonthBuckets();
  for (const v of vehiclesLastYear) {
    const key = toMonthKey(v.createdAt);
    if (vehicleMonthBuckets.has(key)) {
      vehicleMonthBuckets.set(key, (vehicleMonthBuckets.get(key) || 0) + 1);
    }
  }

  const vehiclesPerMonth = Array.from(vehicleMonthBuckets.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, count]) => ({ month, count }));

  // Reservations per month (approx by updatedAt when RESERVED)
  const reservationMonthBuckets = buildEmptyMonthBuckets();
  for (const v of reservedVehiclesLastYear) {
    const key = toMonthKey(v.updatedAt);
    if (reservationMonthBuckets.has(key)) {
      reservationMonthBuckets.set(key, (reservationMonthBuckets.get(key) || 0) + 1);
    }
  }

  const reservationsPerMonth = Array.from(reservationMonthBuckets.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, count]) => ({ month, count }));

  // Availability distribution
  const availabilityDistribution = availabilityGroup.map((row) => ({
    label: row.availability,
    count: row._count._all,
  }));

  // Role distribution
  const roleDistribution = rolesGroup.map((row) => ({
    label: row.role,
    count: row._count._all,
  }));

  // Latest reservations table-friendly
  const latestReservations = latestReservedVehicles.map((v) => ({
    vehicleId: v.id,
    vehicleLabel: `${v.brand} ${v.model}`,
    userLabel: v.reservedByUser
      ? v.reservedByUser.name || v.reservedByUser.email || `ID ${v.reservedByUser.id}`
      : "Sin usuario",
    reservedUntil: v.reservedUntil ? v.reservedUntil.toISOString() : null,
    availability: v.availability,
  }));

  // Latest vehicles
  const latestVehicles = latestCreatedVehicles.map((v) => ({
    id: v.id,
    label: `${v.brand} ${v.model}`,
    createdAt: v.createdAt.toISOString(),
    availability: v.availability,
  }));

  // ─────────────────────────────────────────
  // 3) PACK EVERYTHING INTO A SINGLE OBJECT
  // ─────────────────────────────────────────

  const data: DashboardData = {
    kpis: {
      totalVehicles,
      availableVehicles,
      reservedVehicles,
      soldVehicles,
      totalUsers,
      newUsersThisMonth,
      reservationsLast30Days,
    },
    vehiclesPerMonth,
    reservationsPerMonth,
    availabilityDistribution,
    roleDistribution,
    latestReservations,
    latestVehicles,
  };

  // For now, we hand it to a client component that just dumps JSON.
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Bienvenido, {session.user?.name || "Usuario"}
        </h1>
        <p className="text-neutral-400 mt-1">
          Resumen de actividad
        </p>
      </div>

      <DashboardCharts data={data} />
    </div>
  );
}
