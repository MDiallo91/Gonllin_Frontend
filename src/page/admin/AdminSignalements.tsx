import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { MdFlag, MdGavel } from "react-icons/md";
import AdminService from "../../service/AdminService";
import type { SignalementTypeForm } from "../../types/FormType";
import StatusBadge from "../../ui/design_system/badge/StatusBadge";
import EmptyState from "../../ui/design_system/empty/EmptyState";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import Pagination from "../../ui/design_system/pagination/Pagination";
import Modal from "../../ui/design_system/modal/Modal";

const BASE_URL = import.meta.env.VITE_API_URL;

// Libellés lisibles pour les types de signalement
const libellesType: Record<string, string> = {
  spam: "Spam",
  arnaque: "Arnaque",
  contenu_inapproprie: "Contenu inapproprié",
  faux_profil: "Faux profil",
  autre: "Autre",
};

export default function AdminSignalements() {
  // ─── État ──────────────────────────────────────────────────────
  const [signalements, setSignalements] = useState<SignalementTypeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filtre par statut
  const [filtreStatut, setFiltreStatut] = useState("");

  // Modal de traitement d'un signalement
  const [signalementATraiter, setSignalementATraiter] = useState<SignalementTypeForm | null>(null);
  const [traitementEnCours, setTraitementEnCours] = useState(false);

  // Formulaire pour la note de l'admin
  const { register, handleSubmit, reset } = useForm<{ noteAdmin: string }>();

  // ─── Chargement des signalements ──────────────────────────────
  useEffect(() => {
    chargerSignalements();
  }, [page, filtreStatut]);

  const chargerSignalements = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getSignalements({
        page,
        statut: filtreStatut || undefined,
      });
      setSignalements(res.signalements || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch {
      toast.error("Impossible de charger les signalements");
    } finally {
      setLoading(false);
    }
  };

  // ─── Ouverture du modal de traitement ─────────────────────────
  const ouvrirTraitement = (signalement: SignalementTypeForm) => {
    setSignalementATraiter(signalement);
    reset({ noteAdmin: "" });
  };

  // ─── Soumettre le traitement ───────────────────────────────────
  const traiter = async (statut: "traite" | "ignore", data: { noteAdmin: string }) => {
    if (!signalementATraiter) return;
    setTraitementEnCours(true);
    try {
      await AdminService.traiterSignalement(signalementATraiter._id, statut, data.noteAdmin);
      toast.success(statut === "traite" ? "Signalement traité ✓" : "Signalement ignoré");
      setSignalementATraiter(null);
      chargerSignalements(); // Recharge la liste pour refléter le changement
    } catch {
      toast.error("Erreur lors du traitement");
    } finally {
      setTraitementEnCours(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── En-tête ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MdFlag className="text-primary text-3xl" /> Signalements</h1>
        <p className="text-gray-500 text-sm mt-1">{total} signalement{total > 1 ? "s" : ""}</p>
      </div>

      {/* ── Filtres par statut ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "Tous", value: "" },
            { label: "En attente", value: "en_attente" },
            { label: "Traités", value: "traite" },
            { label: "Ignorés", value: "ignore" },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => { setFiltreStatut(opt.value); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filtreStatut === opt.value
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table des signalements ───────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : signalements.length === 0 ? (
        <EmptyState
          icon="🚩"
          title="Aucun signalement"
          description="Aucun signalement ne correspond aux filtres sélectionnés."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Signalé par</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Cible</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Description</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Statut</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {signalements.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50/50 transition">
                    {/* Auteur du signalement */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={`${BASE_URL}${s.auteur?.photo}`}
                          className="w-7 h-7 rounded-full object-cover border border-gray-100"
                          alt=""
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-800 truncate max-w-28">
                            {s.auteur?.profile?.prenom} {s.auteur?.profile?.nom}
                          </p>
                          <p className="text-xs text-gray-400">{s.auteur?.role}</p>
                        </div>
                      </div>
                    </td>

                    {/* Personne signalée */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={`${BASE_URL}${s.cible?.photo}`}
                          className="w-7 h-7 rounded-full object-cover border border-gray-100"
                          alt=""
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-800 truncate max-w-28">
                            {s.cible?.profile?.prenom} {s.cible?.profile?.nom}
                          </p>
                          <p className="text-xs text-gray-400">{s.cible?.role}</p>
                        </div>
                      </div>
                    </td>

                    {/* Type de signalement */}
                    <td className="px-5 py-3">
                      <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                        {libellesType[s.type] || s.type}
                      </span>
                    </td>

                    {/* Description courte */}
                    <td className="px-5 py-3">
                      <p className="text-xs text-gray-600 line-clamp-2 max-w-40">
                        {s.description || <span className="text-gray-300 italic">—</span>}
                      </p>
                    </td>

                    {/* Badge statut */}
                    <td className="px-5 py-3">
                      <StatusBadge status={s.statut} />
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString("fr-FR")}
                    </td>

                    {/* Bouton de traitement — uniquement si en attente */}
                    <td className="px-5 py-3 text-right">
                      {s.statut === "en_attente" ? (
                        <button
                          onClick={() => ouvrirTraitement(s)}
                          className="flex items-center gap-1 text-xs text-primary border border-primary/30 px-3 py-1 rounded-lg hover:bg-primary/5 transition"
                        >
                          <MdGavel /> Traiter
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {/* ── Modal de traitement d'un signalement ────────────────── */}
      <Modal
        isOpen={!!signalementATraiter}
        onClose={() => setSignalementATraiter(null)}
        title="Traiter le signalement"
        size="sm"
      >
        {signalementATraiter && (
          <form onSubmit={handleSubmit(data => traiter("traite", data))} className="space-y-4">
            {/* Résumé du signalement */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-orange-800 space-y-1">
              <p><strong>Type :</strong> {libellesType[signalementATraiter.type]}</p>
              {signalementATraiter.description && (
                <p><strong>Description :</strong> {signalementATraiter.description}</p>
              )}
              <p>
                <strong>Signalé par :</strong>{" "}
                {signalementATraiter.auteur?.profile?.prenom} {signalementATraiter.auteur?.profile?.nom} ({signalementATraiter.auteur?.email})
              </p>
              <p>
                <strong>Cible :</strong>{" "}
                {signalementATraiter.cible?.profile?.prenom} {signalementATraiter.cible?.profile?.nom} ({signalementATraiter.cible?.email})
              </p>
            </div>

            {/* Note de l'admin */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Note interne (optionnel)</label>
              <textarea
                rows={3}
                {...register("noteAdmin")}
                placeholder="Décision prise, justification..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-1">
              {/* Ignorer le signalement */}
              <button
                type="button"
                onClick={handleSubmit(data => traiter("ignore", data))}
                disabled={traitementEnCours}
                className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60"
              >
                Ignorer
              </button>
              {/* Marquer comme traité */}
              <button
                type="submit"
                disabled={traitementEnCours}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {traitementEnCours ? "Traitement..." : "Marquer traité"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
