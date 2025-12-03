"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  const HIDDEN_ROUTES = [
    "/login",
    "/userSelect",
    "/admin",
  ];


  const hide =
    pathname.startsWith("/vehiculos/") &&
    pathname.endsWith("/pdf") ||
    HIDDEN_ROUTES.some(route => pathname.startsWith(route));

  if (hide) return null;

  return <Footer />;
}
