import FillerPage from "@/components/extras/extraPages";

export const metadata = { title: "Requisitos | Financiación" };

export default function Page() {
  return (
    <FillerPage
      title="Requisitos"
      subtitle="Condiciones generales orientativas para iniciar una solicitud de financiación."
      bullets={[
        "Mayoría de edad",
        "Documento de identidad vigente",
        "Ingresos demostrables",
        "Cuenta bancaria activa",
      ]}
      note="El cumplimiento de requisitos no implica aprobación automática."
      backHref="/financing"
    />
  );
}
