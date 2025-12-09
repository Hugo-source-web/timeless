import { neue8 } from "../../public/fonts/neuePlak";

export default function AccessPortal() {
  return (
    <div className="flex w-full h-screen">

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
 
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

 
        <div className="relative p-6 text-center">
          <h1 className={`${neue8.className} text-6xl font-semibold mb-6 tracking-wide`}>
            Manage Timeless
          </h1>
        </div>
      </div>

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

        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

        <div className="relative p-6 text-center">
          <h1 className={`${neue8.className} text-6xl font-semibold mb-6 tracking-wide`}>
            Discover Timeless
          </h1>
        </div>
      </div>

    </div>
  );
}
