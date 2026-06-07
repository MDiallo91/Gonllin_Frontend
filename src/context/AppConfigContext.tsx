import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// ─── Type de la configuration publique ────────────────────────────────────────
export interface AppConfig {
  nomApp:          string;
  descriptionApp:  string;
  emailContact:    string;
  telephone:       string;
  adresse:         string;
  logo:            string;
  mentionsLegales: string;
  cgu:             string;
  politique:       string;
  reseaux: {
    facebook:  string;
    discord:   string;
    twitter:   string;
    instagram: string;
  };
}

// Valeurs par défaut utilisées pendant le chargement initial
const defaultConfig: AppConfig = {
  nomApp:          "Gollink",
  descriptionApp:  "Plateforme freelance africaine",
  emailContact:    "contact@gollink.com",
  telephone:       "",
  adresse:         "",
  logo:            "",
  mentionsLegales: "",
  cgu:             "",
  politique:       "",
  reseaux: { facebook: "", discord: "", twitter: "", instagram: "" },
};

// ─── Création du contexte ──────────────────────────────────────────────────────
export const AppConfigContext = createContext<AppConfig>(defaultConfig);

// Hook pratique — import unique dans les composants : const config = useAppConfig()
export const useAppConfig = () => useContext(AppConfigContext);

// ─── Provider — à placer à la racine de l'app ─────────────────────────────────
export function AppConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);

  useEffect(() => {
    // Charge la config depuis la DB une seule fois au démarrage
    axios
      .get(`${BASE_URL}/api/config/public`)
      .then(res => {
        // Fusionne avec les defaults pour ne jamais avoir de valeur undefined
        setConfig(prev => ({ ...prev, ...res.data }));

        // Met également à jour le <title> du navigateur
        if (res.data.nomApp) {
          document.title = res.data.nomApp;
        }
      })
      .catch(() => {
        // En cas d'échec réseau, les valeurs par défaut restent en place
      });
  }, []);

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
}
