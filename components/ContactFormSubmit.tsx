"use client";

import { useState } from "react";

export default function ContactFormSubmit({
  brand,
  model,
}: {
  brand: string;
  model: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // Grab form values from the page inputs
    const name = (document.getElementById("firstName") as HTMLInputElement)?.value;
    const lastName1 = (document.getElementById("lastName1") as HTMLInputElement)?.value;
    const lastName2 = (document.getElementById("lastName2") as HTMLInputElement)?.value;
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const phone = (document.getElementById("phone") as HTMLInputElement)?.value;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          lastName1,
          lastName2,
          email,
          phone,
          brand,
          model,
        }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      alert("¡Su solicitud ha sido enviada! Revise su correo y SMS.");
    } catch (err) {
      console.error(err);
      alert("Hubo un problema enviando la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="px-10 py-4 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition disabled:opacity-50"
    >
      {loading ? "Enviando..." : "Presentar solicitud"}
    </button>
  );
}
