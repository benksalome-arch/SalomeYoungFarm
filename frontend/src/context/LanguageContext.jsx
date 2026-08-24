import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(null);

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
    breeding: "Breeding",
    kidding: "Kidding",

    chickenVaccinations: "Chicken Vaccinations",
    chickenMortality: "Chicken Mortality",
    recordChickenMortality: "Record Chicken Mortality",
    failedRecordMortality: "Failed to record mortality.",
    mortalityCausePlaceholder: "Disease, Predator, Accident...",
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
    noGoatsFound: "No goats found",
    noRabbitsFound: "No rabbits found",
    view: "View",
    birthDate: "Birth Date",
    farmOverview: "Farm Overview",
    feedTypes: "Feed Types",
    inventoryItems: "Inventory Items",
    recentGoats: "Recent Goats",
    farmSummary: "Farm Summary",
    viewAll: "View All",
    tryAnotherSearch: "Try another search or add a new goat.",
    tag: "Tag",
    view: "View",
    birthDate: "Birth Date",
    addChicken: "Add Chicken",
    addRabbit: "Add Rabbit",
    addFeed: "Add Feed",
    addWorker: "Add Worker",
    financeEntry: "Finance Entry",

    goatPhoto: "Goat Photo",
    selectPhoto: "Select Photo",
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

    welcome: "Welcome to Salome Young Farm Management System.",
    viewRecords: "View records",
    reportsDescription: "View farm reports and important information.",
    openReports: "Open Reports",
    settingsDescription: "Configure your farm management system.",
    openSettings: "Open Settings",

    financeManagement: "Finance Management",
    financeDescription:
      "Income, expenses and farm profitability.",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    profit: "Profit",
    transactions: "Transactions",
    addTransaction: "Add Transaction",
    dateColumn: "Date",
    recorded: "Recorded",
    type: "Type",
    category: "Category",
    description: "Description",
    amount: "Amount",
    payment: "Payment",
    noTransactions: "No transactions found.",
    financeEdit: "Edit",
    financeDelete: "Delete",
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
    breeding: "Uzalishaji",
    kidding: "Kuzalisha",

    chickenVaccinations: "Chanjo za Kuku",
    chickenMortality: "Vifo vya Kuku",
    recordChickenMortality: "Rekodi Vifo vya Kuku",
    failedRecordMortality: "Imeshindikana kurekodi kifo.",
    mortalityCausePlaceholder: "Ugonjwa, Mnyama, Ajali...",
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
    noGoatsFound: "Hakuna mbuzi waliopatikana",
    tryAnotherSearch: "Jaribu kutafuta tena au ongeza mbuzi mpya.",
    tag: "Namba ya Sikio",
    view: "Tazama",
    addChicken: "Ongeza Kuku",
    addRabbit: "Ongeza Sungura",
    addFeed: "Ongeza Chakula",
    addWorker: "Ongeza Mfanyakazi",
    financeEntry: "Ingizo la Fedha",

    goatPhoto: "Picha ya Mbuzi",
    selectPhoto: "Chagua Picha",
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

    welcome:
      "Karibu kwenye Mfumo wa Usimamizi wa Salome Young Farm.",
    viewRecords: "Tazama rekodi",
    reportsDescription:
      "Tazama ripoti za shamba na taarifa muhimu.",
    openReports: "Fungua Ripoti",
    settingsDescription:
      "Sanidi mfumo wako wa usimamizi wa shamba.",
    openSettings: "Fungua Mipangilio",

    financeManagement: "Usimamizi wa Fedha",
    financeDescription:
      "Mapato, matumizi na faida ya shamba.",
    totalIncome: "Jumla ya Mapato",
    totalExpenses: "Jumla ya Matumizi",
    profit: "Faida",
    transactions: "Miamala",
    addTransaction: "Ongeza Muamala",
    dateColumn: "Tarehe",
    recorded: "Imerekodiwa",
    type: "Aina",
    category: "Kategoria",
    description: "Maelezo",
    amount: "Kiasi",
    payment: "Malipo",
    noTransactions: "Hakuna miamala iliyopatikana.",
    financeEdit: "Hariri",
    financeDelete: "Futa",
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
    breeding: "Fokkerij",
    kidding: "Geboorten",

    chickenVaccinations: "Kippencaccinaties",
    chickenMortality: "Kippensterfte",
    recordChickenMortality: "Kippensterfte Registreren",
    failedRecordMortality: "Registreren van sterfte mislukt.",
    mortalityCausePlaceholder: "Ziekte, Roofdier, Ongeval...",
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
    noGoatsFound: "Geen geiten gevonden",
    tryAnotherSearch: "Probeer een andere zoekopdracht of voeg een nieuwe geit toe.",
    tag: "Oormerk",
    view: "Bekijken",
    addChicken: "Kip toevoegen",
    addRabbit: "Konijn toevoegen",
    addFeed: "Voer toevoegen",
    addWorker: "Werknemer toevoegen",
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

    welcome:
      "Welkom bij het Salome Young Farm Managementsysteem.",
    viewRecords: "Records bekijken",
    reportsDescription:
      "Bekijk bedrijfsrapporten en belangrijke informatie.",
    openReports: "Rapporten openen",
    settingsDescription:
      "Configureer uw bedrijfsbeheersysteem.",
    openSettings: "Instellingen openen",

    financeManagement: "Financieel Beheer",
    financeDescription:
      "Inkomsten, uitgaven en winstgevendheid van de boerderij.",
    totalIncome: "Totale inkomsten",
    totalExpenses: "Totale uitgaven",
    profit: "Winst",
    transactions: "Transacties",
    addTransaction: "Transactie toevoegen",
    dateColumn: "Datum",
    recorded: "Geregistreerd",
    type: "Type",
    category: "Categorie",
    description: "Beschrijving",
    amount: "Bedrag",
    payment: "Betaling",
    noTransactions: "Geen transacties gevonden.",
    financeEdit: "Bewerken",
    financeDelete: "Verwijderen",
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
      translations[language]?.[key] ??
      translations.en?.[key] ??
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
