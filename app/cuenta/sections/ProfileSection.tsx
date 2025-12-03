"use client";

import { useState } from "react";
import type { Session } from "next-auth";

export default function ProfileSection({ user }: { user: Session["user"] }) {
  const [name, setName] = useState(user?.name || "");

  async function updateName() {
    await fetch("/api/account/name", {
      method: "PATCH",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });
    alert("Nombre actualizado");
  }

  return (
    <div className="space-y-10 max-w-md">

      <div>
        <h2 className="text-xl font-semibold mb-3">Nombre</h2>
        <input
          type="text"
          className="w-full p-3 rounded bg-white/10 border border-white/20"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={updateName}
          className="mt-3 px-4 py-2 bg-white/20 rounded hover:bg-white/30"
        >
          Guardar cambios
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Información del usuario</h2>
        <p className="text-white/60">Rol: {user?.role}</p>
        <p className="text-white/60">ID: {user?.id}</p>
      </div>

    </div>
  );
}
