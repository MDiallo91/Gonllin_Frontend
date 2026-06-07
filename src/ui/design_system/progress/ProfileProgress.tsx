interface Props {
    percent: number;
    label?: string;
}

export default function ProfileProgress({ percent, label }: Props) {
    const clamped = Math.min(100, Math.max(0, percent));
    const color = clamped < 40 ? "bg-red-400" : clamped < 70 ? "bg-yellow-400" : "bg-green-500";

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">{label ?? "Complétude du profil"}</span>
                <span className="text-xs font-bold text-gray-700">{clamped}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${clamped}%` }} />
            </div>
            {clamped < 100 && (
                <p className="text-xs text-gray-400 mt-1">
                    {clamped < 40 ? "Complétez votre profil pour être visible" : clamped < 70 ? "Encore quelques infos à renseigner" : "Profil presque complet !"}
                </p>
            )}
        </div>
    );
}
