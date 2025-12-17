import FillerPage from "@/components/extras/extraPages";

export const metadata = { title: "Documentos necesarios | Financiación" };

export default function Page() {
  return (
    <FillerPage
      title="Documentos necesarios"
      subtitle="Listado habitual de documentación requerida para completar la solicitud."
      bullets={[
        "DNI/NIE o documento equivalente",
        "Justificante de ingresos (nómina/autónomos/pensión)",
        "Extracto o justificante bancario",
        "Vida laboral / contrato (si aplica)",
      ]}
      note="La documentación exacta puede variar según entidad y perfil del solicitante."
      backHref="/financing"
    />
  );
}
