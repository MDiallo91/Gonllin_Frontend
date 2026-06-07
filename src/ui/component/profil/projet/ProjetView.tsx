import { motion } from "framer-motion";
import type { ProjetTypeForm, SecteurTypeForm } from "../../../../types/FormType";
import Avatar from "../../../design_system/avatar/Avatar";
import Spinner from "../../../design_system/spinner/Spinner";
import EmptyState from "../../../design_system/empty/EmptyState";
import Pagination from "../../../design_system/pagination/Pagination";
import StatusBadge from "../../../design_system/badge/StatusBadge";

const BASE_URL = import.meta.env.VITE_API_URL;

interface Props {
  projets: ProjetTypeForm[];
  secteurs: SecteurTypeForm[];
  filtres: { secteur: string; localite: string; dateDebut: string };
  onFiltreChange: (key: string, value: string) => void;
  page: number;
  pages: number;
  total: number;
  onPageChange: (p: number) => void;
  form: any;
}

// Étiquettes lisibles pour le délai
const labelDateDebut: Record<string, string> = {
  urgent: "🔴 Urgent",
  semaine: "🟠 Cette semaine",
  mois: "🟡 Ce mois",
  flexible: "🟢 Flexible",
};

const ProjetView = ({
  projets, secteurs, filtres, onFiltreChange,
  page, pages, total, onPageChange, form
}: Props) => {
  const { errors, register, handleSubmit, onSubmit, isLoading } = form;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* ── En-tête ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projets disponibles</h1>
          <p className="text-gray-500 text-sm mt-1">{total} projet{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* ── Barre de filtres ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col md:flex-row gap-3">

        {/* Filtre secteur */}
        <select
          value={filtres.secteur}
          onChange={e => onFiltreChange("secteur", e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les secteurs</option>
          {secteurs.map(s => (
            <option key={s._id} value={s._id}>{s.nom}</option>
          ))}
        </select>

        {/* Filtre localité */}
        <input
          type="text"
          placeholder="Localité (ex: Conakry)"
          value={filtres.localite}
          onChange={e => onFiltreChange("localite", e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {/* Filtre délai */}
        <select
          value={filtres.dateDebut}
          onChange={e => onFiltreChange("dateDebut", e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les délais</option>
          <option value="urgent">🔴 Urgent</option>
          <option value="semaine">🟠 Cette semaine</option>
          <option value="mois">🟡 Ce mois</option>
          <option value="flexible">🟢 Flexible</option>
        </select>
      </div>

      {/* ── Liste des projets ────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner variant="primary" size="large" />
        </div>
      ) : projets.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Aucun projet trouvé"
          description="Essayez de modifier vos filtres ou revenez plus tard."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {projets.map(projet => (
            <article
              key={projet._id}
              className="bg-white rounded-2xl shadow-sm border-l-4 border-primary p-5 space-y-4 hover:shadow-md transition"
            >
              {/* En-tête de la carte : avatar + auteur + badge délai */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={`${BASE_URL}${projet.user?.photo}`}
                    alt={projet.user?.profile?.prenom}
                    size="very-small"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {projet.user?.profile?.prenom} {projet.user?.profile?.nom}
                    </p>
                    <p className="text-xs text-gray-400">{projet.secteur?.nom}</p>
                  </div>
                </div>
                {/* Badge délai coloré */}
                <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {labelDateDebut[projet.dateDebut] ?? projet.dateDebut}
                </span>
              </div>

              {/* Titre + description */}
              <div>
                <h3 className="font-bold text-gray-900 text-base">{projet.titre || "Projet sans titre"}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-3">{projet.description}</p>
              </div>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>📍 {projet.localite}</span>
                {projet.budget?.max ? (
                  <span>💰 {projet.budget.min?.toLocaleString()} – {projet.budget.max?.toLocaleString()} GNF</span>
                ) : null}
                <span>🗂 {projet.secteur?.nom}</span>
                <StatusBadge status={projet.etat} />
              </div>

              {/* ── Formulaire de soumission d'offre ────────────── */}
              <form
                onSubmit={handleSubmit((data: any) => onSubmit(data, projet._id))}
                className="border-t border-gray-100 pt-4 space-y-3"
              >
                <p className="text-sm font-medium text-gray-700">Soumettre une offre</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Montant proposé */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Montant (GNF) *</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="ex: 500000"
                      {...register("montant", { required: "Le montant est requis" })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    {errors.montant && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.montant.message}</p>
                    )}
                  </div>

                  {/* Délai estimé */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Délai estimé (jours) *</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="ex: 7"
                      {...register("delaiEstime", { required: "Le délai est requis" })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    {errors.delaiEstime && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.delaiEstime.message}</p>
                    )}
                  </div>
                </div>

                {/* Message de motivation */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Lettre de motivation *</label>
                  <textarea
                    rows={3}
                    placeholder="Expliquez pourquoi vous êtes le meilleur candidat pour ce projet..."
                    {...register("description", {
                      required: "La description est requise",
                      minLength: { value: 50, message: "Minimum 50 caractères" }
                    })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.description.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {isLoading ? "Envoi en cours..." : "Postuler à ce projet"}
                </button>
              </form>
            </article>
          ))}
        </motion.div>
      )}

      {/* ── Pagination ───────────────────────────────────────────── */}
      <Pagination page={page} pages={pages} onPageChange={onPageChange} />
    </div>
  );
};

export default ProjetView;
