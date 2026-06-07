import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { MdCategory, MdAdd, MdEdit, MdDelete, MdHome } from "react-icons/md";
import AdminService from "../../service/AdminService";
import SecteurService from "../../service/SecteurService";
import type { SecteurTypeForm } from "../../types/FormType";
import EmptyState from "../../ui/design_system/empty/EmptyState";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import Modal from "../../ui/design_system/modal/Modal";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminSecteurs() {
  // ─── État ──────────────────────────────────────────────────────
  const [secteurs, setSecteurs] = useState<SecteurTypeForm[]>([]);
  const [loading, setLoading] = useState(true);

  // Mode édition ou création
  const [modalOuvert, setModalOuvert] = useState(false);
  const [secteurEnEdition, setSecteurEnEdition] = useState<SecteurTypeForm | null>(null);
  const [enregistrementEnCours, setEnregistrementEnCours] = useState(false);

  // Confirmation de suppression
  const [secteurASupprimer, setSecteurASupprimer] = useState<string | null>(null);

  // Formulaire (react-hook-form)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();

  // ─── Chargement des secteurs ───────────────────────────────────
  useEffect(() => {
    chargerSecteurs();
  }, []);

  const chargerSecteurs = async () => {
    setLoading(true);
    try {
      const res = await SecteurService.get();
      setSecteurs(res || []);
    } catch {
      toast.error("Impossible de charger les secteurs");
    } finally {
      setLoading(false);
    }
  };

  // ─── Ouverture du modal en mode création ──────────────────────
  const ouvrirCreation = () => {
    setSecteurEnEdition(null);
    reset({ nom: "", couleur: "#6366f1", description: "", isActive: true, afficherAccueil: false });
    setModalOuvert(true);
  };

  // ─── Ouverture du modal en mode édition ───────────────────────
  const ouvrirEdition = (secteur: SecteurTypeForm) => {
    setSecteurEnEdition(secteur);
    reset(secteur); // Pré-remplit le formulaire avec les données existantes
    setModalOuvert(true);
  };

  // ─── Soumission : création ou mise à jour ─────────────────────
  const onSubmit = async (data: any) => {
    setEnregistrementEnCours(true);
    try {
      if (secteurEnEdition) {
        // Mode édition : PUT
        await AdminService.updateSecteur(secteurEnEdition._id, data);
        toast.success("Secteur mis à jour !");
      } else {
        // Mode création : POST
        await AdminService.createSecteur(data);
        toast.success("Secteur créé !");
      }
      setModalOuvert(false);
      chargerSecteurs(); // Rafraîchit la liste
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setEnregistrementEnCours(false);
    }
  };

  // ─── Suppression d'un secteur ──────────────────────────────────
  const supprimerSecteur = async () => {
    if (!secteurASupprimer) return;
    try {
      await AdminService.deleteSecteur(secteurASupprimer);
      toast.success("Secteur supprimé");
      setSecteurASupprimer(null);
      chargerSecteurs();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── En-tête ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MdCategory className="text-primary text-3xl" /> Gestion des secteurs</h1>
          <p className="text-gray-500 text-sm mt-1">{secteurs.length} secteur{secteurs.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={ouvrirCreation}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm"
        >
          <MdAdd className="text-lg" /> Nouveau secteur
        </button>
      </div>

      {/* ── Grille des secteurs ──────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : secteurs.length === 0 ? (
        <EmptyState
          icon="🗂"
          title="Aucun secteur"
          description="Créez votre premier secteur d'activité."
          action={{ label: "Créer un secteur", onClick: ouvrirCreation }}
        />
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {secteurs.map(secteur => (
              <motion.div
                key={secteur._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition"
              >
                {/* Image du secteur et couleur */}
                <div
                  className="w-full h-20 rounded-xl flex items-center justify-center text-3xl overflow-hidden"
                  style={{ backgroundColor: secteur.couleur ? `${secteur.couleur}20` : "#e0e7ff" }}
                >
                  {secteur.picture ? (
                    <img src={`${BASE_URL}${secteur.picture}`} className="w-full h-full object-cover rounded-xl" alt={secteur.nom} />
                  ) : (
                    <span>{secteur.icone || "🗂"}</span>
                  )}
                </div>

                {/* Nom et description */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{secteur.nom}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${secteur.isActive !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {secteur.isActive !== false ? "Actif" : "Inactif"}
                    </span>
                    {secteur.afficherAccueil && (
                      <span className="flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                        <MdHome className="text-xs" /> Accueil
                      </span>
                    )}
                  </div>
                  {secteur.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{secteur.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-gray-50 pt-3">
                  <button
                    onClick={() => ouvrirEdition(secteur)}
                    className="flex-1 text-sm text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition"
                  >
                    <MdEdit className="text-sm" /> Modifier
                  </button>
                  <button
                    onClick={() => setSecteurASupprimer(secteur._id)}
                    className="flex-1 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    <MdDelete className="text-sm" /> Supprimer
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* ── Modal création / édition de secteur ─────────────────── */}
      <Modal
        isOpen={modalOuvert}
        onClose={() => setModalOuvert(false)}
        title={secteurEnEdition ? "Modifier le secteur" : "Nouveau secteur"}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom du secteur */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nom du secteur *</label>
            <input
              {...register("nom", { required: "Le nom est obligatoire" })}
              placeholder="ex: Plomberie, Électricité..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.nom && <p className="text-xs text-red-500 mt-0.5">{errors.nom.message as string}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description</label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Description courte du secteur..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Couleur d'accentuation */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Couleur d'accentuation</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register("couleur")}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <span className="text-xs text-gray-400">Choisissez une couleur représentative</span>
            </div>
          </div>

          {/* Statut actif / inactif */}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" {...register("isActive")} className="w-4 h-4 accent-primary rounded" />
            <label htmlFor="isActive" className="text-sm text-gray-700">Secteur actif (visible sur la plateforme)</label>
          </div>

          {/* Afficher sur la page d'accueil */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <input type="checkbox" id="afficherAccueil" {...register("afficherAccueil")} className="w-4 h-4 accent-primary rounded" />
            <label htmlFor="afficherAccueil" className="text-sm text-blue-800 font-medium flex items-center gap-1">
              <MdHome /> Afficher dans la section métiers de la page d'accueil
            </label>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOuvert(false)}
              className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={enregistrementEnCours}
              className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {enregistrementEnCours ? "Enregistrement..." : secteurEnEdition ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Modal confirmation suppression ──────────────────────── */}
      <Modal isOpen={!!secteurASupprimer} onClose={() => setSecteurASupprimer(null)} title="Supprimer le secteur" size="sm">
        <p className="text-sm text-gray-600 mb-6">
          Supprimer ce secteur ? Les projets et profils associés ne seront pas supprimés, mais ils perdront leur lien avec ce secteur.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setSecteurASupprimer(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
          <button onClick={supprimerSecteur} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600">Supprimer</button>
        </div>
      </Modal>
    </div>
  );
}
