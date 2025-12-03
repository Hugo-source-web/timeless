"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import AccountSection from "./sections/AccountSection";
import ProfileSection from "./sections/ProfileSection";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<"account" | "profile">("account");

  if (status === "loading") return <div className="text-white p-10">Cargando...</div>;
  if (!session) return <div className="text-white p-10">No has iniciado sesión.</div>;

  return (
    <div className="min-h-screen bg-black text-white p-7 pt-18">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8 tracking-wide">
        Mi Cuenta
      </h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-white/20 mb-8 pb-2">
        <button
          onClick={() => setTab("account")}
          className={`${tab === "account" ? "text-white font-semibold" : "text-white/40"}`}
        >
          Cuenta
        </button>

        <button
          onClick={() => setTab("profile")}
          className={`${tab === "profile" ? "text-white font-semibold" : "text-white/40"}`}
        >
          Perfil
        </button>
      </div>

      {/* Content */}
      {tab === "account" ? (
        <AccountSection user={session.user} />
      ) : (
        <ProfileSection user={session.user} />
      )}
    </div>
  );
}
