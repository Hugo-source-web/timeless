"use client";

import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

type FillerPageProps = {
  title: string;
  subtitle?: string;
  bullets?: string[];
  note?: string;
  backHref?: string;
  backLabel?: string;
};

export default function FillerPage({
  title,
  subtitle,
  bullets = [],
  note,
  backLabel = "Volver al inicio",
}: FillerPageProps) {
  const router = useRouter();
  const { close, setSelectedSection, setSelectedItem } = useSidebar();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6">
        <p className="text-sm text-neutral-500">Financiación</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-neutral-600">{subtitle}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-medium">Descripción</h2>
          <p className="mt-2 text-neutral-600">
            Esta sección está incluida para completar la navegación del proyecto y
            documentar el flujo de financiación. Su implementación funcional puede
            ampliarse en futuras iteraciones.
          </p>

          {bullets.length > 0 && (
            <>
              <h3 className="mt-4 text-sm font-medium text-neutral-700">
                Contenido previsto
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-600">
                {bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-medium">Estado</h2>
          <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <p className="text-sm">
              Página informativa (filler). No genera solicitudes ni cálculos reales.
            </p>
          </div>

          {note && (
            <p className="mt-4 text-sm text-neutral-600">{note}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {/* BACK TO LANDING – FIXED */}
            <button
              onClick={() => {
                setSelectedSection(null);
                setSelectedItem(null);
                close();

                const siteUrl =
                process.env.NEXT_PUBLIC_SITE_URL ??
                window.location.origin;

                router.push(siteUrl);
              }}
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
            >
              {backLabel}
            </button>

            {/* CATALOG */}
            <button
              onClick={() => {
                setSelectedSection(null);
                setSelectedItem(null);
                close();
                router.push("/search");
              }}
              className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Ver catálogo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
