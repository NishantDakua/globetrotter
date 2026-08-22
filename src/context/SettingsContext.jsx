import React, { createContext, useContext, useState, useEffect } from 'react';

const SETTINGS_STORAGE_KEY = 'globetrotter_app_settings';

export const CURRENCY_MAP = {
  USD: { symbol: '$', rate: 1, name: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, name: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, name: 'GBP (£)' },
  JPY: { symbol: '¥', rate: 155, name: 'JPY (¥)' },
  INR: { symbol: '₹', rate: 83.5, name: 'INR (₹)' }
};

export const TRANSLATIONS = {
  'English (US)': {
    home: 'Home',
    myTrips: 'My Trips',
    explore: 'Explore',
    community: 'Community',
    notifications: 'Notifications',
    settings: 'Settings',
    newTrip: 'New Trip',
    currentlyExploring: 'CURRENTLY EXPLORING',
    upcomingBookings: 'UPCOMING BOOKINGS',
    myWishlist: 'MY WISHLIST',
    pastAdventures: 'PAST ADVENTURES',
    editorsPicks: "Editor's Picks",
    exploreTrip: 'Explore Trip',
    addToWishlist: 'Add to Wishlist',
    inWishlist: 'In Wishlist',
    planTrip: 'Plan Trip',
    searchPlaceholder: 'Search destinations, experiences...',
    savedSettings: 'Settings saved!'
  },
  'English (UK)': {
    home: 'Home',
    myTrips: 'My Trips',
    explore: 'Explore',
    community: 'Community',
    notifications: 'Notifications',
    settings: 'Settings',
    newTrip: 'New Trip',
    currentlyExploring: 'CURRENTLY EXPLORING',
    upcomingBookings: 'UPCOMING BOOKINGS',
    myWishlist: 'MY WISHLIST',
    pastAdventures: 'PAST ADVENTURES',
    editorsPicks: "Editor's Choice",
    exploreTrip: 'Explore Trip',
    addToWishlist: 'Add to Favourites',
    inWishlist: 'In Favourites',
    planTrip: 'Plan Trip',
    searchPlaceholder: 'Search destinations, experiences...',
    savedSettings: 'Settings saved!'
  },
  'Français': {
    home: 'Accueil',
    myTrips: 'Mes Voyages',
    explore: 'Explorer',
    community: 'Communauté',
    notifications: 'Notifications',
    settings: 'Paramètres',
    newTrip: 'Nouveau Voyage',
    currentlyExploring: 'EN COURS D’EXPLORATION',
    upcomingBookings: 'RÉSERVATIONS À VENIR',
    myWishlist: 'MA LISTE D’ENVIES',
    pastAdventures: 'AVENTURES PASSÉES',
    editorsPicks: 'Sélection de l’Éditeur',
    exploreTrip: 'Découvrir',
    addToWishlist: 'Ajouter aux envies',
    inWishlist: 'Dans la liste',
    planTrip: 'Planifier',
    searchPlaceholder: 'Rechercher des destinations...',
    savedSettings: 'Paramètres enregistrés !'
  },
  'Deutsch': {
    home: 'Startseite',
    myTrips: 'Meine Reisen',
    explore: 'Entdecken',
    community: 'Community',
    notifications: 'Benachrichtigungen',
    settings: 'Einstellungen',
    newTrip: 'Neue Reise',
    currentlyExploring: 'AKTUELL REISEND',
    upcomingBookings: 'KOMMENDE BUCHUNGEN',
    myWishlist: 'MEINE WUNSCHLISTE',
    pastAdventures: 'VERGANGENE ABENTEUER',
    editorsPicks: 'Empfehlungen',
    exploreTrip: 'Reise erkunden',
    addToWishlist: 'Auf die Wunschliste',
    inWishlist: 'Auf der Wunschliste',
    planTrip: 'Reise planen',
    searchPlaceholder: 'Reiseziele suchen...',
    savedSettings: 'Einstellungen gespeichert!'
  },
  'Español': {
    home: 'Inicio',
    myTrips: 'Mis Viajes',
    explore: 'Explorar',
    community: 'Comunidad',
    notifications: 'Notificaciones',
    settings: 'Ajustes',
    newTrip: 'Nuevo Viaje',
    currentlyExploring: 'EXPLORANDO ACTUAMENTE',
    upcomingBookings: 'PRÓXIMAS RESERVAS',
    myWishlist: 'MI LISTA DE DESEOS',
    pastAdventures: 'AVENTURAS PASADAS',
    editorsPicks: 'Selección del Editor',
    exploreTrip: 'Explorar Viaje',
    addToWishlist: 'Agregar a Deseos',
    inWishlist: 'En Lista de Deseos',
    planTrip: 'Planificar',
    searchPlaceholder: 'Buscar destinos...',
    savedSettings: '¡Ajustes guardados!'
  },
  '日本語': {
    home: 'ホーム',
    myTrips: 'マイ旅',
    explore: '探す',
    community: 'コミュニティ',
    notifications: '通知',
    settings: '設定',
    newTrip: '新しい旅行',
    currentlyExploring: '現在旅行中',
    upcomingBookings: '今後の予約',
    myWishlist: 'ウィッシュリスト',
    pastAdventures: '過去の冒険',
    editorsPicks: '編集部のおすすめ',
    exploreTrip: '旅を探検',
    addToWishlist: 'ウィッシュリストに追加',
    inWishlist: '保存済み',
    planTrip: '旅行を計画',
    searchPlaceholder: '目的地や体験を検索...',
    savedSettings: '設定を保存しました！'
  }
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettingsState] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : { currency: 'USD', language: 'English (US)' };
    } catch {
      return { currency: 'USD', language: 'English (US)' };
    }
  });

  const updateSettings = (newSettings) => {
    setSettingsState(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save settings to localStorage', e);
      }
      return updated;
    });
  };

  // Helper to format price in active currency
  const formatPrice = (amountInUSD) => {
    if (amountInUSD === undefined || amountInUSD === null || isNaN(amountInUSD)) return '';
    const num = typeof amountInUSD === 'string' ? parseFloat(amountInUSD.replace(/[^0-9.]/g, '')) : amountInUSD;
    if (isNaN(num)) return amountInUSD;

    const currInfo = CURRENCY_MAP[settings.currency] || CURRENCY_MAP.USD;
    const converted = num * currInfo.rate;

    if (settings.currency === 'JPY') {
      return `${currInfo.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currInfo.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const getCurrencySymbol = () => {
    return (CURRENCY_MAP[settings.currency] || CURRENCY_MAP.USD).symbol;
  };

  // Helper for translations
  const t = (key) => {
    const langDict = TRANSLATIONS[settings.language] || TRANSLATIONS['English (US)'];
    return langDict[key] || TRANSLATIONS['English (US)'][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, formatPrice, getCurrencySymbol, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
