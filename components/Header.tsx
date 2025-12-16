"use client";

import Link from "next/link";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useSidebar } from "@/context/SidebarContext";
import { timelessFont } from "@/public/fonts/timeless";
import { accountSection } from "@/lib/sidebarData";

export default function Header() {
  const { open, setSelectedSection, setSelectedItem } = useSidebar();


  return (
    <header className="w-full h-16 absolute top-0 left-0 z-30">
      
      <div
        className="
          absolute inset-0
          bg-gradient-to-b from-black/70 to-transparent
          pointer-events-none
        "
      />

      <div className="relative h-full flex items-center justify-between px-4">

        <button
          className="p-2 hover:bg-white/10 rounded-md"
          onClick={open}
        >
          <Bars3Icon className="h-6 w-6 text-white" />
        </button>

        <Link
          href="/"
          className={`${timelessFont.className} text-2xl font-bold text-white antialiased tracking-[0.2em] hover:opacity-90 transition`}
          onClick={() => {
            setSelectedSection(null);
            setSelectedItem(null);
          }}
        >
          TIMELESS
        </Link>

        <button
          className="p-2 hover:bg-white/10 rounded-full"
          onClick={() => {
            open();
            setSelectedSection(accountSection.title);
            setSelectedItem(null);
          }}
        >
          <UserCircleIcon className="h-7 w-7 text-white" />
        </button>


      </div>
    </header>
  );
}
