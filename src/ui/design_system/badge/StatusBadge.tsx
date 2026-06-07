type Status =
    | "attente" | "anCours" | "termine" | "annule"
    | "disponible" | "occupe" | "conge"
    | "freemium" | "premium"
    | "en_attente" | "accepte" | "refuse" | "retire"
    | "traite" | "ignore";

const config: Record<Status, { label: string; classes: string }> = {
    attente:    { label: "En attente",  classes: "bg-yellow-100 text-yellow-800" },
    anCours:    { label: "En cours",    classes: "bg-blue-100 text-blue-800" },
    termine:    { label: "Terminé",     classes: "bg-green-100 text-green-800" },
    annule:     { label: "Annulé",      classes: "bg-red-100 text-red-800" },
    disponible: { label: "Disponible",  classes: "bg-green-100 text-green-800" },
    occupe:     { label: "Occupé",      classes: "bg-orange-100 text-orange-800" },
    conge:      { label: "En congé",    classes: "bg-gray-100 text-gray-600" },
    freemium:   { label: "Freemium",    classes: "bg-gray-100 text-gray-600" },
    premium:    { label: "Premium ✦",   classes: "bg-purple-100 text-purple-700" },
    en_attente: { label: "En attente",  classes: "bg-yellow-100 text-yellow-800" },
    accepte:    { label: "Acceptée",    classes: "bg-green-100 text-green-800" },
    refuse:     { label: "Refusée",     classes: "bg-red-100 text-red-800" },
    retire:     { label: "Retirée",     classes: "bg-gray-100 text-gray-600" },
    traite:     { label: "Traité",      classes: "bg-green-100 text-green-800" },
    ignore:     { label: "Ignoré",      classes: "bg-gray-100 text-gray-500" },
};

export default function StatusBadge({ status }: { status: Status }) {
    const { label, classes } = config[status] ?? { label: status, classes: "bg-gray-100 text-gray-600" };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
            {label}
        </span>
    );
}
