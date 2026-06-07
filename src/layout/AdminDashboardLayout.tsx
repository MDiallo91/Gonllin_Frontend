import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";

// ─── Icônes react-icons ────────────────────────────────────────────────────────
import { MdDashboard, MdPeople, MdFolder, MdCategory, MdStar,
         MdFlag, MdSettings, MdLogout, MdAdminPanelSettings, MdFormatQuote } from "react-icons/md";

import uidContext from "../AppContext";
import NotificationBell from "../ui/component/notification/NotificationBell";
import { useAppConfig } from "../context/AppConfigContext";

const BASE_URL = import.meta.env.VITE_API_URL;

// Entrées de la navigation latérale avec icônes react-icons
const navItems = [
  { label: "Dashboard",    to: "/admin",              icon: MdDashboard,          exact: true },
  { label: "Utilisateurs", to: "/admin/users",        icon: MdPeople },
  { label: "Projets",      to: "/admin/projets",      icon: MdFolder },
  { label: "Secteurs",     to: "/admin/secteurs",     icon: MdCategory },
  { label: "Avis",          to: "/admin/avis",          icon: MdStar },
  { label: "Témoignages",  to: "/admin/temoignages",  icon: MdFormatQuote },
  { label: "Signalements", to: "/admin/signalements",  icon: MdFlag },
  { label: "Paramètres",   to: "/admin/parametres",   icon: MdSettings },
];

export default function AdminDashboardLayout() {
  const user     = useContext(uidContext);
  const navigate = useNavigate();
  const config   = useAppConfig(); // nom de l'app, email, téléphone depuis la DB

  const handleLogout = async () => {
    await axios.post(`${BASE_URL}/api/user/logout`, {}, { withCredentials: true });
    navigate("/connexion/login");
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Barre latérale ─────────────────────────────────────── */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shadow-sm">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MdAdminPanelSettings className="text-primary text-2xl" />
            <div>
              <p className="text-lg font-extrabold text-primary leading-none">{config.nomApp}</p>
              <p className="text-xs text-gray-400">Administration</p>
            </div>
          </div>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`text-lg flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Profil admin en bas */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={`${BASE_URL}${user?.photo}`}
              className="w-9 h-9 rounded-full object-cover border border-gray-100"
              alt="avatar admin"
              onError={e => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=A&background=6366f1&color=fff"; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
              <p className="text-xs text-gray-400">Administrateur</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-red-500 hover:text-red-700 font-medium transition"
          >
            <MdLogout className="text-base" /> Se déconnecter
          </button>
        </div>
      </aside>

      {/* ── Contenu principal ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barre supérieure */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Bienvenue, <strong className="text-gray-700">{user?.email}</strong>
          </p>
          <NotificationBell />
        </header>

        {/* Zone de contenu scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
