import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import uidContext from "../../AppContext";
import EncherService from "../../service/EncherService";
import type { EncherTypeForm } from "../../types/FormType";
import StatusBadge from "../../ui/design_system/badge/StatusBadge";
import EmptyState from "../../ui/design_system/empty/EmptyState";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import Pagination from "../../ui/design_system/pagination/Pagination";
import Modal from "../../ui/design_system/modal/Modal";
import { useNavigate } from "react-router-dom";

export default function OffresProfil() {
  // ─── État ──────────────────────────────────────────────────────────
  const user = useContext(uidContext);
  const navigate = useNavigate();

  const [offres, setOffres] = useState<EncherTypeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filtreStatut, setFiltreStatut] = useState("");
  const [offreASupprimer, setOffreASupprimer] = useState<string | null>(null);

  // ─── Chargement des offres soumises par le travailleur ─────────────
  useEffect(() => {
    if (!user) return;
    chargerOffres();
  }, [user, page]);

  const chargerOffres = async () => {
    setLoading(true);
    try {
      const res = await EncherService.getMesOffres(user!._id, page);
      setOffres(res.data || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch {
      toast.error("Impossible de charger vos offres");
    } finally {
      setLoading(false);
    }
  };

  // ─── Retrait d'une offre en attente ────────────────────────────────
  const retirerOffre = async () => {
    if (!offreASupprimer) return;
    try {
      await EncherService.delete(offreASupprimer);
      toast.success("Offre retirée");
      setOffreASupprimer(null);
      chargerOffres(); // Rafraîchit la liste
    } catch {
      toast.error("Impossible de retirer l'offre");
    }
  };

  // Filtrage côté client selon le statut sélectionné
  const offresFiltrees = filtreStatut
    ? offres.filter(o => o.statut === filtreStatut)
    : offres;

  const statuts = ["en_attente", "accepte", "refuse", "retire"] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* ── En-tête ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes offres soumises</h1>
          <p className="text-gray-500 text-sm mt-1">{total} offre{total > 1 ? "s" : ""} au total</p>
        </div>
        <button
          onClick={() => navigate("/profil/projet")}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
        >
          + Trouver un projet
        </button>
      </div>

      {/* ── Filtres par statut ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltreStatut("")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${filtreStatut === "" ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          Toutes ({offres.length})
        </button>
        {statuts.map(s => (
          <button
            key={s}
            onClick={() => setFiltreStatut(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${filtreStatut === s ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            <StatusBadge status={s} />
          </button>
        ))}
      </div>

      {/* ── Contenu ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={4} />)}
        </div>
      ) : offresFiltrees.length === 0 ? (
        <EmptyState
          icon="📤"
          title="Aucune offre trouvée"
          description="Vous n'avez pas encore soumis d'offre ou aucune ne correspond au filtre sélectionné."
          action={{ label: "Parcourir les projets", onClick: () => navigate("/profil/projet") }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {offresFiltrees.map(offre => (
            <article
              key={offre._id}
              className="bg-white rounded-2xl shadow-sm p-5 space-y-3 hover:shadow-md transition"
            >
              {/* Projet lié */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base">
                    {offre.projet?.titre || "Projet sans titre"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {offre.projet?.secteur?.nom} · {offre.projet?.localite}
                  </p>
                </div>
                {/* Badge statut de l'offre */}
                <StatusBadge status={offre.statut} />
              </div>

              {/* Détails de l'offre */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  💰 <strong>{offre.montant?.toLocaleString()} GNF</strong>
                </span>
                <span className="flex items-center gap-1">
                  ⏱ <strong>{offre.delaiEstime} jour{offre.delaiEstime > 1 ? "s" : ""}</strong>
                </span>
              </div>

              {/* Motivation */}
              {offre.description && (
                <p className="text-sm text-gray-500 line-clamp-2 bg-gray-50 px-3 py-2 rounded-lg">
                  {offre.description}
                </p>
              )}

              {/* Message si offre acceptée */}
              {offre.statut === "accepte" && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800 font-medium">
                  🎉 Félicitations ! Votre offre a été acceptée. Contactez le client pour commencer.
                </div>
              )}

              {/* Actions : retrait possible uniquement si en attente */}
              {offre.statut === "en_attente" && (
                <div className="flex justify-end gap-3 pt-1">
                  <button
                    onClick={() => setOffreASupprimer(offre._id)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium transition"
                  >
                    Retirer l'offre
                  </button>
                </div>
              )}
            </article>
          ))}
        </motion.div>
      )}

      {/* ── Pagination ───────────────────────────────────────────── */}
      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {/* ── Modal de confirmation de retrait ─────────────────────── */}
      <Modal
        isOpen={!!offreASupprimer}
        onClose={() => setOffreASupprimer(null)}
        title="Retirer l'offre"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-6">
          Êtes-vous sûr de vouloir retirer cette offre ? Cette action est irréversible.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setOffreASupprimer(null)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={retirerOffre}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
          >
            Retirer
          </button>
        </div>
      </Modal>
    </div>
  );
}
