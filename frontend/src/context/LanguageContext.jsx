import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    language: "Language",
    english: "English",
    swahili: "Kiswahili",
    dutch: "Nederlands",

    dashboard: "Dashboard",
    goats: "Goats",
    chickens: "Chickens",
    rabbits: "Rabbits",
    feed: "Feed",
    inventory: "Inventory",
    finance: "Finance",
    workers: "Workers",
    reports: "Reports",
    settings: "Settings",

    rabbitFarm: "Rabbit Farm",
    feedInventory: "Feed & Inventory",
    staff: "Staff",
    system: "System",

    logout: "Logout",
    back: "Back",
    save: "Save",
    cancel: "Cancel",
    add: "Add",
    edit: "Edit",
    delete: "Delete",

    displayPreferences: "Display Preferences",
    displayPreferencesDescription:
      "Choose your preferred language for the application.",
  },

  sw: {
    language: "Lugha",
    english: "Kiingereza",
    swahili: "Kiswahili",
    dutch: "Kiholanzi",

    dashboard: "Dashibodi",
    goats: "Mbuzi",
    chickens: "Kuku",
    rabbits: "Sungura",
    feed: "Chakula",
    inventory: "Hifadhi",
    finance: "Fedha",
    workers: "Wafanyakazi",
    reports: "Ripoti",
    settings: "Mipangilio",

    rabbitFarm: "Ufugaji wa Sungura",
    feedInventory: "Chakula na Hifadhi",
    staff: "Wafanyakazi",
    system: "Mfumo",

    logout: "Toka",
    back: "Rudi",
    save: "Hifadhi",
    cancel: "Ghairi",
    add: "Ongeza",
    edit: "Hariri",
    delete: "Futa",

    displayPreferences: "Mipangilio ya Muonekano",
    displayPreferencesDescription:
      "Chagua lugha unayopendelea kutumia kwenye programu.",
  },

  nl: {
    language: "Taal",
    english: "Engels",
    swahili: "Swahili",
    dutch: "Nederlands",

    dashboard: "Dashboard",
    goats: "Geiten",
    chickens: "Kippen",
    rabbits: "Konijnen",
    feed: "Voer",
    inventory: "Voorraad",
    finance: "Financiën",
    workers: "Werknemers",
    reports: "Rapporten",
    settings: "Instellingen",

    rabbitFarm: "Konijnenhouderij",
    feedInventory: "Voer & Voorraad",
    staff: "Personeel",
    system: "Systeem",

    logout: "Uitloggen",
    back: "Terug",
    save: "Opslaan",
    cancel: "Annuleren",
    add: "Toevoegen",
    edit: "Bewerken",
    delete: "Verwijderen",

    displayPreferences: "Weergavevoorkeuren",
    displayPreferencesDescription:
      "Kies de taal die u voor de applicatie wilt gebruiken.",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("syf_language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("syf_language", language);
  }, [language]);

  function t(key) {
    return (
      translations[language]?.[key] ||
      translations.en[key] ||
      key
    );
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export default LanguageContext;
