"use client";

import { useState } from "react";
import type { Session } from "next-auth";

export default function AccountSection({ user }: { user: Session["user"] }) {

  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  async function getCSRFToken() {
    const res = await fetch("/api/auth/csrf");
    const data = await res.json();
    return data.csrfToken;
  }

  async function handleLogout() {
    const csrfToken = await getCSRFToken();

    await fetch("/api/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ csrfToken }),
    });

    window.location.href = "/";
  }

  async function updateEmail() {
    await fetch("/api/account/email", {
      method: "PATCH",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    alert("Email actualizado");
  }

  async function updatePassword() {
    await fetch("/api/account/password", {
      method: "PATCH",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });
    alert("Contraseña actualizada");
  }

  async function deleteAccount() {
    const sure = confirm("¿Seguro que deseas eliminar tu cuenta?");
    if (!sure) return;

    await handleLogout();
  }

  return (
    <div className="space-y-10 max-w-md">

      {/* Change Email */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Correo electrónico</h2>
        <input
          type="email"
          className="w-full p-3 rounded bg-white/10 border border-white/20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={updateEmail}
          className="mt-3 px-4 py-2 bg-white/20 rounded hover:bg-white/30"
        >
          Guardar cambios
        </button>
      </div>

      {/* Change Password */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Contraseña</h2>
        <input
          type="password"
          className="w-full p-3 rounded bg-white/10 border border-white/20"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={updatePassword}
          className="mt-3 px-4 py-2 bg-white/20 rounded hover:bg-white/30"
        >
          Cambiar contraseña
        </button>
      </div>

      {/* Delete + Signout */}
      <div className="pt-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-white/10 rounded hover:bg-white/20"
        >
          Cerrar sesión
        </button>

        <button
          onClick={deleteAccount}
          className="w-full px-4 py-3 bg-red-600/70 hover:bg-red-600 rounded mt-4"
        >
          Eliminar cuenta
        </button>
      </div>

    </div>
  );
}
