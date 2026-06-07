import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import uidContext from "../../AppContext";
import EntrepriseService from "../../service/EntrepriseService";
import SecteurService from "../../service/SecteurService";
import ProjetService from "../../service/ProjetService";
import AvisService from "../../service/AvisService";
import type { AvisTypeForm, ProjetTypeForm, SecteurTypeForm } from "../../types/FormType";
import StarRating from "../../ui/design_system/rating/StarRating";
import StatusBadge from "../../ui/design_system/badge/StatusBadge";
import EmptyState from "../../ui/design_system/empty/EmptyState";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import Modal from "../../ui/design_system/modal/Modal";
import ProfileProgress from "../../ui/design_system/progress/ProfileProgress";

const BASE_URL = import.meta.env.VITE_API_URL;

// Calcul du taux de complétion du profil entreprise
const calcProgress = (profile: any) => {
  if (!profile) return 0;
  const champs = ["nom", "telephone", "bio", "adresse", "secteur", "responsable", "siteWeb", "logo"];
  const remplis = champs.filter(c => profile[c] && (typeof profile[c] !== "object" || profile[c]?.nom || profile[c]?.prenom)).length;
  return Math.round((remplis / champs.length) * 100);
};

export default function EntrepriseProfil() {
  const user = useContext(uidContext);
  const navigate = useNavigate();

  // ─── État local ──────────────────────────────────────────────
  const [projets, setProjets] = useState<ProjetTypeForm[]>([]);
  const [avis, setAvis] = useState<AvisTypeForm[]>([]);
  const [secteurs, setSecteurs] = useState<SecteurTypeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState<"projets" | "avis" | "infos">("projets");
  const [showEditModal, setShowEditModal] = useState(false);
  const [enregistrementEnCours, setEnregistrementEnCours] = useState(false);

  // Formulaire d'édition du profil entreprise
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: user?.profile || {} });

  // ─── Chargement des données ───────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    Promise.all([
      ProjetService.getProjetsByUser(user._id),
      AvisService.getAvisByUser(user._id),
      SecteurService.get(),
    ]).then(([projetsRes, avisRes, secteursRes]) => {
      setProjets(projetsRes.projets || []);
      setAvis(avisRes.avis || []);
      setSecteurs(secteursRes || []);
    }).catch(() => toast.error("Erreur de chargement")).finally(() => setLoading(false));
  }, [user]);

  // ─── Mise à jour du profil entreprise ────────────────────────
  const onSubmitProfil = async (data: any) => {
    setEnregistrementEnCours(true);
    try {
      await EntrepriseService.update(user!.profile._id, data);
      toast.success("Profil mis à jour !");
      setShowEditModal(false);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setEnregistrementEnCours(false);
    }
  };

  if (!user) return null;
  const progress = calcProgress(user.profile);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* ── Bannière + Identité entreprise ─────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Bannière couleur ou image */}
        <div className="h-44 bg-gradient-to-r from-indigo-600 to-primary relative">
          {user.profile?.banniere && (
            <img src={`${BASE_URL}${user.profile.banniere}`} className="w-full h-full object-cover" alt="banniere" />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-14">
            <div className="flex items-end gap-4">
              {/* Logo de l'entreprise */}
              <div className="w-24 h-24 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center overflow-hidden">
                {user.profile?.logo ? (
                  <img src={`${BASE_URL}${user.profile.logo}`} className="w-full h-full object-cover" alt="logo" />
                ) : (
                  <span className="text-4xl">🏢</span>
                )}
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{user.profile?.nom || "Mon entreprise"}</h1>
                  {user.profile?.isVerified && (
                    <span title="Entreprise vérifiée" className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ Vérifiée</span>
                  )}
                  {user.profile?.statut === "premium" && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">Premium ✦</span>
                  )}
                </div>
                {user.profile?.secteur && (
                  <p className="text-gray-500 text-sm">{user.profile.secteur.nom}</p>
                )}
                {/* Note globale */}
                {user.profile?.noteGlobale > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating value={Math.round(user.profile.noteGlobale)} readonly size="sm" />
                    <span className="text-xs text-gray-500">({user.profile.nbAvis} avis)</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => { reset(user.profile); setShowEditModal(true); }}
              className="md:mb-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ✏️ Modifier le profil
            </button>
          </div>

          {/* Barre de complétion du profil */}
          <div className="mt-4 max-w-md">
            <ProfileProgress percent={progress} />
          </div>

          {/* KPIs rapides */}
          <div className="grid grid-cols-3 gap-4 mt-5">
            {[
              { label: "Projets publiés", value: projets.length },
              { label: "En cours", value: projets.filter(p => p.etat === "anCours").length },
              { label: "Avis reçus", value: avis.length },
            ].map(kpi => (
              <div key={kpi.label} className="text-center">
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Onglets ─────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-100 gap-6">
        {(["projets", "avis", "infos"] as const).map(o => (
          <button
            key={o}
            onClick={() => setOnglet(o)}
            className={`pb-2 text-sm font-medium capitalize transition border-b-2 ${onglet === o ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-800"}`}
          >
            {o === "projets" ? "Projets" : o === "avis" ? "Avis & Notations" : "Informations"}
          </button>
        ))}
      </div>

      {/* ── Contenu selon onglet ─────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={onglet}>

          {/* ONGLET : Projets */}
          {onglet === "projets" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{projets.length} projet{projets.length > 1 ? "s" : ""}</p>
                <button
                  onClick={() => navigate("/profil/mes-projets")}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
                >
                  + Nouveau projet
                </button>
              </div>
              {projets.length === 0 ? (
                <EmptyState icon="📋" title="Aucun projet" description="Publiez votre premier projet." action={{ label: "Publier", onClick: () => navigate("/profil/mes-projets") }} />
              ) : projets.map(projet => (
                <div key={projet._id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{projet.titre}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{projet.localite} · {projet.secteur?.nom}</p>
                  </div>
                  <StatusBadge status={projet.etat} />
                </div>
              ))}
            </div>
          )}

          {/* ONGLET : Avis */}
          {onglet === "avis" && (
            <div className="space-y-4">
              {avis.length === 0 ? (
                <EmptyState icon="⭐" title="Aucun avis" description="Les avis apparaîtront ici après vos premières missions." />
              ) : avis.map(a => (
                <div key={a._id} className="bg-white rounded-xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center gap-3">
                    <img src={`${BASE_URL}${a.auteur?.photo}`} className="w-9 h-9 rounded-full object-cover" alt="" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{a.auteur?.profile?.prenom} {a.auteur?.profile?.nom}</p>
                      <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  <StarRating value={a.noteGlobale} readonly size="sm" />
                  {a.commentaire && <p className="text-sm text-gray-600">{a.commentaire}</p>}
                  {a.reponse && (
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500 border-l-2 border-primary">
                      <span className="font-semibold">Votre réponse :</span> {a.reponse}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ONGLET : Informations */}
          {onglet === "infos" && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              {[
                { icon: "📧", label: "Email", val: user.email },
                { icon: "📞", label: "Téléphone", val: user.profile?.telephone },
                { icon: "📍", label: "Adresse", val: user.profile?.adresse },
                { icon: "🌐", label: "Site web", val: user.profile?.siteWeb },
                { icon: "👥", label: "Taille", val: user.profile?.nombreEmployes ? `${user.profile.nombreEmployes} employés` : null },
                { icon: "👤", label: "Responsable", val: user.profile?.responsable?.prenom ? `${user.profile.responsable.prenom} ${user.profile.responsable.nom}` : null },
              ].filter(i => i.val).map(info => (
                <div key={info.label} className="flex items-start gap-3 text-sm border-b border-gray-50 pb-3 last:border-0">
                  <span className="mt-0.5 text-base">{info.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400">{info.label}</p>
                    <p className="text-gray-800 font-medium">{info.val}</p>
                  </div>
                </div>
              ))}
              {user.profile?.bio && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">À propos</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{user.profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ── Modal édition du profil entreprise ─────────────────── */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Modifier le profil" size="lg">
        <form onSubmit={handleSubmit(onSubmitProfil)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Nom de l'entreprise</label>
              <input {...register("nom")} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Téléphone</label>
              <input {...register("telephone")} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Adresse</label>
              <input {...register("adresse")} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Site web</label>
              <input {...register("siteWeb")} placeholder="https://" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Taille de l'entreprise</label>
              <select {...register("nombreEmployes")} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1">
                <option value="">Sélectionner</option>
                <option value="1-5">1 à 5 employés</option>
                <option value="6-20">6 à 20 employés</option>
                <option value="21-100">21 à 100 employés</option>
                <option value="+100">Plus de 100 employés</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Secteur principal</label>
              <select {...register("secteur")} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1">
                <option value="">Choisir un secteur</option>
                {secteurs.map(s => <option key={s._id} value={s._id}>{s.nom}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Description / Bio</label>
            <textarea rows={4} {...register("bio")} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 resize-none" />
          </div>

          {/* Responsable */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Responsable de l'entreprise</p>
            <div className="grid grid-cols-3 gap-3">
              <input {...register("responsable.prenom")} placeholder="Prénom" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input {...register("responsable.nom")} placeholder="Nom" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input {...register("responsable.titre")} placeholder="Titre (ex: DG)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm text-gray-600">
              Annuler
            </button>
            <button type="submit" disabled={enregistrementEnCours} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {enregistrementEnCours ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
