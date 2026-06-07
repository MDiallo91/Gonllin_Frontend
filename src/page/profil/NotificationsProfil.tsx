import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import NotificationService from "../../service/NotificationService";
import type { NotificationTypeForm } from "../../types/FormType";
import EmptyState from "../../ui/design_system/empty/EmptyState";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import Pagination from "../../ui/design_system/pagination/Pagination";

// Icône selon le type de notification
const iconeParType: Record<string, string> = {
  nouvelle_offre: "📤",
  offre_acceptee: "✅",
  offre_refusee: "❌",
  nouveau_message: "💬",
  projet_cloture: "🏁",
  demande_notation: "⭐",
  avis_recu: "💬",
  compte_verifie: "✓",
  compte_premium: "✦",
  projet_publie: "📋",
  signalement: "🚩",
};

export default function NotificationsProfil() {
  const navigate = useNavigate();

  // ─── État ──────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<NotificationTypeForm[]>([]);
  const [nonLues, setNonLues] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // ─── Chargement des notifications ──────────────────────────────
  useEffect(() => {
    chargerNotifications();
  }, [page]);

  const chargerNotifications = async () => {
    setLoading(true);
    try {
      const res = await NotificationService.getMesNotifications(page);
      setNotifications(res.notifications || []);
      setNonLues(res.nonLues || 0);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch {
      toast.error("Impossible de charger les notifications");
    } finally {
      setLoading(false);
    }
  };

  // ─── Marquer une notification comme lue et rediriger ──────────
  const handleClick = async (notif: NotificationTypeForm) => {
    if (!notif.lu) {
      await NotificationService.marquerLue(notif._id);
      // Mise à jour locale immédiate sans rechargement
      setNotifications(prev =>
        prev.map(n => n._id === notif._id ? { ...n, lu: true } : n)
      );
      setNonLues(prev => Math.max(0, prev - 1));
    }
    if (notif.lien) navigate(notif.lien);
  };

  // ─── Tout marquer comme lu ─────────────────────────────────────
  const toutMarquerLu = async () => {
    await NotificationService.marquerToutesLues();
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
    setNonLues(0);
    toast.success("Toutes les notifications marquées comme lues");
  };

  // ─── Supprimer une notification ────────────────────────────────
  const supprimerNotif = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Évite de déclencher handleClick
    await NotificationService.delete(id);
    setNotifications(prev => prev.filter(n => n._id !== id));
    setTotal(prev => prev - 1);
  };

  // Formatage relatif de la date (ex: "il y a 2h")
  const formatDate = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `il y a ${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `il y a ${hrs}h`;
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* ── En-tête ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">
            {nonLues > 0 ? `${nonLues} non lue${nonLues > 1 ? "s" : ""}` : "Tout est à jour"}
          </p>
        </div>
        {nonLues > 0 && (
          <button
            onClick={toutMarquerLu}
            className="text-sm text-primary font-medium hover:underline"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* ── Liste des notifications ──────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="Aucune notification"
          description="Vous n'avez pas encore de notifications. Elles apparaîtront ici."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          {notifications.map(notif => (
            <div
              key={notif._id}
              onClick={() => handleClick(notif)}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition cursor-pointer group
                ${notif.lu
                  ? "bg-white border-gray-100 hover:border-gray-200"
                  : "bg-blue-50/60 border-blue-100 hover:border-blue-200"
                }`}
            >
              {/* Icône du type de notification */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
                ${notif.lu ? "bg-gray-100" : "bg-white shadow-sm"}`}>
                {iconeParType[notif.type] ?? "🔔"}
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${notif.lu ? "font-medium text-gray-700" : "font-semibold text-gray-900"}`}>
                  {notif.titre}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(notif.createdAt)}</p>
              </div>

              {/* Bouton de suppression — visible au survol */}
              <button
                onClick={e => supprimerNotif(notif._id, e)}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition text-lg leading-none flex-shrink-0"
                title="Supprimer"
              >
                ×
              </button>

              {/* Pastille bleue si non lue */}
              {!notif.lu && (
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </motion.div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
}
