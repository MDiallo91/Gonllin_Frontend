import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { MdFormatQuote, MdAdd, MdEdit, MdDelete, MdStar,
         MdVisibility, MdVisibilityOff } from "react-icons/md";
import axios from "axios";
import EmptyState from "../../ui/design_system/empty/EmptyState";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import Modal from "../../ui/design_system/modal/Modal";

const BASE_URL = import.meta.env.VITE_API_URL;

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

export default function AdminTemoignages() {
  const [temoignages, setTemoignages] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [enEdition, setEnEdition]     = useState<any | null>(null);
  const [enCours, setEnCours]         = useState(false);
  const [aSupprimer, setASupprimer]   = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<any>();

  useEffect(() => { charger(); }, []);

  const charger = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/temoignage`, { withCredentials: true });
      setTemoignages(res.data || []);
    } catch { toast.error("Impossible de charger les témoignages"); }
    finally { setLoading(false); }
  };

  const ouvrirCreation = () => {
    setEnEdition(null);
    reset({ nom: "", role: "", texte: "", note: 5, photo: "", actif: true, ordre: 0 });
    setModalOuvert(true);
  };

  const ouvrirEdition = (t: any) => {
    setEnEdition(t);
    reset(t);
    setModalOuvert(true);
  };

  const onSubmit = async (data: any) => {
    setEnCours(true);
    try {
      if (enEdition) {
        await axios.put(`${BASE_URL}/api/temoignage/${enEdition._id}`, data, { withCredentials: true });
        toast.success("Témoignage mis à jour !");
      } else {
        await axios.post(`${BASE_URL}/api/temoignage`, data, { withCredentials: true });
        toast.success("Témoignage ajouté !");
      }
      setModalOuvert(false);
      charger();
    } catch { toast.error("Erreur lors de l'enregistrement"); }
    finally { setEnCours(false); }
  };

  // Bascule actif/inactif directement depuis la liste
  const toggleActif = async (t: any) => {
    try {
      await axios.put(`${BASE_URL}/api/temoignage/${t._id}`, { actif: !t.actif }, { withCredentials: true });
      setTemoignages(prev => prev.map(x => x._id === t._id ? { ...x, actif: !x.actif } : x));
    } catch { toast.error("Erreur"); }
  };

  const supprimer = async () => {
    if (!aSupprimer) return;
    try {
      await axios.delete(`${BASE_URL}/api/temoignage/${aSupprimer}`, { withCredentials: true });
      toast.success("Témoignage supprimé");
      setASupprimer(null);
      charger();
    } catch { toast.error("Erreur lors de la suppression"); }
  };

  return (
    <div className="space-y-6">
      {/* ── En-tête ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MdFormatQuote className="text-primary text-3xl" /> Témoignages
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {temoignages.length} témoignage{temoignages.length > 1 ? "s" : ""} —{" "}
            {temoignages.filter(t => t.actif).length} affiché{temoignages.filter(t => t.actif).length > 1 ? "s" : ""} sur l'accueil
          </p>
        </div>
        <button
          onClick={ouvrirCreation}
          className="flex items-center gap-1 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm"
        >
          <MdAdd className="text-lg" /> Nouveau témoignage
        </button>
      </div>

      {/* ── Liste ────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={3} />)}
        </div>
      ) : temoignages.length === 0 ? (
        <EmptyState
          icon="💬"
          title="Aucun témoignage"
          description="Ajoutez des témoignages clients qui s'afficheront sur la page d'accueil."
          action={{ label: "Ajouter un témoignage", onClick: ouvrirCreation }}
        />
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {temoignages.map(t => (
              <motion.div
                key={t._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`bg-white rounded-2xl shadow-sm p-5 border transition ${t.actif ? "border-gray-100" : "border-dashed border-gray-200 opacity-60"}`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0 overflow-hidden">
                    {t.photo
                      ? <img src={t.photo.startsWith("http") ? t.photo : `${BASE_URL}${t.photo}`} className="w-full h-full object-cover" alt={t.nom} />
                      : t.nom?.[0]?.toUpperCase()
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-gray-900">{t.nom}</p>
                      {t.role && <span className="text-xs text-gray-400">· {t.role}</span>}
                      {/* Étoiles */}
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <MdStar key={j} className={j < t.note ? "text-yellow-400 text-sm" : "text-gray-200 text-sm"} />
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.actif ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {t.actif ? "Affiché" : "Masqué"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 italic">"{t.texte}"</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActif(t)}
                      title={t.actif ? "Masquer" : "Afficher"}
                      className={`p-2 rounded-lg transition ${t.actif ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`}
                    >
                      {t.actif ? <MdVisibility /> : <MdVisibilityOff />}
                    </button>
                    <button
                      onClick={() => ouvrirEdition(t)}
                      className="p-2 rounded-lg text-primary hover:bg-primary/10 transition"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => setASupprimer(t._id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* ── Modal création / édition ──────────────────────────────── */}
      <Modal
        isOpen={modalOuvert}
        onClose={() => setModalOuvert(false)}
        title={enEdition ? "Modifier le témoignage" : "Nouveau témoignage"}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nom *</label>
              <input {...register("nom", { required: true })} placeholder="Aminata S." className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Rôle / Titre</label>
              <input {...register("role")} placeholder="Propriétaire, Artisan..." className={inputCls} />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Témoignage *</label>
            <textarea
              rows={4}
              {...register("texte", { required: true })}
              placeholder="Le témoignage du client..."
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Note (1 à 5)</label>
              <select {...register("note", { valueAsNumber: true })} className={inputCls}>
                {[5, 4, 3, 2, 1].map(n => (
                  <option key={n} value={n}>{n} étoile{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ordre d'affichage</label>
              <input type="number" {...register("ordre", { valueAsNumber: true })} defaultValue={0} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">URL photo (optionnel)</label>
            <input {...register("photo")} placeholder="https://... ou /upload/..." className={inputCls} />
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
            <input type="checkbox" id="actif" {...register("actif")} className="w-4 h-4 accent-primary rounded" />
            <label htmlFor="actif" className="text-sm text-green-800 font-medium">
              Afficher sur la page d'accueil
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOuvert(false)}
              className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={enCours}
              className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {enCours ? "Enregistrement..." : enEdition ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Modal suppression ─────────────────────────────────────── */}
      <Modal isOpen={!!aSupprimer} onClose={() => setASupprimer(null)} title="Supprimer le témoignage" size="sm">
        <p className="text-sm text-gray-600 mb-6">Ce témoignage sera définitivement supprimé de la page d'accueil.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setASupprimer(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
          <button onClick={supprimer} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600">Supprimer</button>
        </div>
      </Modal>
    </div>
  );
}
