import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import Logo from "../../design_system/logo/Logo";
import Contenair from "../contenair/Contenair";
import Avatar from "../../design_system/avatar/Avatar";
import uidContext from "../../../AppContext";
import NotificationBell from "../notification/NotificationBell";
import axios from "axios";
import { useAppConfig } from "../../../context/AppConfigContext";

const BASE_URL = import.meta.env.VITE_API_URL;

function ProfilNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const user   = useContext(uidContext);
    const navigate = useNavigate();
    const config = useAppConfig();

    const navLinks = () => {
        if (user?.role === "independant") return [
            { label: "Mon profil", to: "/profil" },
            { label: "Projets", to: "/profil/projet" },
            { label: "Mes offres", to: "/profil/offres" },
            { label: "Réalisations", to: "/profil/realisation" },
            { label: "Messages", to: "/profil/message" },
        ];
        if (user?.role === "client") return [
            { label: "Mon profil", to: "/profil" },
            { label: "Mes projets", to: "/profil/mes-projets" },
            { label: "Messages", to: "/profil/message" },
        ];
        if (user?.role === "entreprise") return [
            { label: "Mon profil", to: "/profil" },
            { label: "Projets", to: "/profil/mes-projets" },
            { label: "Réalisations", to: "/profil/realisation" },
            { label: "Messages", to: "/profil/message" },
        ];
        if (user?.role === "admin") return [
            { label: "Dashboard", to: "/admin" },
            { label: "Utilisateurs", to: "/admin/users" },
            { label: "Projets", to: "/admin/projets" },
            { label: "Secteurs", to: "/admin/secteurs" },
            { label: "Avis", to: "/admin/avis" },
        ];
        return [];
    };

    const handleLogout = async () => {
        await axios.post(`${BASE_URL}/api/user/logout`, {}, { withCredentials: true });
        navigate("/connexion/login");
        window.location.reload();
    };

    return (
        <div className="shadow sticky top-0 bg-white z-40">
            <Contenair className="flex items-center justify-between py-2 gap-7 lg:px-20">
                <Link to="/" className="flex items-center gap-2.5">
                    <Logo size="small" />
                    <span className="text-gray-800 font-extrabold text-xl">{config.nomApp}</span>
                </Link>

                {/* Desktop */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks().map(item => (
                        <NavLink key={item.label} to={item.to}
                            className={({ isActive }) => isActive
                                ? "text-primary font-semibold text-sm transition-colors"
                                : "text-gray-600 hover:text-primary font-medium text-sm transition-colors"}>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    <NotificationBell />
                    <div className="relative group">
                        <Avatar src={`${BASE_URL}${user?.photo}`} alt="avatar" size="very-small" />
                        <div className="absolute right-0 top-10 hidden group-hover:block bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-36 z-50">
                            <Link to="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Mon profil</Link>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50">Déconnexion</button>
                        </div>
                    </div>
                </div>

                <button className="md:hidden text-primary" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <RiCloseLine size={28} /> : <RiMenuLine size={28} />}
                </button>
            </Contenair>

            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="flex flex-col p-4 gap-3">
                        {navLinks().map(item => (
                            <Link key={item.label} to={item.to} className="text-gray-700 font-medium py-1" onClick={() => setIsOpen(false)}>
                                {item.label}
                            </Link>
                        ))}
                        <button onClick={handleLogout} className="text-left text-red-500 font-medium py-1">Déconnexion</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilNavbar;
