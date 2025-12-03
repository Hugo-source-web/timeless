import prisma from "@/lib/prisma";
import VideoHoverHandler from "@/components/VideoHoverHandler";

function formatPrice(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("es-ES")} ${currency || "EUR"}`;
  }
}

export default async function HomePage() {
  // Get all AVAILABLE vehicles with their hero image
  const vehicles = await prisma.vehicle.findMany({
    where: {
      availability: "AVAILABLE",
    },
    include: {
      media: {
        where: {
          type: "IMAGE",
          isHero: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
  });

  // Shuffle and pick 3 distinct vehicles
  const shuffled = [...vehicles].sort(() => Math.random() - 0.5);
  const featured = shuffled.slice(0, 3);

  return (
    <>
    <VideoHoverHandler />
      {/* HERO SECTION */}
      <main className="relative h-screen w-screen overflow-hidden">

        {/* Background Video */}
        <video
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          disablePictureInPicture
        >
          <source src="/videos/landing.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Text Content */}
        <div className="relative z-10 h-full flex items-center pt-[80px]">
          <div className="px-6 md:pl-[8vw] max-w-3xl">

            <h1 className="text-5xl md:text-6xl font-bold text-white opacity-0 animate-fadeInUp [--delay:0ms]">
              Encuentra tu próximo vehículo.
            </h1>

            <p className="mt-4 text-neutral-300 text-lg opacity-0 animate-fadeInUp [--delay:200ms]">
              Explora nuestro catálogo cuidadosamente seleccionado y descubre
              modelos únicos para cada estilo de vida.
            </p>

            <a
              href="/search"
              className="inline-block mt-8 px-8 py-3 w-full text-center text-white font-semibold rounded-md hover:bg-neutral-600 border transition-opacity opacity-0 animate-fadeInUp [--delay:400ms]"
            >
              Explorar catálogo
            </a>

          </div>
        </div>

      </main>

      <div className="w-full h-32 z-50 bg-gradient-to-b from-transparent to-black" />

      {/* FEATURED CARS SECTION */}
      <section className="bg-black text-white pt-40 px-0">
        {/* Title + divider */}
        <div className="px-6 md:px-[4vw] mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Nuestros destacados
          </h2>
          <div className="h-[2px] w-32 bg-white/20" />
        </div>

        {/* FULL-WIDTH 3-COLUMN FEATURE STRIP */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0">
          {featured.map((car, idx) => {
          const animationClass =
            idx === 0 ? "animate-fadeUp" :
            idx === 1 ? "animate-fadeDown" :
                        "animate-fadeUp";

          const heroImage =
            car.thumbnailUrl ||
            car.media[0]?.url ||
            "/images/placeholder-vehicle.jpg";

          const heroAlt =
            car.media[0]?.alt || `${car.brand} ${car.model}`;

          return (
            <a
              key={car.id}
              href={`/vehiculos/${car.slug}`}
              className={`relative group block h-[55vh] md:h-[70vh] overflow-hidden ${animationClass}`}
              style={{ animationDelay: `${idx * 200}ms` }}
            >
              {/* FULL-PANEL IMAGE */}
              <img
                src={heroImage}
                alt={heroAlt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* HOOK FOR HOVER VIDEO (next step) */}
              <video
                src={car.heroVideoUrl || ""} 
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              />

              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

              {/* TEXT OVERLAY */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-semibold text-white">
                  {car.brand} {car.model}
                </h3>

                <p className="text-neutral-300 mt-1 text-sm">
                  {car.year}
                  {car.bodyType ? ` · ${car.bodyType}` : ""}
                  {car.mileageKm != null
                    ? ` · ${car.mileageKm.toLocaleString("es-ES")} km`
                    : ""}
                </p>

                <p className="mt-3 text-xl font-semibold text-white">
                  {formatPrice(car.price, car.currency)}
                </p>
              </div>
            </a>
          );
        })}
        </div>
      </section>

    </>
  );
}
