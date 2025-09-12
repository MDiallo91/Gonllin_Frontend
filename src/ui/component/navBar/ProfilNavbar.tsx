import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { RiMenuLine, RiCloseLine, RiNotification2Fill, RiMailUnreadLine } from "react-icons/ri"; // icônes hamburger & close
import Logo from "../../design_system/logo/Logo";
import Typography from "../../design_system/typography/typography";
import Contenair from "../contenair/Contenair";
import Button from "../../design_system/button/button";
import Avatar from "../../design_system/avatar/Avatar";
import uidContext from "../../../AppContext";

interface Props {}
const BASE_URL = import.meta.env.VITE_API_URL;
function ProfilNavbar
({}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const user=useContext(uidContext)

  return (
    <div className=" shadow ">
      <Contenair className="flex items-center  justify-between py-0.5 gap-7 lg:px-20">
        {/* Logo + titre */}
        <div className="flex items-center gap-2.5">
          <Logo size="small" />
          <div className="flex flex-col">
            <div className="text-gray font-extrabold text-[24px] ">
              Gonllain
            </div>

          </div>
        </div>
        <div className="md:hidden gap-7 flex items-center justify-between">
                <Button variant='icon' size='small' icon={{ icon: RiMailUnreadLine }} >accent</Button>
                <Button variant='icon'  size='small' icon={{ icon: RiNotification2Fill }} >accent</Button>
            </div>
        {/*Affichage Desktop */}
        <div className="hidden md:flex items-center gap-7 ">
          <Typography variant="body-sm">
  <nav className="flex items-center gap-7 md:gap-20">
    {[
      { label: "Projet", to: "/profil/projet" },
      { label: "Publication", to: "/profil/realisation" },
      { label: "Message", to: "/profil/message" },
      
    ].map((item) => (
      <NavLink
        key={item.label}
        to={item.to}
        className={({ isActive }) =>
          isActive
            ? "text-primary font-semibold transition-colors"
            : "text-gray-700 hover:text-primary font-semibold transition-colors"
        }
      >
        {item.label}
      </NavLink>
    ))}

    <div className="flex  gap-3 justify-around items-center">
      <Button
        variant="icon"
        size="small"
        icon={{ icon: RiMailUnreadLine }}
      >
        accent
      </Button>
      <Button
        variant="icon"
        size="small"
        icon={{ icon: RiNotification2Fill }}
      >
        accent
      </Button>
       <Avatar src={ `${BASE_URL}${user?.photo}`}  alt='avattar' size='very-small' />
    </div>
  </nav>
</Typography>


         
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <RiCloseLine size={28} /> : <RiMenuLine size={28} />}
        </button>
      </Contenair>

      {/* ProfilNavbar
       pour ecran mobile */}
      {isOpen && (
        <div className="md:hidden bg-secondary-100 border-secondary-200">
          <div className="flex flex-col items-start p-4 gap-4">
            <Link
              to="/profil/projet"
              className="hover:text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Projets
            </Link>
             <Link
              to="/profil/realisation"
              className="hover:text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Publication
            </Link>
            <Link
              to="/projet/message"
              className="hover:text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Message
            </Link>
           
            
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilNavbar
;
