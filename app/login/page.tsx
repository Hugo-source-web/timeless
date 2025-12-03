"use client";

import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex flex-col bg-black text-white overflow-hidden">

      {/* MAIN CONTENT */}
      <div className="flex flex-1">

        {/* LEFT — VIDEO */}
        <div className="w-3/4 relative hidden md:block">
            <img
                src="/images/login.jpg"
                alt="Timeless Login Background"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.85]"
            />
        </div>

        {/* RIGHT — LOGIN FORM */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6" style={{ backgroundColor: "#151415" }}>
          <LoginForm />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-3 text-center text-xs text-white/50 ">
        © {new Date().getFullYear()} Timeless Motors. All rights reserved.
      </footer>

    </div>
  );
}
