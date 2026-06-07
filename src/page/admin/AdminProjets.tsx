import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MdFolder, MdDeleteForever } from "react-icons/md";
import AdminService from "../../service/AdminService";
import SecteurService from "../../service/SecteurService";
import type { ProjetTypeForm, SecteurTypeForm } from "../../types/FormType";
import StatusBadge from "../../ui/design_system/badge/StatusBadge";
import EmptyState from "../../ui/design_system/empty/EmptyState";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import Pagination from "../../ui/design_system/pagination/Pagination";
import Modal from "../../ui/design_system/modal/Modal";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminProjets() {
  // ─── État ──────────────────────────────────────────────────────
  const [projets, setProjets] = useState<ProjetTypeForm[]>([]);
  const [secteurs, setSecteurs] = useState<SecteurTypeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filtres actifs
  const [filtreEtat, setFiltreEtat] = useState("");
  const [filtreSecteur, setFiltreSecteur] = useState("");

  // ID du projet à supprimer (pour le modal de confirmation)
  const [projetASupprimer, setProjetASupprimer] = useState<string | null>(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  // ─── Chargement initial ────────────────────────────────────────
  useEffect(() => {
    SecteurService.get().then(setSecteurs).catch(() => { });
  }, []);

  useEffect(() => {
    chargerProjets();
  }, [page, filtreEtat, filtreSecteur]);

  const chargerProjets = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getProjets({
        page,
        etat: filtreEtat || undefined,
        secteur: filtreSecteur || undefined,
      });
      setProjets(res.projets || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch {
      toast.error("Impossible de charger les projets");
    } finally {
      setLoading(false);
    }
  };

  // ─── Suppression d'un projet ───────────────────────────────────
  const supprimerProjet = async () => {
    if (!projetASupprimer) return;
    setSuppressionEnCours(true);
    try {
      await AdminService.deleteProjet(projetASupprimer);
      toast.success("Projet supprimé avec succès");
      setProjetASupprimer(null);
      chargerProjets();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setSuppressionEnCours(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── En-tête ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MdFolder className="text-primary text-3xl" /> Gestion des projets</h1>
        <p className="text-gray-500 text-sm mt-1">{total} projet{total > 1 ? "s" : ""} sur la plateforme</p>
      </div>

      {/* ── Filtres ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col md:flex-row gap-3">
        {/* Filtre par état */}
        <select
          value={filtreEtat}
          onChange={e => { setFiltreEtat(e.target.value); setPage(1); }}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les états</option>
          <option value="attente">En attente</option>
          <option value="anCours">En cours</option>
          <option value="termine">Terminés</option>
          <option value="annule">Annulés</option>
        </select>

        {/* Filtre par secteur */}
        <select
          value={filtreSecteur}
          onChange={e => { setFiltreSecteur(e.target.value); setPage(1); }}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les secteurs</option>
          {secteurs.map(s => (
            <option key={s._id} value={s._id}>{s.nom}</option>
          ))}
        </select>
      </div>

      {/* ── Table des projets ────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : projets.length === 0 ? (
        <EmptyState icon="📋" title="Aucun projet trouvé" description="Aucun projet ne correspond aux filtres sélectionnés." />
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
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Titre</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Secteur</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Localité</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">État</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projets.map(projet => (
                  <tr key={projet._id} className="hover:bg-gray-50/50 transition">
                    {/* Titre du projet */}
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900 text-sm truncate max-w-40">
                        {projet.titre || "Sans titre"}
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                        {projet.description}
                      </p>
                    </td>

                    {/* Auteur du projet */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={`${BASE_URL}${projet.user?.photo}`}
                          className="w-7 h-7 rounded-full object-cover border border-gray-100"
                          alt=""
                        />
                        <p className="text-xs text-gray-600 truncate max-w-24">
                          {projet.user?.profile?.prenom} {projet.user?.profile?.nom}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-3 text-xs text-gray-600">{projet.secteur?.nom || "—"}</td>
                    <td className="px-5 py-3 text-xs text-gray-600">{projet.localite || "—"}</td>

                    {/* Badge état */}
                    <td className="px-5 py-3">
                      <StatusBadge status={projet.etat} />
                    </td>

                    {/* Date de publication */}
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {new Date(projet.createdAt).toLocaleDateString("fr-FR")}
                    </td>

                    {/* Bouton de suppression */}
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setProjetASupprimer(projet._id)}
                        className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {/* ── Modal de confirmation de suppression ────────────────── */}
      <Modal isOpen={!!projetASupprimer} onClose={() => setProjetASupprimer(null)} title="Supprimer le projet" size="sm">
        <p className="text-sm text-gray-600 mb-6">
          Voulez-vous vraiment supprimer ce projet ? <strong className="text-red-500">Cette action est irréversible.</strong>
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setProjetASupprimer(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Annuler
          </button>
          <button
            onClick={supprimerProjet}
            disabled={suppressionEnCours}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
          >
            {suppressionEnCours ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
