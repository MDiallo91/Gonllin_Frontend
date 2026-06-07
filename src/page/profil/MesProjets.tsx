import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import uidContext from "../../AppContext";
import ProjetService from "../../service/ProjetService";
import EncherService from "../../service/EncherService";
import AvisService from "../../service/AvisService";
import SecteurService from "../../service/SecteurService";
import type { EncherTypeForm, ProjetTypeForm, SecteurTypeForm } from "../../types/FormType";
import StatusBadge from "../../ui/design_system/badge/StatusBadge";
import EmptyState from "../../ui/design_system/empty/EmptyState";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import Pagination from "../../ui/design_system/pagination/Pagination";
import Modal from "../../ui/design_system/modal/Modal";
import StarRating from "../../ui/design_system/rating/StarRating";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function MesProjets() {
  const user = useContext(uidContext);
  const navigate = useNavigate();

  // ─── État des projets ─────────────────────────────────────────
  const [projets, setProjets] = useState<ProjetTypeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filtreEtat, setFiltreEtat] = useState("");

  // ─── État des offres (pour le projet sélectionné) ─────────────
  const [projetSelectionne, setProjetSelectionne] = useState<ProjetTypeForm | null>(null);
  const [offresProjet, setOffresProjet] = useState<EncherTypeForm[]>([]);
  const [chargementOffres, setChargementOffres] = useState(false);

  // ─── État wizard de publication de projet ─────────────────────
  const [showWizard, setShowWizard] = useState(false);
  const [etape, setEtape] = useState(1);
  const [projetForm, setProjetForm] = useState<any>({ titre: "", description: "", localite: "", dateDebut: "flexible", budgetMin: 0, budgetMax: 0, secteur: "" });
  const [publiEnCours, setPubliEnCours] = useState(false);
  const [secteurs, setSecteurs] = useState<SecteurTypeForm[]>([]);

  // ─── État notation après clôture ──────────────────────────────
  const [modalAvis, setModalAvis] = useState<{ enchereId: string; destinataire: string; projetId: string } | null>(null);
  const [noteGlobale, setNoteGlobale] = useState(0);
  const [commentaireAvis, setCommentaireAvis] = useState("");

  // ─── Chargement initial : projets + secteurs ──────────────────
  useEffect(() => {
    SecteurService.get().then(setSecteurs).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    chargerProjets();
  }, [user, page, filtreEtat]);

  const chargerProjets = async () => {
    setLoading(true);
    try {
      const res = await ProjetService.getProjetsByUser(user!._id, { etat: filtreEtat || undefined, page });
      setProjets(res.projets || []);
      setPages(res.pages || 1);
    } catch {
      toast.error("Impossible de charger vos projets");
    } finally {
      setLoading(false);
    }
  };

  // ─── Ouverture d'un projet → charge ses offres ────────────────
  const ouvrirDetailProjet = async (projet: ProjetTypeForm) => {
    setProjetSelectionne(projet);
    setChargementOffres(true);
    try {
      const res = await EncherService.getEncheresParProjet(projet._id);
      setOffresProjet(res.data || []);
    } catch {
      toast.error("Impossible de charger les offres");
    } finally {
      setChargementOffres(false);
    }
  };

  // ─── Accepter une offre et notifier le travailleur ────────────
  const accepterOffre = async (enchereId: string, projetId: string) => {
    try {
      await EncherService.accepter(enchereId, projetId);
      // Mettre à jour l'état du projet vers "en cours"
      await ProjetService.update(projetId, { etat: "anCours", userChoisi: offresProjet.find(o => o._id === enchereId)?.user._id });
      toast.success("Offre acceptée ! Le professionnel a été notifié.");
      // Rafraîchir les offres et projets
      ouvrirDetailProjet(projetSelectionne!);
      chargerProjets();
    } catch {
      toast.error("Erreur lors de l'acceptation");
    }
  };

  // ─── Clôturer un projet terminé ───────────────────────────────
  const cloturerProjet = async (projetId: string) => {
    try {
      await ProjetService.cloturer(projetId);
      toast.success("Projet clôturé !");
      chargerProjets();
      setProjetSelectionne(null);
    } catch {
      toast.error("Erreur lors de la clôture");
    }
  };

  // ─── Publier un avis sur le travailleur ───────────────────────
  const soumettreAvis = async () => {
    if (!modalAvis || noteGlobale === 0) {
      toast.warning("Veuillez attribuer au moins 1 étoile");
      return;
    }
    try {
      await AvisService.create({
        auteur: user!._id,
        destinataire: modalAvis.destinataire,
        projet: modalAvis.projetId,
        noteGlobale,
        commentaire: commentaireAvis,
      });
      toast.success("Avis publié, merci !");
      setModalAvis(null);
      setNoteGlobale(0);
      setCommentaireAvis("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erreur lors de la publication");
    }
  };

  // ─── Publication d'un nouveau projet (wizard 3 étapes) ────────
  const publierProjet = async () => {
    setPubliEnCours(true);
    try {
      await ProjetService.register({
        ...projetForm,
        user: user!._id,
        budget: { min: Number(projetForm.budgetMin), max: Number(projetForm.budgetMax) },
      });
      toast.success("Projet publié avec succès !");
      setShowWizard(false);
      setEtape(1);
      setProjetForm({ titre: "", description: "", localite: "", dateDebut: "flexible", budgetMin: 0, budgetMax: 0, secteur: "" });

      chargerProjets();
    } catch {
      toast.error("Erreur lors de la publication");
    } finally {
      setPubliEnCours(false);
    }
  };

  const etats = ["attente", "anCours", "termine", "annule"] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* ── En-tête avec bouton de publication ─────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes projets</h1>
          <p className="text-gray-500 text-sm mt-1">{projets.length} projet{projets.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-sm"
        >
          + Publier un projet
        </button>
      </div>

      {/* ── Filtres par état ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setFiltreEtat(""); setPage(1); }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${filtreEtat === "" ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          Tous
        </button>
        {etats.map(e => (
          <button
            key={e}
            onClick={() => { setFiltreEtat(e); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${filtreEtat === e ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            <StatusBadge status={e} />
          </button>
        ))}
      </div>

      {/* ── Liste des projets ────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={3} />)}
        </div>
      ) : projets.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Aucun projet"
          description="Publiez votre premier projet pour recevoir des offres de professionnels."
          action={{ label: "Publier un projet", onClick: () => setShowWizard(true) }}
        />
      ) : (
        <div className="space-y-4">
          {projets.map(projet => (
            <motion.article
              key={projet._id}
              layout
              className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition cursor-pointer"
              onClick={() => ouvrirDetailProjet(projet)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{projet.titre || "Projet sans titre"}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{projet.description}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                    <span>📍 {projet.localite}</span>
                    <span>🗂 {projet.secteur?.nom}</span>
                    {projet.budget?.max ? <span>💰 jusqu'à {projet.budget.max.toLocaleString()} GNF</span> : null}
                    <span>📅 {new Date(projet.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={projet.etat} />
                  {/* Bouton clôture si en cours */}
                  {projet.etat === "anCours" && (
                    <button
                      onClick={e => { e.stopPropagation(); cloturerProjet(projet._id); }}
                      className="text-xs text-green-600 border border-green-300 px-3 py-1 rounded-lg hover:bg-green-50"
                    >
                      Clôturer
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {/* ── Modal : Détail projet + offres reçues ──────────────── */}
      <Modal
        isOpen={!!projetSelectionne}
        onClose={() => setProjetSelectionne(null)}
        title={projetSelectionne?.titre || "Offres reçues"}
        size="lg"
      >
        {chargementOffres ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => <SkeletonCard key={i} lines={3} />)}
          </div>
        ) : offresProjet.length === 0 ? (
          <EmptyState icon="📬" title="Aucune offre reçue" description="Votre projet n'a pas encore reçu d'offres." />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{offresProjet.length} offre{offresProjet.length > 1 ? "s" : ""} reçue{offresProjet.length > 1 ? "s" : ""}</p>
            {offresProjet.map(offre => (
              <div key={offre._id} className="border border-gray-100 rounded-xl p-4 space-y-3 hover:border-primary/30 transition">

                {/* Profil du candidat */}
                <div className="flex items-center gap-3">
                  <img
                    src={`${BASE_URL}${offre.user?.photo}`}
                    alt={offre.user?.profile?.prenom}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">
                      {offre.user?.profile?.prenom} {offre.user?.profile?.nom}
                    </p>
                    <p className="text-xs text-gray-400">{offre.user?.profile?.secteur?.nom}</p>
                  </div>
                  <StatusBadge status={offre.statut} />
                </div>

                {/* Montant + délai */}
                <div className="flex gap-4 text-sm">
                  <span className="font-bold text-primary">💰 {offre.montant?.toLocaleString()} GNF</span>
                  <span className="text-gray-500">⏱ {offre.delaiEstime} jour{offre.delaiEstime > 1 ? "s" : ""}</span>
                </div>

                {/* Motivation */}
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{offre.description}</p>

                {/* Actions : accepter ou contacter */}
                {offre.statut === "en_attente" && projetSelectionne?.etat === "attente" && (
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => accepterOffre(offre._id, projetSelectionne!._id)}
                      className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90"
                    >
                      Accepter cette offre
                    </button>
                    <button
                      onClick={() => navigate("/profil/message")}
                      className="border border-gray-200 px-4 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Contacter
                    </button>
                  </div>
                )}

                {/* Bouton notation si projet terminé */}
                {offre.statut === "accepte" && projetSelectionne?.etat === "termine" && (
                  <button
                    onClick={() => setModalAvis({ enchereId: offre._id, destinataire: offre.user._id, projetId: projetSelectionne._id })}
                    className="text-sm text-yellow-600 font-medium border border-yellow-300 px-4 py-1.5 rounded-lg hover:bg-yellow-50"
                  >
                    ⭐ Laisser un avis
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* ── Wizard publication de projet ────────────────────────── */}
      <Modal isOpen={showWizard} onClose={() => { setShowWizard(false); setEtape(1); }} title="Publier un projet" size="md">
        {/* Barre de progression */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Étape {etape} sur 3</span>
            <span>{Math.round((etape / 3) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(etape / 3) * 100}%` }} />
          </div>
        </div>

        {/* Étape 1 : Titre, description et secteur */}
        {etape === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Décrivez votre projet</h3>
            <input
              placeholder="Titre du projet (ex: Rénovation salle de bain)"
              value={projetForm.titre}
              onChange={e => setProjetForm((f: any) => ({ ...f, titre: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <textarea
              rows={4}
              placeholder="Décrivez précisément ce que vous attendez..."
              value={projetForm.description}
              onChange={e => setProjetForm((f: any) => ({ ...f, description: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <select
              value={projetForm.secteur}
              onChange={e => setProjetForm((f: any) => ({ ...f, secteur: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">-- Sélectionnez un secteur --</option>
              {secteurs.map(s => (
                <option key={s._id} value={s._id}>{s.nom}</option>
              ))}
            </select>
            <button
              onClick={() => {
                if (!projetForm.titre || !projetForm.description) return toast.warning("Remplissez le titre et la description");
                if (!projetForm.secteur) return toast.warning("Sélectionnez un secteur");
                setEtape(2);
              }}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90"
            >
              Suivant →
            </button>
          </div>
        )}

        {/* Étape 2 : Localité, délai et budget */}
        {etape === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Paramètres du projet</h3>
            <input
              placeholder="Localité (ex: Conakry, Ratoma)"
              value={projetForm.localite}
              onChange={e => setProjetForm((f: any) => ({ ...f, localite: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <select
              value={projetForm.dateDebut}
              onChange={e => setProjetForm((f: any) => ({ ...f, dateDebut: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="urgent">🔴 Urgent — dès que possible</option>
              <option value="semaine">🟠 Cette semaine</option>
              <option value="mois">🟡 Ce mois</option>
              <option value="flexible">🟢 Flexible</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number" min={0}
                placeholder="Budget min (GNF)"
                value={projetForm.budgetMin}
                onChange={e => setProjetForm((f: any) => ({ ...f, budgetMin: e.target.value }))}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="number" min={0}
                placeholder="Budget max (GNF)"
                value={projetForm.budgetMax}
                onChange={e => setProjetForm((f: any) => ({ ...f, budgetMax: e.target.value }))}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEtape(1)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                ← Retour
              </button>
              <button
                onClick={() => projetForm.localite ? setEtape(3) : toast.warning("Renseignez la localité")}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90"
              >
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* Étape 3 : Confirmation et publication */}
        {etape === 3 && (
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-800">Confirmation</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <p><span className="text-gray-400">Titre :</span> <strong>{projetForm.titre}</strong></p>
              <p><span className="text-gray-400">Secteur :</span> <strong>{secteurs.find(s => s._id === projetForm.secteur)?.nom || "—"}</strong></p>
              <p><span className="text-gray-400">Localité :</span> <strong>{projetForm.localite}</strong></p>
              <p><span className="text-gray-400">Délai :</span> <strong>{projetForm.dateDebut}</strong></p>
              {Number(projetForm.budgetMax) > 0 && (
                <p><span className="text-gray-400">Budget :</span> <strong>{Number(projetForm.budgetMin).toLocaleString()} – {Number(projetForm.budgetMax).toLocaleString()} GNF</strong></p>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEtape(2)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                ← Retour
              </button>
              <button
                onClick={publierProjet}
                disabled={publiEnCours}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {publiEnCours ? "Publication..." : "Publier le projet"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Modal notation du travailleur ─────────────────────── */}
      <Modal isOpen={!!modalAvis} onClose={() => setModalAvis(null)} title="Laisser un avis" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Comment évaluez-vous ce professionnel ?</p>
          <div className="flex flex-col items-center gap-2">
            <StarRating value={noteGlobale} onChange={setNoteGlobale} size="lg" />
            <p className="text-xs text-gray-400">
              {noteGlobale === 0 ? "Sélectionnez une note" : `${noteGlobale} étoile${noteGlobale > 1 ? "s" : ""}`}
            </p>
          </div>
          <textarea
            rows={4}
            placeholder="Votre commentaire (optionnel)..."
            value={commentaireAvis}
            onChange={e => setCommentaireAvis(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={soumettreAvis}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90"
          >
            Publier l'avis
          </button>
        </div>
      </Modal>
    </div>
  );
}
