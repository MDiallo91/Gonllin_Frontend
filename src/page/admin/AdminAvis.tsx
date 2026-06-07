import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MdStar, MdVisibility, MdVisibilityOff } from "react-icons/md";
import AdminService from "../../service/AdminService";
import type { AvisTypeForm } from "../../types/FormType";
import StarRating from "../../ui/design_system/rating/StarRating";
import EmptyState from "../../ui/design_system/empty/EmptyState";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import Pagination from "../../ui/design_system/pagination/Pagination";
import Modal from "../../ui/design_system/modal/Modal";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminAvis() {
  // ─── État ──────────────────────────────────────────────────────
  const [avis, setAvis] = useState<AvisTypeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Avis sélectionné pour voir le détail complet
  const [avisSelectionne, setAvisSelectionne] = useState<AvisTypeForm | null>(null);

  // ─── Chargement des avis ───────────────────────────────────────
  useEffect(() => {
    chargerAvis();
  }, [page]);

  const chargerAvis = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getAvis(page);
      setAvis(res.avis || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch {
      toast.error("Impossible de charger les avis");
    } finally {
      setLoading(false);
    }
  };

  // ─── Masquer / démasquer un avis (modération) ─────────────────
  const masquerAvis = async (id: string) => {
    try {
      await AdminService.masquerAvis(id);
      // Mise à jour locale optimiste : inverse isVisible
      setAvis(prev =>
        prev.map(a => a._id === id ? { ...a, isVisible: !a.isVisible } : a)
      );
      toast.success("Avis mis à jour");
    } catch {
      toast.error("Erreur lors de la modération");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── En-tête ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MdStar className="text-primary text-3xl" /> Modération des avis</h1>
        <p className="text-gray-500 text-sm mt-1">{total} avis sur la plateforme</p>
      </div>

      {/* ── Table des avis ───────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} lines={3} />)}
        </div>
      ) : avis.length === 0 ? (
        <EmptyState icon="⭐" title="Aucun avis" description="Aucun avis n'a encore été publié sur la plateforme." />
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
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Auteur</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Destinataire</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Note</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Commentaire</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Statut</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {avis.map(a => (
                  <tr
                    key={a._id}
                    className={`transition hover:bg-gray-50/50 ${!a.isVisible ? "opacity-50" : ""}`}
                  >
                    {/* Auteur de l'avis */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={`${BASE_URL}${a.auteur?.photo}`}
                          className="w-7 h-7 rounded-full object-cover border border-gray-100"
                          alt=""
                        />
                        <span className="text-xs text-gray-700 truncate max-w-24">
                          {a.auteur?.profile?.prenom} {a.auteur?.profile?.nom}
                        </span>
                      </div>
                    </td>

                    {/* Destinataire de l'avis */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={`${BASE_URL}${a.destinataire?.photo}`}
                          className="w-7 h-7 rounded-full object-cover border border-gray-100"
                          alt=""
                        />
                        <span className="text-xs text-gray-700 truncate max-w-24">
                          {a.destinataire?.profile?.prenom} {a.destinataire?.profile?.nom}
                        </span>
                      </div>
                    </td>

                    {/* Note sous forme d'étoiles */}
                    <td className="px-5 py-3">
                      <StarRating value={a.noteGlobale} readonly size="sm" />
                    </td>

                    {/* Début du commentaire */}
                    <td className="px-5 py-3">
                      <p className="text-xs text-gray-600 line-clamp-2 max-w-48">
                        {a.commentaire || <span className="text-gray-300 italic">Aucun commentaire</span>}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                    </td>

                    {/* Pastille visible / masqué */}
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.isVisible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {a.isVisible ? "Visible" : "Masqué"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex gap-2 justify-end">
                        {/* Voir le détail complet */}
                        <button
                          onClick={() => setAvisSelectionne(a)}
                          className="text-xs text-primary border border-primary/30 px-2.5 py-1 rounded-lg hover:bg-primary/5 transition"
                        >
                          Détail
                        </button>
                        {/* Masquer ou rendre visible */}
                        <button
                          onClick={() => masquerAvis(a._id)}
                          className={`flex items-center gap-1 text-xs border px-2.5 py-1 rounded-lg transition ${a.isVisible
                            ? "text-orange-500 border-orange-200 hover:bg-orange-50"
                            : "text-green-600 border-green-200 hover:bg-green-50"
                            }`}
                        >
                          {a.isVisible ? <><MdVisibilityOff /> Masquer</> : <><MdVisibility /> Afficher</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {/* ── Modal détail de l'avis ──────────────────────────────── */}
      <Modal
        isOpen={!!avisSelectionne}
        onClose={() => setAvisSelectionne(null)}
        title="Détail de l'avis"
        size="md"
      >
        {avisSelectionne && (
          <div className="space-y-5">
            {/* En-têtes auteur → destinataire */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img src={`${BASE_URL}${avisSelectionne.auteur?.photo}`} className="w-9 h-9 rounded-full object-cover border border-gray-100" alt="" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {avisSelectionne.auteur?.profile?.prenom} {avisSelectionne.auteur?.profile?.nom}
                  </p>
                  <p className="text-xs text-gray-400">{avisSelectionne.auteur?.email}</p>
                </div>
              </div>
              <span className="text-gray-300 text-lg mx-2">→</span>
              <div className="flex items-center gap-2">
                <img src={`${BASE_URL}${avisSelectionne.destinataire?.photo}`} className="w-9 h-9 rounded-full object-cover border border-gray-100" alt="" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {avisSelectionne.destinataire?.profile?.prenom} {avisSelectionne.destinataire?.profile?.nom}
                  </p>
                  <p className="text-xs text-gray-400">{avisSelectionne.destinataire?.email}</p>
                </div>
              </div>
            </div>

            {/* Note globale */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Note globale</p>
              <StarRating value={avisSelectionne.noteGlobale} readonly size="md" />
            </div>

            {/* Critères détaillés si présents */}
            {avisSelectionne.criteres && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(avisSelectionne.criteres).map(([critere, note]) => (
                  <div key={critere} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 capitalize mb-1">{critere.replace(/_/g, " ")}</p>
                    <StarRating value={note} readonly size="sm" />
                  </div>
                ))}
              </div>
            )}

            {/* Commentaire */}
            {avisSelectionne.commentaire && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Commentaire</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">
                  {avisSelectionne.commentaire}
                </p>
              </div>
            )}

            {/* Réponse du destinataire */}
            {avisSelectionne.reponse && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Réponse du destinataire</p>
                <p className="text-sm text-gray-700 bg-blue-50 rounded-xl p-3 leading-relaxed border border-blue-100">
                  {avisSelectionne.reponse}
                </p>
              </div>
            )}

            {/* Action rapide masquer depuis le modal */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => { masquerAvis(avisSelectionne._id); setAvisSelectionne(null); }}
                className={`text-sm border px-4 py-2 rounded-lg transition ${avisSelectionne.isVisible
                  ? "text-orange-500 border-orange-200 hover:bg-orange-50"
                  : "text-green-600 border-green-200 hover:bg-green-50"
                  }`}
              >
                {avisSelectionne.isVisible ? "Masquer cet avis" : "Rendre visible"}
              </button>
              <button
                onClick={() => setAvisSelectionne(null)}
                className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
