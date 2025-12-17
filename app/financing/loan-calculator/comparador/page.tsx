import FillerPage from "@/components/extras/extraPages";

export const metadata = { title: "Comparador | Financiación" };

export default function Page() {
  return (
    <FillerPage
      title="Comparador"
      subtitle="Comparación rápida de escenarios de financiación para el mismo vehículo."
      bullets={[
        "Comparar distintos plazos",
        "Comparar diferentes entradas",
        "Impacto del tipo de interés",
        "Resumen del coste total",
      ]}
      note="Esta vista sirve como punto de apoyo UX para el flujo de financiación."
      backHref="/financing"
    />
  );
}
