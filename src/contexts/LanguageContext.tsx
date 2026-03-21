import React, { createContext, useContext, useState } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (en: string, hi: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (en) => en,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>("en");
  const t = (en: string, hi: string) => (lang === "hi" ? hi : en);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
