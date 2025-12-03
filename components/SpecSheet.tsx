import { neue6, neue5 } from "@/app/fonts/neuePlak";
import SpecSection from "./SpecSection";
import type { Vehicle } from "@prisma/client";

interface SpecSheetProps {
  vehicle: Vehicle;
}

export default function SpecSheet({ vehicle }: SpecSheetProps) {
  return (
    <section className="bg-black text-white py-28 px-4">

    <div className="relative h-[10vh] overflow-x-hidden">
      <h2 className={`${neue6.className} absolute left-0 top-0 text-4xl translate-y-[5vh] translate-x-[13.5vw] font-semibold tracking-tight px-6 mb-20`}>
        ESPECIFICACIONES
      </h2>
    </div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 border border-white/40 rounded-md px-10 py-10">

        {/* PERFORMANCE */}
        <SpecSection
          title="Performance"
          rows={[
            { label: "Power output", value: vehicle.powerTotalHp ? `${vehicle.powerTotalHp} hp` : null },
            { label: "Maximum speed", value: vehicle.maxSpeedLimitedKmh ? `${vehicle.maxSpeedLimitedKmh} km/h` : null },
            { label: "Mass (DIN)", value: vehicle.massDinKg ? `${vehicle.massDinKg} kg` : null },
            { label: "Electric-only range (WLTP)", value: vehicle.electricRangeWltpKm ? `${vehicle.electricRangeWltpKm} km` : null },
          ]}
        />

        {/* ACCELERATION */}
        <SpecSection
          title="Acceleration"
          rows={[
            { label: "0–100 km/h", value: vehicle.accel_0_100_s ? `${vehicle.accel_0_100_s} s` : null },
            { label: "0–200 km/h", value: vehicle.accel_0_200_s ? `${vehicle.accel_0_200_s} s` : null },
            { label: "0–300 km/h", value: vehicle.accel_0_300_s ? `${vehicle.accel_0_300_s} s` : null },
            { label: "0–400 km/h", value: vehicle.accel_0_400_s ? `${vehicle.accel_0_400_s} s` : null },
          ]}
        />

        {/* COMBUSTION ENGINE */}
        <SpecSection
          title="Combustion Engine"
          rows={[
            { label: "Configuration", value: vehicle.engineConfiguration },
            { label: "Architecture", value: vehicle.engineArchitecture },
            { label: "Displacement", value: vehicle.engineDisplacementL ? `${vehicle.engineDisplacementL} L` : null },
            { label: "Power output", value: vehicle.enginePowerHp ? `${vehicle.enginePowerHp} hp` : null },
            { label: "Maximum torque", value: vehicle.engineTorqueNm ? `${vehicle.engineTorqueNm} Nm` : null },
            { label: "Maximum rpm", value: vehicle.engineMaxRpm ? `${vehicle.engineMaxRpm} rpm` : null },
          ]}
        />

        {/* DIMENSIONS */}
        <SpecSection
          title="Dimensions"
          rows={[
            { label: "Length", value: vehicle.lengthMm ? `${vehicle.lengthMm} mm` : null },
            { label: "Width", value: vehicle.widthMm ? `${vehicle.widthMm} mm` : null },
            { label: "Height", value: vehicle.heightMm ? `${vehicle.heightMm} mm` : null },
            { label: "Wheelbase", value: vehicle.wheelbaseMm ? `${vehicle.wheelbaseMm} mm` : null },
          ]}
        />

        {/* TRANSMISSION */}
        <SpecSection
          title="Transmission"
          rows={[
            { label: "Transmission type", value: vehicle.transmissionType },
            { label: "ELSD", value: vehicle.elsdDescription },
            { label: "E-Synchro", value: vehicle.eSynchroDescription },
            { label: "Cooling", value: vehicle.transmissionCooling },
          ]}
        />

        {/* BATTERY */}
        <SpecSection
          title="Traction Battery"
          rows={[
            { label: "Architecture", value: vehicle.batteryArchitectureV ? `${vehicle.batteryArchitectureV} V` : null },
            { label: "Peak Power", value: vehicle.batteryPowerPeakKw ? `${vehicle.batteryPowerPeakKw} kW` : null },
            { label: "Energy", value: vehicle.batteryEnergyKwh ? `${vehicle.batteryEnergyKwh} kWh` : null },
            { label: "Cooling", value: vehicle.batteryCooling },
          ]}
        />

        {/* FRONT AXLE */}
        <SpecSection
          title="Front Axle"
          rows={[
            { label: "Motor", value: vehicle.frontMotorPowerKwTotal ? `${vehicle.frontMotorPowerKwTotal} kW` : null },
            { label: "Maximum torque", value: vehicle.frontMotorTorqueNmWheels ? `${vehicle.frontMotorTorqueNmWheels} Nm` : null },
            { label: "Max rpm", value: vehicle.frontMotorMaxRpm ? `${vehicle.frontMotorMaxRpm} rpm` : null },
            { label: "Inverter", value: vehicle.frontInverterType },
            { label: "Drive system", value: vehicle.frontDriveSystem },
          ]}
        />

        {/* REAR MOTOR */}
        <SpecSection
          title="Rear eMotor"
          rows={[
            { label: "Motor", value: vehicle.rearMotorPowerKw ? `${vehicle.rearMotorPowerKw} kW` : null },
            { label: "Maximum torque", value: vehicle.rearMotorTorqueNm ? `${vehicle.rearMotorTorqueNm} Nm` : null },
            { label: "Max rpm", value: vehicle.rearMotorMaxRpm ? `${vehicle.rearMotorMaxRpm} rpm` : null },
            { label: "Inverter", value: vehicle.rearInverterType },
          ]}
        />

        <div className="col-span-1 md:col-span-2 text-center">
            <h2 className={`${neue5.className} text-3xl py-3 translate-y-[-0.7vh] overflow-y-hidden`}>
              FICHA TECNICA
            </h2>

            <a
              href={`/api/pdf/vehicle/${vehicle.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition"
            >
              Download PDF
            </a>
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
    </section>
  );
}
