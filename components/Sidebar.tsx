// components/Sidebar.tsx
"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSidebar } from "@/context/SidebarContext";
import { accountSection, sidebarSections } from "@/lib/sidebarData";
import { UserIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { neue2, neue3, neue6, neue7, neue8, neue9 } from "@/app/fonts/neuePlak";
import { agdasima1, agdasima2 } from "@/app/fonts/Agdasima";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Vehicle, MediaAsset } from "@prisma/client";
import { useSession } from "next-auth/react";

type VehicleWithMedia = Vehicle & { media: MediaAsset[] };

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut", // literal that matches FM's union
    },
  },
};


export default function Sidebar() {
  const {
    isOpen,
    close,
    selectedSection,
    setSelectedSection,
    selectedItem,
    setSelectedItem,
  } = useSidebar();

  const router = useRouter();

  const [vehicles, setVehicles] = useState<VehicleWithMedia[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
  if (!selectedItem) return;
  if (selectedSectionObj?.type !== "images") return;

  async function load() {
    const res = await fetch(`/api/vehicles?category=${selectedItem}`);
    const data = await res.json();
    setVehicles(data);
  }

  load();
}, [selectedItem]);


  const selectedSectionObj = 
  sidebarSections.find((s) => s.title === selectedSection) 
  || (selectedSection === accountSection.title ? accountSection : null);

  const selectedItemObj = selectedSectionObj?.items.find(
    (item) => item.key === selectedItem
  ) || null;

  return (
    <>
      {/* Background overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sliding sidebar */}
        <aside
          className={`
            fixed top-6 left-6 h-[calc(100vh-3rem)] 
            bg-white/90 backdrop-blur-md 
            shadow-2xl rounded-md 
            transition-all duration-300 z-[200] w-[65vw]

            ${isOpen 
              ? "opacity-100 scale-100 pointer-events-auto" 
              : "opacity-0 scale-95 pointer-events-none"
            }
          `}
        >
          {/* Close button INSIDE the sidebar */}
        <button
          onClick={close}
          className="
            absolute top-4 left-4
            p-2
            transition
            z-[300]
            translate-x-[-0.5vw]
            translate-y-[-0.5vw]
          "
        >
          <XMarkIcon className="h-5 w-5 text-gray-700" />
        </button>

        <div className="flex h-full">
          {/* LEFT: sections + options */}
          <motion.div
            className="w-[35%] border-r p-4 overflow-y-auto"
            variants={containerVariants}
            initial="hidden"
            animate={isOpen ? "show" : "hidden"}
          >

            {/* Header + close */}

            {/* Sections */}
            {sidebarSections.map((section) => (
              <div key={section.title} className= "mb-1 pt-9.5">
                  <motion.h3
                    variants={itemVariants}
                    className={`${agdasima2.className} text-sm font-semibold text-black/50 text-xl uppercase tracking-wide mb-2`}
                  >
                    {section.title}
                  </motion.h3>

                <ul>
                  {section.items.map((item, index) => (
                  <motion.li
                    variants={itemVariants}
                    key={item.key}
                    onClick={() => {
                      setSelectedSection(section.title);
                      setSelectedItem(item.key);
                    }}
                    className={`${agdasima1.className} cursor-pointer py-2 px-3 text-2xl flex items-center justify-between rounded-md transition
                      ${selectedItem === item.key ? "text-black font-medium" : "text-gray-700"}
                    `}
                  >
                    <span>{item.label}</span>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  </motion.li>
                  ))}
                </ul>
              </div>
            ))}

              <motion.div
                variants={itemVariants}
                onClick={() => {
                  setSelectedSection(accountSection.title);
                  setSelectedItem(null);
                }}
                className={`${agdasima1.className}
                  flex items-center justify-between cursor-pointer 
                  py-3 px-3 mt-10 rounded-md transition translate-y-[35vh]
                  ${selectedSection === accountSection.title ? "text-black font-medium" : "text-gray-700"}
                `}
              >
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-gray-900" />
                  <span className="text-2xl">{accountSection.title}</span>
                </div>
              </motion.div>
          </motion.div>

              {/* RIGHT: section content (images-only OR text-only) */}
                <div className="w-[65%] p-4 overflow-y-auto">
                  <motion.div
                    key={selectedItem || selectedSection} 
                    // key ensures animation triggers on every change
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="w-full h-full"
                  >
                      {/* IMAGE-type SECTION (Cars, SUVs, EV, etc.) */}
                        {selectedSectionObj?.type === "images" && selectedItem && (
                        <>
                          {vehicles.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                              {vehicles.map((v) => (
                                <div key={v.id} 
                                onClick={() => {router.push(`/vehiculos/${v.slug}`); close();}}
                                className="relative h-48 w-full rounded-md overflow-hidden cursor-pointer transition-all duration-200 hover:scale[1.03] hover:shadow-lg active:scale-[0.98]">
                                  <img
                                    src={v.thumbnailUrl ?? v.media?.[0]?.url ?? "/thumb.jpg"}
                                    alt={v.model ?? "Vehicle"}
                                    className="h-full w-full object-cover rounded-md"
                                  />

                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                                  <div className="absolute bottom-2 left-3">
                                    <p className="text-white text-lg font-semibold drop-shadow">
                                      {v.brand} {v.model}
                                    </p>
                                  </div>

                                </div>
                              ))}
                            </div>
                          ) : (
                            <p>No vehicles found.</p>
                          )}
                        </>
                      )}



                      {/* TEXT-type section */}
                      {selectedSectionObj?.type === "text" && !selectedItem && (
                        <div className="space-y-4 pt-[7.5vh]">
                          <div className={`${neue9.className} flex flex-col gap-2 text-black text-3xl`}>
                            {selectedSectionObj.items.map((item) => (
                              <motion.div key={item.key} variants={itemVariants}>
                                {item.key === "signin" ? (
                                  session?.user ? (
                                    <div className="w-full px-4 py-3 rounded-md  text-black">
                                      Bienvenido, {session.user.name ?? "usuario"}
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        router.push("/login");
                                        close();
                                      }}
                                      className="
                                        w-full px-4 py-3 rounded-md 
                                        bg-black text-white 
                                        transition duration-200 
                                        hover:bg-black/80
                                      "
                                    >
                                      {item.label}
                                    </button>
                                  )
                                ) : item.key === "account" ? (
                                    /* NEW: ACCOUNT MANAGEMENT REDIRECT */
                                    <button
                                      onClick={() => {
                                        router.push("/cuenta");
                                        close();
                                      }}
                                      className="
                                        text-left px-4 py-2 rounded
                                        transition-colors duration-200
                                        hover:text-black/70
                                      "
                                    >
                                      {item.label}
                                    </button>

                                  ) : (
                                  // Normal text item (unchanged behavior)
                                  <button
                                    onClick={() => {
                                      setSelectedSection(selectedSectionObj.title);
                                      setSelectedItem(item.key);
                                    }}
                                    className="
                                      text-left px-4 py-2 rounded 
                                      transition-colors duration-200 
                                      hover:text-black/70
                                    "
                                  >
                                    {item.label}
                                  </button>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}


                      {selectedSectionObj?.type === "text" && selectedItemObj && (
                        <div className="space-y-4 pt-[7.5vh]">

                          {selectedItemObj.options ? (
                            <div className={`${neue9.className} flex flex-col gap-2 text-black text-3xl`}>
                              {selectedItemObj.options.map((op) => (
                                <motion.button
                                  key={op}
                                  variants={itemVariants}
                                  className="text-left px-4 py-2 rounded transition-colors duration-200 hover:text-black/70"
                                >
                                  {op}
                                </motion.button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">No hay opciones definidas.</p>
                          )}
                        </div>
                      )}
                  </motion.div>
                </div>
            </div>
      </aside>
    </>
  );
}
