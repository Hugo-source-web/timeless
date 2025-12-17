import FillerPage from "@/components/extras/extraPages";

export const metadata = { title: "Estimación | Financiación" };

export default function Page() {
  return (
    <FillerPage
      title="Estimación"
      subtitle="Simulación orientativa de cuota mensual según precio, entrada y plazo."
      bullets={[
        "Entrada inicial y plazo",
        "Cuota mensual estimada",
        "Coste total aproximado",
        "Escenarios rápidos (12/24/36/48/60 meses)",
      ]}
      note="La cifra final depende de la entidad financiera y de la evaluación del solicitante."
      backHref="/financing"
    />
  );
}
