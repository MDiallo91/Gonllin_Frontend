import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";

// Layouts
import MainLayout from "../../../layout/MainLayout";
import AdminLayout from "../../../layout/AdminLayout";
import ProfilLayout from "../../../layout/ProfilLayout";
import AdminDashboardLayout from "../../../layout/AdminDashboardLayout";

// Pages publiques
import Home from "../../../page/Home";
import Login from "../../../page/connexion/Login";
import Register from "../../../page/connexion/Register";
import ClientRegister from "../../../page/connexion/ClientRegister";
import ForgetPassword from "../../../page/connexion/ForgetPassword";
import Confirm from "../../../page/connexion/ConfirmCode";

// Pages légales
import CGU from "../../../page/legal/CGU";
import MentionsLegales from "../../../page/legal/MentionsLegales";
import Confidentialite from "../../../page/legal/Confidentialite";

// Pages d'onboarding (complétion profil)
import TravailleurInfo from "../../../page/travailleurInfo/TravailleurInfo";
import ClientInfo from "../../../page/client/Client";
import EntrepriseInfo from "../../../page/entreprise/entreprise";

// Pages profil (espace connecté)
import HomeProfil from "../../../page/profil/HomeProfil";
import RealisationProfil from "../../../page/profil/RealisationProfil";
import MessageProfil from "../../../page/profil/MessageProfil";
import ProjetProfil from "../../../page/profil/ProjetProfil";
import OffresProfil from "../../../page/profil/OffresProfil";
import MesProjets from "../../../page/profil/MesProjets";
import NotificationsProfil from "../../../page/profil/NotificationsProfil";

// Pages entreprise
import EntrepriseProfil from "../../../page/entreprise/EntrepriseProfil";

// Pages admin
import AdminDashboard from "../../../page/admin/AdminDashboard";
import AdminUsers from "../../../page/admin/AdminUsers";
import AdminProjets from "../../../page/admin/AdminProjets";
import AdminSecteurs from "../../../page/admin/AdminSecteurs";
import AdminAvis from "../../../page/admin/AdminAvis";
import AdminSignalements from "../../../page/admin/AdminSignalements";
import AdminTemoignages from "../../../page/admin/AdminTemoignages";
import AdminParametres from "../../../page/admin/AdminParametres";

// Contexte utilisateur pour la protection des routes
import uidContext from "../../../AppContext";

// Composant de protection de route par rôle
function ProtectedRoute({ roles, children }: { roles: string[]; children: JSX.Element }) {
  const user = useContext(uidContext);
  if (!user) return <Navigate to="/connexion/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/profil" replace />;
  return children;
}

function index() {
  return (
    <BrowserRouter>
      {/* Conteneur de notifications toast global */}
      <ToastContainer position="top-center" transition={Flip} autoClose={4000} />

      <Routes>
        {/* ── Routes publiques ──────────────────────────────────── */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/connexion/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/connexion/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/connexion/Clientregister" element={<MainLayout><ClientRegister /></MainLayout>} />
        <Route path="/connexion/forgetPassword" element={<MainLayout><ForgetPassword /></MainLayout>} />
        <Route path="/connexion/confirmation" element={<MainLayout><Confirm /></MainLayout>} />

        {/* ── Pages légales ────────────────────────────────────── */}
        <Route path="/cgu"              element={<MainLayout><CGU /></MainLayout>} />
        <Route path="/mentions-legales" element={<MainLayout><MentionsLegales /></MainLayout>} />
        <Route path="/confidentialite"  element={<MainLayout><Confidentialite /></MainLayout>} />

        {/* ── Onboarding : complétion du profil après inscription ── */}
        <Route path="/travailleurInfo" element={<AdminLayout><TravailleurInfo /></AdminLayout>} />
        <Route path="/clientInfo" element={<AdminLayout><ClientInfo /></AdminLayout>} />
        <Route path="/entrepriseInfo" element={<AdminLayout><EntrepriseInfo /></AdminLayout>} />

        {/* ── Espace profil (tous les rôles connectés) ─────────── */}
        <Route path="/profil" element={<ProfilLayout><HomeProfil /></ProfilLayout>} />
        <Route path="/profil/realisation" element={<ProfilLayout><RealisationProfil /></ProfilLayout>} />
        <Route path="/profil/message" element={<ProfilLayout><MessageProfil /></ProfilLayout>} />
        <Route path="/profil/notifications" element={<ProfilLayout><NotificationsProfil /></ProfilLayout>} />

        {/* Routes spécifiques au travailleur indépendant */}
        <Route
          path="/profil/projet"
          element={
            <ProtectedRoute roles={["independant"]}>
              <ProfilLayout><ProjetProfil /></ProfilLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profil/offres"
          element={
            <ProtectedRoute roles={["independant"]}>
              <ProfilLayout><OffresProfil /></ProfilLayout>
            </ProtectedRoute>
          }
        />

        {/* Routes spécifiques au client et à l'entreprise */}
        <Route
          path="/profil/mes-projets"
          element={
            <ProtectedRoute roles={["client", "entreprise"]}>
              <ProfilLayout><MesProjets /></ProfilLayout>
            </ProtectedRoute>
          }
        />

        {/* Route spécifique à l'entreprise : profil enrichi */}
        <Route
          path="/profil/entreprise"
          element={
            <ProtectedRoute roles={["entreprise"]}>
              <ProfilLayout><EntrepriseProfil /></ProfilLayout>
            </ProtectedRoute>
          }
        />

        {/* ── Espace admin (layout dédié avec sidebar) ─────────── */}
        <Route
          path="/admin"
          element={
              <AdminDashboardLayout />
          }
        >
          {/* Page par défaut de l'admin : dashboard */}
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="projets" element={<AdminProjets />} />
          <Route path="secteurs" element={<AdminSecteurs />} />
          <Route path="avis" element={<AdminAvis />} />
          <Route path="temoignages"  element={<AdminTemoignages />} />
          <Route path="signalements" element={<AdminSignalements />} />
          <Route path="parametres"   element={<AdminParametres />} />
        </Route>

        {/* Redirection pour toute route inconnue */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default index;
