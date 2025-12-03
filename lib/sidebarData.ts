export type SidebarItem = {
  label: string;
  key: string;
  link?: string;
  options?: string[];
};

export type SidebarSection = {
  title: string;
  type: "images" | "text";
  items: SidebarItem[];
};


export const sidebarSections: SidebarSection[] = [
  {
    title: "Cars",
    type: "images",
    items: [
      { label: "Recent Arrivals", key: "recent" },
      { label: "Sports", key: "sports" },
      { label: "SUVs", key: "suv" },
      { label: "Electric", key: "ev" }
    ]
  },

    {
    title: "Financing",
    type: "text",
    items: [
      {
        label: "Loan Calculator",
        key: "calculator",
        options: ["Estimación", "Comparador", "Tabla de intereses"]
      },
      {
        label: "Apply Now",
        key: "apply",
        options: ["Requisitos", "Solicitar ahora", "Documentos necesarios"]
      }
    ]
  }

];

export const accountSection: SidebarSection = {
  title: "Cuenta",
  type: "text",
  items: [
    { label: "Iniciar sesión", key: "signin" },
    { label: "Gestión de cuenta", key: "account" },
    { label: "Privacidad", key: "privacy" },
    { label: "Pedidos y reservas", key: "orders" },
    { label: "Contacto y asistencia", key: "support" },
  ],
};
