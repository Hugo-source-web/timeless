import "./globals.css";
import Header from "@/components/Header";
import { SidebarProvider } from "@/context/SidebarContext";
import Sidebar from "@/components/Sidebar";
import "leaflet/dist/leaflet.css";
import HeaderWrapper from "@/components/headerWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { Roboto_Condensed } from "next/font/google";
import Footer from "@/components/footer";
import Providers from "./providers";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // you can choose which weights you want
});


export const metadata = {
  title: "Timeless",
  description: "TFG Dealership App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={robotoCondensed.className}>
      <Providers>
        <SidebarProvider>
          <HeaderWrapper />
          <main className="relative">{children}</main>
          <FooterWrapper />
        </SidebarProvider>
      </Providers>
      </body>
    </html>
  );
}