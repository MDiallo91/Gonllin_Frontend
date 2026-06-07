// ─── Formulaires Auth ─────────────────────────────────────────────────────────
export interface FormPropsType {
    errors: any;
    control?: any;
    register: any;
    handleSubmit: any;
    onSubmit: any;
    isLoading: boolean;
}
export interface RegisterFormType {
    email: string;
    password: string;
    role: "entreprise" | "independant" | "client";
}
export interface LoginFormType {
    email: string;
    password: string;
}
export interface ForgetPasswordFormType {
    email: string;
}
export interface confirmFormType {
    code: string;
}

// ─── Secteur ──────────────────────────────────────────────────────────────────
export interface SecteurFormType {
    nom: string;
    _id: string;
    picture: string;
}
export interface SecteurTypeForm {
    _id: string;
    nom: string;
    picture: string;
    icone?: string;
    couleur?: string;
    description?: string;
    isActive?: boolean;
    ordre?: number;
}

// ─── Profils métier ───────────────────────────────────────────────────────────
export interface TravailleurFormType {
    prenom: string;
    nom: string;
    titre?: string;
    telephone: string;
    adresse: string;
    secteur: string;
    secteurs?: string[];
    competences?: string[];
    langues?: string[];
    zoneIntervention: string;
    disponibilite?: "disponible" | "occupe" | "conge";
    profil: string;
    banniere?: string;
    bio: string;
    siteWeb?: string;
    tauxHoraire?: number;
}
export interface ClientFormType {
    prenom: string;
    nom: string;
    telephone: string;
    adresse?: string;
    ville?: string;
    _id: string;
}
export interface EntrepriseFormType {
    nom: string;
    telephone: string;
    secteur: string;
    secteurs?: string[];
    bio: string;
    adresse: string;
    siteWeb?: string;
    nombreEmployes?: string;
    dateCreation?: string;
    responsable?: { prenom: string; nom: string; titre: string };
    logo?: string;
    banniere?: string;
    _id: string;
}

// ─── Types de données renvoyés par l'API ──────────────────────────────────────
export interface ProfilTypeForm {
    _id: string;
    nom: string;
    prenom?: string;
    titre?: string;
    secteur: SecteurTypeForm;
    secteurs?: SecteurTypeForm[];
    competences?: string[];
    langues?: string[];
    bio: string;
    telephone: string;
    adresse?: string;
    ville?: string;
    zoneIntervention?: string;
    disponibilite?: "disponible" | "occupe" | "conge";
    statut?: "freemium" | "premium";
    noteGlobale?: number;
    nbMissions?: number;
    nbAvis?: number;
    isVerified?: boolean;
    isSuspended?: boolean;
    banniere?: string;
    logo?: string;
    siteWeb?: string;
    responsable?: { prenom: string; nom: string; titre: string };
}
export interface UserTypeForm {
    _id: string;
    role: "independant" | "client" | "entreprise" | "admin";
    profile: ProfilTypeForm;
    email: string;
    photo: string;
    isVerified?: boolean;
    createdAt?: string;
}

// ─── Projet ───────────────────────────────────────────────────────────────────
export interface ProjetTypeForm {
    _id: string;
    titre: string;
    description: string;
    etat: "attente" | "anCours" | "termine" | "annule";
    localite: string;
    secteur: SecteurTypeForm;
    user: UserTypeForm;
    userChoisi?: UserTypeForm;
    budget?: { min: number; max: number };
    photos?: string[];
    dateDebut: "urgent" | "semaine" | "mois" | "flexible";
    visibility?: "public" | "prive";
    createdAt: string;
    updatedAt: string;
}

// ─── Enchère / Offre ──────────────────────────────────────────────────────────
export interface EncherTypeForm {
    _id: string;
    user: UserTypeForm;
    projet: ProjetTypeForm;
    description: string;
    montant: number;
    delaiEstime: number;
    statut: "en_attente" | "accepte" | "refuse" | "retire";
    documents?: string[];
    userChoisi?: UserTypeForm;
    createdAt?: string;
}

// ─── Réalisation ──────────────────────────────────────────────────────────────
export interface RealisationTypeForm {
    _id: string;
    createdAt: Date;
    realisateur: UserTypeForm;
    images: string[];
    description: string;
    titre?: string;
    secteur?: SecteurTypeForm;
    avantPhoto?: string;
    apresPhoto?: string;
    lienVideo?: string;
    dateRealisation?: string;
}

// ─── Avis ─────────────────────────────────────────────────────────────────────
export interface AvisTypeForm {
    _id: string;
    auteur: UserTypeForm;
    destinataire: UserTypeForm;
    projet: ProjetTypeForm;
    noteGlobale: number;
    criteres?: {
        qualite: number;
        delai: number;
        communication: number;
        rapport_qualite_prix: number;
    };
    commentaire?: string;
    reponse?: string;
    isVisible: boolean;
    createdAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface NotificationTypeForm {
    _id: string;
    destinataire: string;
    type: string;
    titre: string;
    message: string;
    lien?: string;
    lu: boolean;
    createdAt: string;
}

// ─── Signalement ──────────────────────────────────────────────────────────────
export interface SignalementTypeForm {
    _id: string;
    auteur: UserTypeForm;
    cible: UserTypeForm;
    type: "spam" | "arnaque" | "contenu_inapproprie" | "faux_profil" | "autre";
    description?: string;
    statut: "en_attente" | "traite" | "ignore";
    createdAt: string;
}

// ─── Pagination générique ─────────────────────────────────────────────────────
export interface PaginationMeta {
    total: number;
    page: number;
    pages: number;
}
