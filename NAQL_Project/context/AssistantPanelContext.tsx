"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { AssistantPanel } from "@/components/ai/AssistantPanel";

interface AssistantPanelContextValue {
  openAssistant: () => void;
}

const AssistantPanelContext = createContext<AssistantPanelContextValue | null>(null);

export function AssistantPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AssistantPanelContext.Provider value={{ openAssistant: () => setIsOpen(true) }}>
      {children}
      <AssistantPanel open={isOpen} onClose={() => setIsOpen(false)} />
    </AssistantPanelContext.Provider>
  );
}

export function useAssistantPanel(): AssistantPanelContextValue {
  const ctx = useContext(AssistantPanelContext);
  if (!ctx) {
    throw new Error("useAssistantPanel يجب أن يُستخدم داخل AssistantPanelProvider");
  }
  return ctx;
}
