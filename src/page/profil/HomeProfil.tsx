import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import uidContext from "../../AppContext";
import EncherService from "../../service/EncherService";
import ProjetService from "../../service/ProjetService";
import StarRating from "../../ui/design_system/rating/StarRating";
import StatusBadge from "../../ui/design_system/badge/StatusBadge";
import ProfileProgress from "../../ui/design_system/progress/ProfileProgress";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";

const BASE_URL = import.meta.env.VITE_API_URL;

function calcProgress(profile: any, role: string): number {
    if (!profile) return 0;
    const fields = role === "independant"
        ? ["prenom", "nom", "telephone", "bio", "secteur", "zoneIntervention", "adresse", "titre"]
        : role === "client"
            ? ["prenom", "nom", "telephone", "adresse", "ville"]
            : ["nom", "telephone", "bio", "secteur", "adresse", "responsable"];
    const filled = fields.filter(f => profile[f] && profile[f] !== "").length;
    return Math.round((filled / fields.length) * 100);
}

export default function HomeProfil() {
    const user = useContext(uidContext);
    const navigate = useNavigate();
    const [offres, setOffres] = useState<any[]>([]);
    const [projets, setProjets] = useState<any[]>([]);
    const [missions, setMissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetch = async () => {
            setLoading(true);
            try {
                if (user.role === "independant") {
                    const [o, m] = await Promise.all([
                        EncherService.getMesOffres(user._id),
                        EncherService.getEncherByChoix(user._id),
                    ]);
                    setOffres(o.data || []);
                    setMissions(m.result || []);
                } else {
                    const p = await ProjetService.getProjetsByUser(user._id);
                    setProjets(p.projets || []);
                }
            } catch { } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [user]);

    if (!user) return null;
    const progress = calcProgress(user.profile, user.role);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

            {/* Bannière + avatar */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-primary to-primary/60 relative">
                    {user.profile?.banniere && (
                        <img src={`${BASE_URL}${user.profile.banniere}`} className="w-full h-full object-cover" alt="banniere" />
                    )}
                </div>
                <div className="px-6 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-12">
                        <div className="flex items-end gap-4">
                            <img
                                src={`${BASE_URL}${user.photo}`}
                                alt="profil"
                                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                            />
                            <div className="mb-2">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        {user.profile?.prenom} {user.profile?.nom || user.profile?.responsable?.nom || ""}
                                    </h1>
                                    {user.profile?.isVerified && (
                                        <span title="Compte vérifié" className="text-blue-500 text-lg">✓</span>
                                    )}
                                    {user.profile?.statut === "premium" && (
                                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">Premium ✦</span>
                                    )}
                                </div>
                                {user.profile?.titre && <p className="text-gray-500 text-sm">{user.profile.titre}</p>}
                                {user.profile?.secteur && <p className="text-gray-400 text-xs mt-0.5">{user.profile.secteur.nom}</p>}
                                {user.profile?.noteGlobale > 0 && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <StarRating value={Math.round(user.profile.noteGlobale)} readonly size="sm" />
                                        <span className="text-xs text-gray-500">({user.profile.nbAvis} avis)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button onClick={() => navigate("/profil/parametres")} className="md:mb-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                            Modifier le profil
                        </button>
                    </div>
                    <div className="mt-4 max-w-sm">
                        <ProfileProgress percent={progress} />
                    </div>
                </div>
            </div>

            {/* KPIs */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <SkeletonCard key={i} lines={1} />)}
                </div>
            ) : user.role === "independant" ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Offres soumises", value: offres.length, icon: "📤", color: "bg-blue-50 text-blue-700" },
                        { label: "Offres acceptées", value: offres.filter(o => o.statut === "accepte").length, icon: "✅", color: "bg-green-50 text-green-700" },
                        { label: "Missions en cours", value: missions.filter(m => m.projet?.etat === "anCours").length, icon: "🔨", color: "bg-orange-50 text-orange-700" },
                        { label: "Note moyenne", value: user.profile?.noteGlobale ? `${user.profile.noteGlobale}/5` : "—", icon: "⭐", color: "bg-yellow-50 text-yellow-700" },
                    ].map(kpi => (
                        <div key={kpi.label} className={`${kpi.color} rounded-xl p-4 text-center`}>
                            <div className="text-2xl mb-1">{kpi.icon}</div>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <div className="text-xs font-medium mt-0.5">{kpi.label}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { label: "Projets publiés", value: projets.length, icon: "📋", color: "bg-blue-50 text-blue-700" },
                        { label: "En cours", value: projets.filter(p => p.etat === "anCours").length, icon: "🔨", color: "bg-orange-50 text-orange-700" },
                        { label: "Terminés", value: projets.filter(p => p.etat === "termine").length, icon: "✅", color: "bg-green-50 text-green-700" },
                    ].map(kpi => (
                        <div key={kpi.label} className={`${kpi.color} rounded-xl p-4 text-center`}>
                            <div className="text-2xl mb-1">{kpi.icon}</div>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <div className="text-xs font-medium mt-0.5">{kpi.label}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* À propos */}
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">À propos</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">{user.profile?.bio || "Aucune description renseignée."}</p>
                    {user.profile?.competences?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {user.profile.competences.map((c: string) => (
                                <span key={c} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{c}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Infos de contact */}
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Informations</h2>
                    {[
                        { icon: "📧", label: "Email", val: user.email },
                        { icon: "📞", label: "Téléphone", val: user.profile?.telephone },
                        { icon: "📍", label: "Adresse", val: user.profile?.adresse },
                        { icon: "🗺️", label: "Zone", val: user.profile?.zoneIntervention },
                        { icon: "🌐", label: "Site web", val: user.profile?.siteWeb },
                        { icon: "💰", label: "Taux horaire", val: user.profile?.tauxHoraire ? `${user.profile.tauxHoraire} GNF/h` : null },
                    ].filter(i => i.val).map(info => (
                        <div key={info.label} className="flex items-start gap-3 text-sm">
                            <span className="mt-0.5">{info.icon}</span>
                            <div>
                                <span className="text-gray-400 text-xs">{info.label}</span>
                                <p className="text-gray-800 font-medium">{info.val}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Activité récente */}
            {user.role === "independant" && offres.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Offres récentes</h2>
                        <button onClick={() => navigate("/profil/offres")} className="text-primary text-sm font-medium hover:underline">
                            Voir tout
                        </button>
                    </div>
                    <div className="space-y-3">
                        {offres.slice(0, 3).map((o: any) => (
                            <div key={o._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{o.projet?.titre || "Projet sans titre"}</p>
                                    <p className="text-xs text-gray-400">{o.montant ? `${o.montant.toLocaleString()} GNF` : "Montant non précisé"}</p>
                                </div>
                                <StatusBadge status={o.statut} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
