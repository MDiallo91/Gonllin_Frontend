import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// ─── Icônes react-icons ────────────────────────────────────────────────────────
import { MdPeople, MdFolder, MdSend, MdStar, MdBuild,
         MdPersonOutline, MdBusiness, MdAdminPanelSettings } from "react-icons/md";

import AdminService from "../../service/AdminService";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import { useAppConfig } from "../../context/AppConfigContext";

// Carte KPI générique avec icône react-icons
function KpiCard({
  label, value, Icon, colorBg, colorText
}: {
  label: string; value: number;
  Icon: React.ElementType;
  colorBg: string; colorText: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${colorBg} rounded-2xl p-5 flex items-center gap-4 shadow-sm`}
    >
      <div className={`w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center ${colorText}`}>
        <Icon className="text-2xl" />
      </div>
      <div>
        <p className={`text-2xl font-bold ${colorText}`}>{value}</p>
        <p className={`text-xs font-medium opacity-80 mt-0.5 ${colorText}`}>{label}</p>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  // ─── État des statistiques globales ───────────────────────────
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const config = useAppConfig();

  // ─── Chargement des stats au montage ──────────────────────────
  useEffect(() => {
    AdminService.getStats()
      .then(setStats)
      .catch(() => toast.error("Impossible de charger les statistiques"))
      .finally(() => setLoading(false));
  }, []);

  // Extraction du nombre d'utilisateurs par rôle
  const getUsersByRole = (role: string) => {
    if (!stats?.usersByRole) return 0;
    return stats.usersByRole.find((r: any) => r._id === role)?.count || 0;
  };

  // Extraction du nombre de projets par état
  const getProjetsByEtat = (etat: string) => {
    if (!stats?.projetsByEtat) return 0;
    return stats.projetsByEtat.find((e: any) => e._id === etat)?.count || 0;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de la plateforme {config.nomApp}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <>
          {/* ── KPIs globaux ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="Utilisateurs"    value={stats?.totalUsers   || 0} Icon={MdPeople}  colorBg="bg-blue-50"   colorText="text-blue-700" />
            <KpiCard label="Projets"         value={stats?.totalProjets || 0} Icon={MdFolder}  colorBg="bg-indigo-50" colorText="text-indigo-700" />
            <KpiCard label="Offres soumises" value={stats?.totalOffres  || 0} Icon={MdSend}    colorBg="bg-orange-50" colorText="text-orange-700" />
            <KpiCard label="Avis publiés"    value={stats?.totalAvis    || 0} Icon={MdStar}    colorBg="bg-yellow-50" colorText="text-yellow-700" />
          </div>

          {/* ── Utilisateurs par rôle ─────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MdPeople className="text-primary text-xl" /> Utilisateurs par rôle
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { role: "independant", label: "Indépendants", Icon: MdBuild,              colorBg: "bg-green-50",  colorText: "text-green-700" },
                { role: "client",      label: "Clients",       Icon: MdPersonOutline,      colorBg: "bg-teal-50",   colorText: "text-teal-700" },
                { role: "entreprise",  label: "Entreprises",   Icon: MdBusiness,           colorBg: "bg-purple-50", colorText: "text-purple-700" },
                { role: "admin",       label: "Admins",        Icon: MdAdminPanelSettings, colorBg: "bg-red-50",    colorText: "text-red-700" },
              ].map(r => (
                <KpiCard key={r.role} label={r.label} value={getUsersByRole(r.role)} Icon={r.Icon} colorBg={r.colorBg} colorText={r.colorText} />
              ))}
            </div>
          </div>

          {/* ── Projets par état ──────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MdFolder className="text-primary text-xl" /> Répartition des projets
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { etat: "attente", label: "En attente", color: "bg-yellow-100 text-yellow-700" },
                { etat: "anCours", label: "En cours",   color: "bg-blue-100 text-blue-700" },
                { etat: "termine", label: "Terminés",   color: "bg-green-100 text-green-700" },
                { etat: "annule",  label: "Annulés",    color: "bg-red-100 text-red-700" },
              ].map(e => (
                <div key={e.etat} className={`${e.color} rounded-xl p-4 text-center`}>
                  <p className="text-2xl font-bold">{getProjetsByEtat(e.etat)}</p>
                  <p className="text-xs font-medium mt-0.5">{e.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Inscriptions récentes (7 derniers jours) ─────────── */}
          {stats?.inscriptionsRecentes?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MdPeople className="text-primary text-xl" /> Inscriptions — 7 derniers jours
              </h2>
              <div className="flex items-end gap-2 h-32">
                {stats.inscriptionsRecentes.map((jour: any) => {
                  const max = Math.max(...stats.inscriptionsRecentes.map((j: any) => j.count));
                  const height = max === 0 ? 4 : Math.round((jour.count / max) * 100);
                  return (
                    <div key={jour._id} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500 font-medium">{jour.count}</span>
                      <div className="w-full bg-primary rounded-t-md" style={{ height: `${height}%`, minHeight: "4px" }} />
                      <span className="text-[10px] text-gray-400">{jour._id.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
