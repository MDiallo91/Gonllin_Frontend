import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MdPeople, MdVerified, MdWorkspacePremium, MdBlock, MdDeleteForever,
         MdSearch, MdWarning, MdCheckCircle, MdCancel } from "react-icons/md";
import AdminService from "../../service/AdminService";
import type { UserTypeForm } from "../../types/FormType";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import EmptyState from "../../ui/design_system/empty/EmptyState";
import Pagination from "../../ui/design_system/pagination/Pagination";
import Modal from "../../ui/design_system/modal/Modal";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminUsers() {
  // ─── État ──────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserTypeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filtres de recherche
  const [filtreRole, setFiltreRole] = useState("");
  const [recherche, setRecherche] = useState("");

  // Modal de confirmation d'action
  const [actionModal, setActionModal] = useState<{
    userId: string;
    type: "activer" | "verifier" | "premium" | "suspendre" | "supprimer";
    actif: boolean;
    label: string;
  } | null>(null);
  const [actionEnCours, setActionEnCours] = useState(false);

  // ─── Chargement des utilisateurs ───────────────────────────────
  useEffect(() => {
    chargerUsers();
  }, [page, filtreRole]);

  const chargerUsers = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getUsers({ role: filtreRole || undefined, search: recherche || undefined, page });
      setUsers(res.users || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch {
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  // Recherche déclenchée sur Entrée
  const handleRecherche = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { setPage(1); chargerUsers(); }
  };

  // ─── Exécution de l'action admin confirmée ─────────────────────
  const executerAction = async () => {
    if (!actionModal) return;
    setActionEnCours(true);
    try {
      const { userId, type, actif } = actionModal;
      if (type === "activer")   await AdminService.toggleActiverUser(userId);
      else if (type === "verifier")  await AdminService.verifierUser(userId);
      else if (type === "premium")   await AdminService.activerPremium(userId, actif);
      else if (type === "suspendre") await AdminService.suspendreUser(userId, actif);
      else if (type === "supprimer") await AdminService.deleteUser(userId);

      toast.success(`Action effectuée : ${actionModal.label}`);
      setActionModal(null);
      chargerUsers(); // Rafraîchit la liste
    } catch {
      toast.error("Erreur lors de l'action");
    } finally {
      setActionEnCours(false);
    }
  };

  // Couleurs des badges de rôle
  const roleColor: Record<string, string> = {
    independant: "bg-green-100 text-green-700",
    client: "bg-blue-100 text-blue-700",
    entreprise: "bg-purple-100 text-purple-700",
    admin: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MdPeople className="text-primary text-3xl" /> Gestion des utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-1">{total} utilisateur{total > 1 ? "s" : ""} au total</p>
        </div>
      </div>

      {/* ── Filtres ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col md:flex-row gap-3">
        {/* Recherche par email */}
        <input
          type="text"
          placeholder="Rechercher par email..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          onKeyDown={handleRecherche}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {/* Filtre par rôle */}
        <select
          value={filtreRole}
          onChange={e => { setFiltreRole(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les rôles</option>
          <option value="independant">Indépendants</option>
          <option value="client">Clients</option>
          <option value="entreprise">Entreprises</option>
          <option value="admin">Admins</option>
        </select>
        <button onClick={() => { setPage(1); chargerUsers(); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
          <MdSearch /> Rechercher
        </button>
      </div>

      {/* ── Table des utilisateurs ──────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <SkeletonCard key={i} lines={2} />)}</div>
      ) : users.length === 0 ? (
        <EmptyState icon="🔍" title="Aucun utilisateur trouvé" description="Modifiez vos critères de recherche." />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Utilisateur</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Rôle</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Statut</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Inscrit le</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition">
                    {/* Avatar + email */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`${BASE_URL}${u.photo}`}
                          className="w-8 h-8 rounded-full object-cover border border-gray-100"
                          alt=""
                          onError={e => { (e.target as HTMLImageElement).src = "/default-avatar.png"; }}
                        />
                        <div>
                          <p className="font-medium text-gray-900 text-xs">
                            {u.profile?.prenom} {u.profile?.nom || "—"}
                          </p>
                          <p className="text-gray-400 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Badge rôle */}
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleColor[u.role] || "bg-gray-100 text-gray-600"}`}>
                        {u.role}
                      </span>
                    </td>

                    {/* Badges statut : actif / vérifié / premium / suspendu */}
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {/* Badge activation compte */}
                        <span className={`flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                          {u.isActive ? <><MdCheckCircle className="text-sm" /> Actif</> : <><MdCancel className="text-sm" /> Inactif</>}
                        </span>
                        {u.profile?.isVerified && <span className="flex items-center gap-0.5 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"><MdVerified className="text-sm" /> Vérifié</span>}
                        {u.profile?.statut === "premium" && <span className="flex items-center gap-0.5 text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full"><MdWorkspacePremium className="text-sm" /> Premium</span>}
                        {u.profile?.isSuspended && <span className="flex items-center gap-0.5 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full"><MdBlock className="text-sm" /> Suspendu</span>}
                      </div>
                    </td>

                    {/* Date d'inscription */}
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("fr-FR") : "—"}
                    </td>

                    {/* Actions admin */}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Activer / Désactiver le compte */}
                        <button
                          onClick={() => setActionModal({
                            userId: u._id, type: "activer", actif: !u.isActive,
                            label: u.isActive ? "Désactiver le compte" : "Activer le compte"
                          })}
                          className={`flex items-center gap-1 text-xs border px-2 py-1 rounded-lg transition ${u.isActive ? "text-orange-600 border-orange-200 hover:bg-orange-50" : "text-green-600 border-green-200 hover:bg-green-50"}`}
                        >
                          {u.isActive ? <><MdCancel className="text-sm" /> Désactiver</> : <><MdCheckCircle className="text-sm" /> Activer</>}
                        </button>

                        {/* Vérifier le compte */}
                        {!u.profile?.isVerified && (
                          <button
                            onClick={() => setActionModal({ userId: u._id, type: "verifier", actif: true, label: "Vérifier le compte" })}
                            className="flex items-center gap-1 text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-50"
                          >
                            <MdVerified /> Vérifier
                          </button>
                        )}
                        {/* Activer / désactiver le premium */}
                        <button
                          onClick={() => setActionModal({
                            userId: u._id, type: "premium",
                            actif: u.profile?.statut !== "premium",
                            label: u.profile?.statut === "premium" ? "Retirer le premium" : "Activer le premium"
                          })}
                          className="text-xs text-purple-600 border border-purple-200 px-2 py-1 rounded-lg hover:bg-purple-50"
                        >
                          {u.profile?.statut === "premium" ? "−Premium" : "+Premium"}
                        </button>
                        {/* Suspendre / Réactiver */}
                        <button
                          onClick={() => setActionModal({
                            userId: u._id, type: "suspendre",
                            actif: !u.profile?.isSuspended,
                            label: u.profile?.isSuspended ? "Réactiver le compte" : "Suspendre le compte"
                          })}
                          className={`text-xs border px-2 py-1 rounded-lg ${u.profile?.isSuspended ? "text-green-600 border-green-200 hover:bg-green-50" : "text-orange-600 border-orange-200 hover:bg-orange-50"}`}
                        >
                          {u.profile?.isSuspended ? "Réactiver" : "Suspendre"}
                        </button>
                        {/* Supprimer */}
                        <button
                          onClick={() => setActionModal({ userId: u._id, type: "supprimer", actif: true, label: "Supprimer définitivement" })}
                          className="text-xs text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50"
                        >
                          Supprimer
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

      {/* ── Modal de confirmation d'action ─────────────────────── */}
      <Modal isOpen={!!actionModal} onClose={() => setActionModal(null)} title="Confirmer l'action" size="sm">
        <p className="text-sm text-gray-600 mb-6">
          Voulez-vous vraiment <strong>{actionModal?.label}</strong> pour cet utilisateur ?
          {actionModal?.type === "supprimer" && (
            <span className="flex items-center gap-1 mt-2 text-red-500 font-medium text-xs"><MdWarning className="text-base" /> Cette action est irréversible.</span>
          )}
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setActionModal(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Annuler
          </button>
          <button
            onClick={executerAction}
            disabled={actionEnCours}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 ${actionModal?.type === "supprimer" ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:opacity-90"}`}
          >
            {actionEnCours ? "En cours..." : "Confirmer"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
