import FillerPage from "@/components/extras/extraPages";

export const metadata = { title: "Solicitar ahora | Financiación" };

export default function Page() {
  return (
    <FillerPage
      title="Solicitar ahora"
      subtitle="Inicio del flujo de solicitud. Aquí se conectaría el formulario y la validación."
      bullets={[
        "Datos personales",
        "Datos laborales y económicos",
        "Revisión de vehículo",
        "Envío para evaluación",
      ]}
      note="En esta entrega, la sección funciona como pantalla informativa y de navegación."
      backHref="/financing"
    />
  );
}
