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
    financeManagement: "Finance Management",
    financeDescription: "Income, expenses and farm profitability.",
    addTransaction: "Add Transaction",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    profit: "Profit",
    transactions: "Transactions",
    recorded: "Recorded",
    type: "Type",
    category: "Category",
    description: "Description",
    amount: "Amount",
    payment: "Payment",
    actions: "Actions",
    noTransactions: "No transactions found.",
    editTransaction: "Edit",
    deleteTransaction: "Delete",
    workers: "Workers",
    reports: "Reports",
    settings: "Settings",

    rabbitFarm: "Rabbit Farm",
    feedInventory: "Feed & Inventory",
    staff: "Staff",
    system: "System",

    breeding: "Breeding",
    kidding: "Kidding",

    chickenVaccinations: "Chicken Vaccinations",
    chickenMortality: "Chicken Mortality",
    eggProduction: "Egg Production",
    eggSales: "Egg Sales",

    feedUsage: "Feed Usage",

    rabbitLitters: "Rabbit Litters",
    rabbitMortality: "Rabbit Mortality",
    rabbitVaccinations: "Rabbit Vaccinations",

    logout: "Logout",
    back: "Back",
    save: "Save",
    cancel: "Cancel",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    close: "Close",
    search: "Search",
    actions: "Actions",
    name: "Name",
    date: "Date",
    status: "Status",
    notes: "Notes",
    weight: "Weight",
    color: "Color",
    breed: "Breed",
    sex: "Sex",
    healthy: "Healthy",

    displayPreferences: "Display Preferences",
    displayPreferencesDescription:
      "Choose your preferred language for the application.",

    profile: "Profile",
    farmInformation: "Farm Information",
    dataManagement: "Data Management",
    preferences: "Preferences",

    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    location: "Location",
    farmName: "Farm Name",

    totalAnimals: "Total Animals",
    totalAnimalRecords: "Total Animal Records",
    quickActions: "Quick Actions",
    systemStatus: "System Status",

    addGoat: "Add Goat",
    addChicken: "Add Chicken",
    addRabbit: "Add Rabbit",
    addFeed: "Add Feed",
    financeEntry: "Finance Entry",

    goatPhoto: "Goat Photo",
    selectPhoto: "Select a photo",
    changePhoto: "Change Photo",

    basicInformation: "Basic Information",
    earTag: "Ear Tag",
    dateOfBirth: "Date of Birth",

    yes: "Yes",
    no: "No",
    loading: "Loading...",
    noRecords: "No records found.",
    success: "Success",
    error: "Error",
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
    financeManagement: "Usimamizi wa Fedha",
    financeDescription: "Mapato, matumizi na faida ya shamba.",
    addTransaction: "Ongeza Muamala",
    totalIncome: "Jumla ya Mapato",
    totalExpenses: "Jumla ya Matumizi",
    profit: "Faida",
    transactions: "Miamala",
    recorded: "Imerekodiwa",
    type: "Aina",
    category: "Kategoria",
    description: "Maelezo",
    amount: "Kiasi",
    payment: "Malipo",
    actions: "Vitendo",
    noTransactions: "Hakuna miamala iliyopatikana.",
    editTransaction: "Hariri",
    deleteTransaction: "Futa",
    workers: "Wafanyakazi",
    reports: "Ripoti",
    settings: "Mipangilio",

    rabbitFarm: "Ufugaji wa Sungura",
    feedInventory: "Chakula na Hifadhi",
    staff: "Wafanyakazi",
    system: "Mfumo",

    breeding: "Uzalishaji",
    kidding: "Kuzalisha",

    chickenVaccinations: "Chanjo za Kuku",
    chickenMortality: "Vifo vya Kuku",
    eggProduction: "Uzalishaji wa Mayai",
    eggSales: "Mauzo ya Mayai",

    feedUsage: "Matumizi ya Chakula",

    rabbitLitters: "Vizazi vya Sungura",
    rabbitMortality: "Vifo vya Sungura",
    rabbitVaccinations: "Chanjo za Sungura",

    logout: "Toka",
    back: "Rudi",
    save: "Hifadhi",
    cancel: "Ghairi",
    add: "Ongeza",
    edit: "Hariri",
    delete: "Futa",
    close: "Funga",
    search: "Tafuta",
    actions: "Vitendo",
    name: "Jina",
    date: "Tarehe",
    status: "Hali",
    notes: "Maelezo",
    weight: "Uzito",
    color: "Rangi",
    breed: "Aina",
    sex: "Jinsia",
    healthy: "Mwenye afya",

    displayPreferences: "Mipangilio ya Muonekano",
    displayPreferencesDescription:
      "Chagua lugha unayopendelea kutumia kwenye programu.",

    profile: "Wasifu",
    farmInformation: "Taarifa za Shamba",
    dataManagement: "Usimamizi wa Data",
    preferences: "Mapendeleo",

    fullName: "Jina Kamili",
    email: "Barua pepe",
    phone: "Simu",
    location: "Mahali",
    farmName: "Jina la Shamba",

    totalAnimals: "Jumla ya Wanyama",
    totalAnimalRecords: "Jumla ya Rekodi za Wanyama",
    quickActions: "Vitendo vya Haraka",
    systemStatus: "Hali ya Mfumo",

    addGoat: "Ongeza Mbuzi",
    addChicken: "Ongeza Kuku",
    addRabbit: "Ongeza Sungura",
    addFeed: "Ongeza Chakula",
    financeEntry: "Ingizo la Fedha",

    goatPhoto: "Picha ya Mbuzi",
    selectPhoto: "Chagua picha",
    changePhoto: "Badilisha Picha",

    basicInformation: "Taarifa za Msingi",
    earTag: "Namba ya Sikio",
    dateOfBirth: "Tarehe ya Kuzaliwa",

    yes: "Ndiyo",
    no: "Hapana",
    loading: "Inapakia...",
    noRecords: "Hakuna rekodi zilizopatikana.",
    success: "Imefanikiwa",
    error: "Hitilafu",
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
    financeManagement: "Financieel Beheer",
    financeDescription: "Inkomsten, uitgaven en winstgevendheid van de boerderij.",
    addTransaction: "Transactie toevoegen",
    totalIncome: "Totale inkomsten",
    totalExpenses: "Totale uitgaven",
    profit: "Winst",
    transactions: "Transacties",
    recorded: "Geregistreerd",
    type: "Type",
    category: "Categorie",
    description: "Beschrijving",
    amount: "Bedrag",
    payment: "Betaling",
    actions: "Acties",
    noTransactions: "Geen transacties gevonden.",
    editTransaction: "Bewerken",
    deleteTransaction: "Verwijderen",
    workers: "Werknemers",
    reports: "Rapporten",
    settings: "Instellingen",

    rabbitFarm: "Konijnenhouderij",
    feedInventory: "Voer & Voorraad",
    staff: "Personeel",
    system: "Systeem",

    breeding: "Fokkerij",
    kidding: "Geboorten",

    chickenVaccinations: "Kippencaccinaties",
    chickenMortality: "Kippensterfte",
    eggProduction: "Eierproductie",
    eggSales: "Eierverkoop",

    feedUsage: "Voergebruik",

    rabbitLitters: "Konijnenworpen",
    rabbitMortality: "Konijnensterfte",
    rabbitVaccinations: "Konijnenvaccinaties",

    logout: "Uitloggen",
    back: "Terug",
    save: "Opslaan",
    cancel: "Annuleren",
    add: "Toevoegen",
    edit: "Bewerken",
    delete: "Verwijderen",
    close: "Sluiten",
    search: "Zoeken",
    actions: "Acties",
    name: "Naam",
    date: "Datum",
    status: "Status",
    notes: "Notities",
    weight: "Gewicht",
    color: "Kleur",
    breed: "Ras",
    sex: "Geslacht",
    healthy: "Gezond",

    displayPreferences: "Weergavevoorkeuren",
    displayPreferencesDescription:
      "Kies de taal die u voor de applicatie wilt gebruiken.",

    profile: "Profiel",
    farmInformation: "Bedrijfsinformatie",
    dataManagement: "Gegevensbeheer",
    preferences: "Voorkeuren",

    fullName: "Volledige naam",
    email: "E-mail",
    phone: "Telefoon",
    location: "Locatie",
    farmName: "Naam van de boerderij",

    totalAnimals: "Totaal aantal dieren",
    totalAnimalRecords: "Totaal aantal dierregistraties",
    quickActions: "Snelle acties",
    systemStatus: "Systeemstatus",

    addGoat: "Geit toevoegen",
    addChicken: "Kip toevoegen",
    addRabbit: "Konijn toevoegen",
    addFeed: "Voer toevoegen",
    financeEntry: "Financiële invoer",

    goatPhoto: "Geitenfoto",
    selectPhoto: "Foto selecteren",
    changePhoto: "Foto wijzigen",

    basicInformation: "Basisinformatie",
    earTag: "Oormerk",
    dateOfBirth: "Geboortedatum",

    yes: "Ja",
    no: "Nee",
    loading: "Laden...",
    noRecords: "Geen gegevens gevonden.",
    success: "Gelukt",
    error: "Fout",
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
