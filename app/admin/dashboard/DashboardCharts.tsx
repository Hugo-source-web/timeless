"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type DashboardData = {
  kpis: {
    totalVehicles: number;
    availableVehicles: number;
    reservedVehicles: number;
    soldVehicles: number;
    totalUsers: number;
    newUsersThisMonth: number;
    reservationsLast30Days: number;
  };
  vehiclesPerMonth: { month: string; count: number }[];
  reservationsPerMonth: { month: string; count: number }[];
  availabilityDistribution: { label: string; count: number }[];
  roleDistribution: { label: string; count: number }[];
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

export default function DashboardCharts({ data }: { data: DashboardData }) {
  const KPIs = [
    { label: "Vehículos totales", value: data.kpis.totalVehicles },
    { label: "Disponibles", value: data.kpis.availableVehicles },
    { label: "Reservados", value: data.kpis.reservedVehicles },
    { label: "Vendidos", value: data.kpis.soldVehicles },
    { label: "Usuarios", value: data.kpis.totalUsers },
    { label: "Usuarios este mes", value: data.kpis.newUsersThisMonth },
    { label: "Reservas (30 días)", value: data.kpis.reservationsLast30Days },
  ];

  const COLORS = ["#34d399", "#fbbf24", "#f87171", "#60a5fa", "#a78bfa"];

  return (
    <div className="space-y-14 pb-24">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPIs.map((k, i) => (
          <div
            key={i}
            className="bg-neutral-900 p-4 rounded-lg border border-neutral-800"
          >
            <p className="text-neutral-400 text-sm">{k.label}</p>
            <p className="text-3xl font-semibold mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Vehicles per month */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Vehículos por mes</h2>
        <div className="h-64 bg-neutral-900 p-4 rounded-lg border border-neutral-800">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.vehiclesPerMonth}>
              <CartesianGrid stroke="#333" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Reservations per month */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Reservas por mes</h2>
        <div className="h-64 bg-neutral-900 p-4 rounded-lg border border-neutral-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.reservationsPerMonth}>
              <CartesianGrid stroke="#333" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Availability distribution */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Disponibilidad</h2>
        <div className="h-72 bg-neutral-900 p-4 rounded-lg border border-neutral-800 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.availabilityDistribution}
                dataKey="count"
                nameKey="label"
                outerRadius={90}
                label
              >
                {data.availabilityDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Latest vehicles */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Últimos vehículos añadidos</h2>
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 divide-y divide-neutral-800">
          {data.latestVehicles.map((v) => (
            <div key={v.id} className="flex justify-between p-4">
              <span>{v.label}</span>
              <span className="text-neutral-400 text-sm">
                {new Date(v.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest reservations */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Últimas reservas</h2>
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 divide-y divide-neutral-800">
          {data.latestReservations.map((r, i) => (
            <div key={i} className="flex justify-between p-4">
              <span>{r.vehicleLabel}</span>
              <span className="text-neutral-400 text-sm">
                {r.userLabel} — {r.reservedUntil ? new Date(r.reservedUntil).toLocaleDateString() : "—"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
