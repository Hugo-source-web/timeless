import FillerPage from "@/components/extras/extraPages";

export const metadata = { title: "Tabla de intereses | Financiación" };

export default function Page() {
  return (
    <FillerPage
      title="Tabla de intereses"
      subtitle="Referencia orientativa de tipos y cómo pueden variar según plazo e importe."
      bullets={[
        "Rangos por plazo (12–84 meses)",
        "Rangos por importe financiado",
        "Notas y criterios generales",
        "Aviso de carácter informativo",
      ]}
      note="Los tipos reales se determinan en la solicitud y pueden cambiar según mercado y perfil."
      backHref="/financing"
    />
  );
}
