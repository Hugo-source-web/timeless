"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function HeaderWrapper() {
  const pathname = usePathname();

  const HIDDEN_ROUTES = [
    "/login",
    "/userSelect",
    "/admin"
  ];

  const hide =
    pathname.startsWith("/vehiculos/") &&
    pathname.endsWith("/pdf") ||
    HIDDEN_ROUTES.some(route => pathname.startsWith(route));

  if (hide) return null;

  return (
    <>
      <Header />
      <Sidebar />
    </>
  );
}
