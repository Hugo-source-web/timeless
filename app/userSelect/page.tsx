import { neue8 } from "../fonts/neuePlak";

export default function AccessPortal() {
  return (
    <div className="flex w-full h-screen">

      {/* LEFT — MANAGE TIMELESS */}
      <div
        className="
          relative flex-1 flex flex-col items-center justify-center
          text-white
          bg-cover bg-center bg-no-repeat
          hover:brightness-160 transition-all
          overflow-hidden
        "
        style={{ backgroundImage: "url('/images/manage.jpg')" }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

        {/* CONTENT */}
        <div className="relative p-6 text-center">
          <h1 className={`${neue8.className} text-6xl font-semibold mb-6 tracking-wide`}>
            Manage Timeless
          </h1>
        </div>
      </div>

      {/* RIGHT — DISCOVER TIMELESS */}
      <div
        className="
          relative flex-1 flex flex-col items-center justify-center
          text-white
          bg-cover bg-center bg-no-repeat
          hover:brightness-160 transition-all
          overflow-hidden
        "
        style={{ backgroundImage: "url('/images/discover.jpg')" }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

        {/* CONTENT */}
        <div className="relative p-6 text-center">
          <h1 className={`${neue8.className} text-6xl font-semibold mb-6 tracking-wide`}>
            Discover Timeless
          </h1>
        </div>
      </div>

    </div>
  );
}
