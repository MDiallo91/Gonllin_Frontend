import { useState } from "react";
import { Link } from "react-router-dom";
import { RiMenuLine, RiCloseLine } from "react-icons/ri"; // icônes hamburger & close
import Button from "../../design_system/button/button";
import Logo from "../../design_system/logo/Logo";
import Typography from "../../design_system/typography/typography";
import Contenair from "../contenair/Contenair";

interface Props {}

function ProfilNavbar
({}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-2 border-secondary-200">
      <Contenair className="flex items-center  justify-between py-0.5 gap-7 lg:px-20">
        {/* Logo + titre */}
        <div className="flex items-center gap-2.5">
          <Logo size="small" />
          <div className="flex flex-col">
            <div className="text-gray font-extrabold text-[24px] ">
              Gollain
            </div>

          </div>
        </div>

        {/*Affichage Desktop */}
        <div className="hidden md:flex items-center gap-7 ">
          <Typography variant="body-base" className="flex items-center gap-7 md:gap-20">
            <Link
              to="/projet"
              className="hover:text-primary transition-colors font-semibold"
            >
              Message
            </Link>
            <Link
              to="/"
              className="hover:text-primary transition-colors font-semibold"
            >
              Mes Publication
            </Link>
             <Link
              to="/"
              className="hover:text-primary transition-colors font-semibold"
            >
              Projets
            </Link>
             <Link
              to="/"
              className="hover:text-primary transition-colors font-semibold"
            >
              Mes realison
            </Link>
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
              to="/projet"
              className="hover:text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Message
            </Link>
            <Link
              to="/"
              className="hover:text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Pub
            </Link>
            <Link
              to="/"
              className="hover:text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Projet
            </Link>

            <Link
              to="/"
              className="hover:text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Mes réalisation
            </Link>

          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilNavbar
;
