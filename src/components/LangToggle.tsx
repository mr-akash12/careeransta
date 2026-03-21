import { useLanguage } from "@/contexts/LanguageContext";

export const LangToggle = () => {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex gap-0 bg-[hsl(240,15%,12%)] border border-[hsl(240,15%,22%)] rounded-lg overflow-hidden shrink-0">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 text-xs font-bold tracking-wide transition-all ${
          lang === "en"
            ? "bg-[hsl(250,100%,70%)] text-white"
            : "text-[hsl(240,15%,55%)] hover:text-[hsl(240,15%,85%)]"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hi")}
        className={`px-3 py-1.5 text-xs font-bold tracking-wide transition-all ${
          lang === "hi"
            ? "bg-[hsl(250,100%,70%)] text-white"
            : "text-[hsl(240,15%,55%)] hover:text-[hsl(240,15%,85%)]"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};
