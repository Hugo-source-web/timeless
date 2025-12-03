import { prisma } from "@/lib/prisma";
import AnimatedCounter from "@/components/animatedCounter";
import GallerySlider from "@/components/GallerySlider";
import { neue2, neue6 } from "@/app/fonts/neuePlak";
import SpecSheet from "@/components/SpecSheet";
import VehicleActions from "@/components/VehicleActions";

interface VehiclePageProps {
  params: {
    slug: string;
  };
}

export default async function VehiclePage(props: VehiclePageProps) {
  // 🟦 FIX #1 — unwrap params properly
  const { slug } = await props.params;

  // 🟥 FIX #2 — validate slug using the unwrapped value
  if (!slug || typeof slug !== "string") {
    return (
      <main className="text-white p-20">
        <h1 className="text-3xl">Slug inválido.</h1>
      </main>
    );
  }

  // 🟩 FIX #3 — use "slug" directly
  const vehicle = await prisma.vehicle.findUnique({
    where: { slug },
    include: {
      dealership: true,
      media: { orderBy: { sortOrder: "asc" } }
    }
  });

  if (!vehicle) {
    return (
      <main className="text-white p-20">
        <h1 className="text-3xl">Vehículo no encontrado.</h1>
      </main>
    );
  }

  const {
    brand,
    model,
    variant,
    heroVideoUrl,

    // highlight counters
    highlight_0_100_s,
    highlight_power_kw,
    highlight_power_hp,
    highlight_top_speed,

    media
  } = vehicle;

  // Extract images & assign roles
  const heroImages = media
    .filter(m => m.type === "IMAGE" && m.isHero)
    .map(m => m.url);

  const galleryImages = media
    .filter(m => m.type === "IMAGE" && !m.isHero)
    .map(m => m.url);

  return (
    <main className="bg-black text-white">

      {/* HERO VIDEO */}
      <section className="relative h-screen w-full overflow-hidden">
        {heroVideoUrl && (
          <video
            src={heroVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/40 backdrop-brightness-75"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <h1 className={`${neue2.className} text-white text-5xl md:text-7xl font-semibold tracking-wide drop-shadow-lg`}>
            {brand}
          </h1>
          <h3 className={`${neue6.className} text-white text-5xl md:text-7xl font-semibold tracking-wide drop-shadow-lg`}>
            {model}
          </h3>
          {variant && <p className="mt-4 text-xl opacity-80">{variant}</p>}
        </div>
      </section>

      <div className="w-full h-24 bg-gradient-to-b from-black to-white"></div>

      {/* HIGHLIGHT SPECS */}
      <section className="w-full bg-white text-black py-24">
        <div className="text-center mb-20 px-4">
          <h2 className="text-5xl font-semibold tracking-tight mb-2">
            {vehicle.heroTaglineTitle ?? "Prestaciones destacadas"}
          </h2>
          <p className="text-gray-700 text-xl max-w-xl mx-auto">
             {vehicle.heroTaglineBody ?? "Datos clave que definen el carácter de este vehículo."}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 min-h-[630px]">

          {/* LEFT HERO IMAGE */}
          <div className="col-span-2 translate-x-[-8vw] flex items-center justify-center overflow-hidden rounded-md">
            <img
              src={heroImages?.[0] ?? "/placeholder.jpg"}
              alt={`${brand} ${model}`}
              className="w-full object-contain rounded-md"
            />
          </div>

          {/* RIGHT SPECS */}
          <div className="flex flex-col items-center justify-center text-center space-y-12">

            {highlight_0_100_s && (
              <div>
                <h3 className="text-5xl font-semibold">
                  <AnimatedCounter target={highlight_0_100_s} suffix=" s" />
                </h3>
                <p className="text-gray-600 text-sm mt-1">Aceleración 0–100 km/h</p>
              </div>
            )}

            {(highlight_power_kw || highlight_power_hp) && (
              <div>
                <h3 className="text-5xl font-semibold flex items-center justify-center">
                  {highlight_power_kw && (
                    <AnimatedCounter target={highlight_power_kw} suffix=" kW" />
                  )}
                  <span className="mx-2">/</span>
                  {highlight_power_hp && (
                    <AnimatedCounter target={highlight_power_hp} suffix=" CV" />
                  )}
                </h3>
                <p className="text-gray-600 text-sm mt-1">Potencia máxima</p>
              </div>
            )}

            {highlight_top_speed && (
              <div>
                <h3 className="text-5xl font-semibold">
                  <AnimatedCounter target={highlight_top_speed} suffix=" km/h" />
                </h3>
                <p className="text-gray-600 text-sm mt-1">Velocidad máxima</p>
              </div>
            )}

            <button className="px-8 py-3 border border-black rounded-md hover:bg-black hover:text-white transition">
              Todos los detalles técnicos
            </button>

          </div>
        </div>
      </section>

      <div className="w-full h-32 bg-gradient-to-b from-white to-black"></div>

      {/* GALLERY */}
      <section>
        <GallerySlider images={galleryImages} />
      </section>
      {/* PRICE & TEST DRIVE SECTION */}
      <section className="relative w-full h-[85vh] bg-black text-white mt-30 mb-10">

        {/* BACKGROUND IMAGE */}
        <img
          src={heroImages?.[1] ?? heroImages?.[0] ?? "/placeholder.jpg"}
          alt={`${brand} ${model}`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/95 backdrop-blur-[1px]"></div>

        {/* CONTENT INSIDE THE IMAGE */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 space-y-6">

          <h2 className={`${neue6.className} text-5xl font-semibold tracking-tight`}>
            Solicita una prueba de conducción
          </h2>

          <p className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Experimenta el {brand} {model} como debe hacerse: en movimiento.  
            Programa tu prueba o formaliza la adquisición.
          </p>

          {/* PRICE */}
          {vehicle.price && (
            <p className="text-4xl font-bold mt-4 drop-shadow-lg">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR"
              }).format(vehicle.price)}
            </p>
          )}

          {/* BUTTON GROUP */}
         <VehicleActions slug={slug} />

        </div>
      </section>

      <section>
        <SpecSheet vehicle={vehicle} />
      </section>

    </main>
  );
}
