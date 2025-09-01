import { useState } from "react";
import { Link } from "react-router-dom";
import { RiMenuLine, RiCloseLine } from "react-icons/ri"; // icônes hamburger & close
import Button from "../../design_system/button/button";
import Logo from "../../design_system/logo/Logo";
import Typography from "../../design_system/typography/typography";
import Contenair from "../contenair/Contenair";

interface Props {}

function Navigation({}: Props) {
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
            <Typography variant="body-sm" theme="primary" component="span" className="hidden md:block">
              Trouvez vos ouvriers
            </Typography>
          </div>
        </div>

        {/*Affichage Desktop */}
        <div className="hidden md:flex items-center gap-7">
          <Typography variant="body-base" className="flex items-center gap-7">
            <Link
              to="/projet"
              className="hover:text-primary transition-colors font-semibold"
            >
              Publier un projet
            </Link>
            <Link
              to="/"
              className="hover:text-primary transition-colors font-semibold"
            >
              Accueil
            </Link>
          </Typography>

          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button size="small">Se connecter</Button>
            </Link>
            <Link to="/inscription">
              <Button size="small" variant="secondary">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <RiCloseLine size={28} /> : <RiMenuLine size={28} />}
        </button>
      </Contenair>

      {/* Navigation pour ecran mobile */}
      {isOpen && (
        <div className="md:hidden bg-secondary-100 border-secondary-200">
          <div className="flex flex-col items-start p-4 gap-4">
            <Link
              to="/projet"
              className="hover:text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Publier un projet
            </Link>
            <Link
              to="/"
              className="hover:text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>

            <div className="flex flex-col gap-2 w-full">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button size="small">Se connecter</Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button size="small" variant="secondary">
                  S'inscrire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
