"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type SidebarContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;

  selectedSection: string | null;
  setSelectedSection: (section: string) => void;

  selectedItem: string | null;
  setSelectedItem: (item: string | null) => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // Disable body scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, selectedSection, setSelectedSection, selectedItem, setSelectedItem}}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
  return ctx;
}
