"use client";
import { createContext, useState, useContext, ReactNode } from "react";

interface I18nContextProps {
  language: string;
  setLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nContextProps>({
  language: "bg",
  setLanguage: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("bg");
  return (
    <I18nContext.Provider value={{ language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
} 