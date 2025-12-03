import { prisma } from "@/lib/prisma";
import { timelessFont } from "@/app/fonts/timeless";

export default async function PDFPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { slug },
    include: { media: true, dealership: true },
  });

  if (!vehicle) {
    return <div>Vehículo no encontrado</div>;
  }

  const heroImage =
    vehicle.media.find((m) => m.isHero)?.url ?? "/placeholder.jpg";

  const sections = [
    {
      title: "Performance",
      rows: [
        ["Power output", vehicle.powerTotalHp ? `${vehicle.powerTotalHp} hp` : null],
        ["Maximum speed", vehicle.maxSpeedLimitedKmh ? `${vehicle.maxSpeedLimitedKmh} km/h` : null],
        ["Mass (DIN)", vehicle.massDinKg ? `${vehicle.massDinKg} kg` : null],
        ["Electric-only range (WLTP)", vehicle.electricRangeWltpKm ? `${vehicle.electricRangeWltpKm} km` : null],
      ],
    },
    {
      title: "Acceleration",
      rows: [
        ["0–100 km/h", vehicle.accel_0_100_s ? `${vehicle.accel_0_100_s} s` : null],
        ["0–200 km/h", vehicle.accel_0_200_s ? `${vehicle.accel_0_200_s} s` : null],
        ["0–300 km/h", vehicle.accel_0_300_s ? `${vehicle.accel_0_300_s} s` : null],
        ["0–400 km/h", vehicle.accel_0_400_s ? `${vehicle.accel_0_400_s} s` : null],
      ],
    },
    {
      title: "Combustion Engine",
      rows: [
        ["Configuration", vehicle.engineConfiguration],
        ["Architecture", vehicle.engineArchitecture],
        ["Displacement", vehicle.engineDisplacementL ? `${vehicle.engineDisplacementL} L` : null],
        ["Power output", vehicle.enginePowerHp ? `${vehicle.enginePowerHp} hp` : null],
        ["Maximum torque", vehicle.engineTorqueNm ? `${vehicle.engineTorqueNm} Nm` : null],
        ["Maximum rpm", vehicle.engineMaxRpm ? `${vehicle.engineMaxRpm} rpm` : null],
      ],
    },
    {
      title: "Dimensions",
      rows: [
        ["Length", vehicle.lengthMm ? `${vehicle.lengthMm} mm` : null],
        ["Width", vehicle.widthMm ? `${vehicle.widthMm} mm` : null],
        ["Height", vehicle.heightMm ? `${vehicle.heightMm} mm` : null],
        ["Wheelbase", vehicle.wheelbaseMm ? `${vehicle.wheelbaseMm} mm` : null],
      ],
    },
    {
      title: "Transmission",
      rows: [
        ["Transmission type", vehicle.transmissionType],
        ["ELSD", vehicle.elsdDescription],
        ["E-Synchro", vehicle.eSynchroDescription],
        ["Cooling", vehicle.transmissionCooling],
      ],
    },
    {
      title: "Traction Battery",
      rows: [
        ["Architecture", vehicle.batteryArchitectureV ? `${vehicle.batteryArchitectureV} V` : null],
        ["Peak Power", vehicle.batteryPowerPeakKw ? `${vehicle.batteryPowerPeakKw} kW` : null],
        ["Energy", vehicle.batteryEnergyKwh ? `${vehicle.batteryEnergyKwh} kWh` : null],
        ["Cooling", vehicle.batteryCooling],
      ],
    },
    {
      title: "Front Axle",
      rows: [
        ["Motor", vehicle.frontMotorPowerKwTotal ? `${vehicle.frontMotorPowerKwTotal} kW` : null],
        ["Maximum torque", vehicle.frontMotorTorqueNmWheels ? `${vehicle.frontMotorTorqueNmWheels} Nm` : null],
        ["Max rpm", vehicle.frontMotorMaxRpm ? `${vehicle.frontMotorMaxRpm} rpm` : null],
        ["Inverter", vehicle.frontInverterType],
        ["Drive system", vehicle.frontDriveSystem],
      ],
    },
    {
      title: "Rear eMotor",
      rows: [
        ["Motor", vehicle.rearMotorPowerKw ? `${vehicle.rearMotorPowerKw} kW` : null],
        ["Maximum torque", vehicle.rearMotorTorqueNm ? `${vehicle.rearMotorTorqueNm} Nm` : null],
        ["Max rpm", vehicle.rearMotorMaxRpm ? `${vehicle.rearMotorMaxRpm} rpm` : null],
        ["Inverter", vehicle.rearInverterType],
      ],
    },
  ];

  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: "40px",
          fontFamily: "Helvetica, Arial, sans-serif",
          color: "#222",
        }}
      >
        {/* LOGO */}
        <div
          className={`${timelessFont.className}`}
          style={{
            textAlign: "center",
            fontSize: "32px",
            letterSpacing: "4px",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          TIMELESS
        </div>

        <div
          style={{
            height: "1px",
            background: "#ccc",
            marginBottom: "20px",
          }}
        />

        {/* HERO IMAGE */}
        <img
          src={heroImage}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            borderRadius: "6px",
            marginBottom: "30px",
          }}
        />

        {/* VEHICLE TITLE */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div style={{ fontSize: "26px", fontWeight: "bold" }}>
            {vehicle.brand} {vehicle.model} {vehicle.variant ?? ""}
          </div>

          <div style={{ opacity: 0.6, marginTop: "4px" }}>
            Año {vehicle.year} · {vehicle.condition}
          </div>
        </div>

        {/* RENDER SECTIONS */}
        {sections.map((section) => {
          const validRows = section.rows.filter(([_, v]) => v !== null && v !== undefined);

          if (validRows.length === 0) return null;

          return (
            <div style={{ marginBottom: "25px" }} key={section.title}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {section.title}
              </div>

              {validRows.map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                    fontSize: "13px",
                  }}
                >
                  <span>{label}</span>
                  <span style={{ opacity: 0.7 }}>{value}</span>
                </div>
              ))}
            </div>
          );
        })}

        {/* FOOTER */}
        <div
          style={{
            marginTop: "40px",
            fontSize: "11px",
            opacity: 0.6,
            textAlign: "center",
          }}
        >
          {vehicle.dealership?.name} · {vehicle.dealership?.city}
          <br />
          Generado el {new Date().toLocaleDateString()}
        </div>
      </body>
    </html>
  );
}
