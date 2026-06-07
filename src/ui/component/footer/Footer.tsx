import { RiFacebookFill, RiDiscordFill, RiTwitterFill, RiInstagramFill } from "react-icons/ri";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAppConfig } from "../../../context/AppConfigContext";

function Footer() {
  const annee  = new Date().getFullYear();
  const config = useAppConfig();

  return (
    <footer className="bg-[#111827] text-white px-6 md:px-20 pt-12 pb-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">

          {/* ── Identité ─────────────────────────────────────────── */}
          <div className="md:col-span-1">
            <p className="text-xl font-extrabold text-white mb-2">{config.nomApp}</p>
            {config.descriptionApp && (
              <p className="text-white/70 text-sm leading-relaxed mb-4">{config.descriptionApp}</p>
            )}
            <ul className="space-y-2 text-sm text-white/70">
              {config.emailContact && (
                <li className="flex items-center gap-2">
                  <MdEmail className="text-primary flex-shrink-0" />
                  <a href={`mailto:${config.emailContact}`} className="hover:text-white transition truncate">
                    {config.emailContact}
                  </a>
                </li>
              )}
              {config.telephone && (
                <li className="flex items-center gap-2">
                  <MdPhone className="text-primary flex-shrink-0" />
                  <a href={`tel:${config.telephone}`} className="hover:text-white transition">
                    {config.telephone}
                  </a>
                </li>
              )}
              {config.adresse && (
                <li className="flex items-start gap-2">
                  <MdLocationOn className="text-primary flex-shrink-0 mt-0.5" />
                  <span>{config.adresse}</span>
                </li>
              )}
            </ul>
          </div>

          {/* ── Nos métiers ─────────────────────────────────────── */}
          <div>
            <p className="uppercase text-xs font-semibold tracking-widest text-white mb-4">Nos métiers</p>
            <ul className="space-y-2 text-sm text-white/70">
              {["Plomberie", "Menuiserie", "Carrelage", "Mécanique", "Électricité"].map(m => (
                <li key={m} className="hover:text-white transition cursor-pointer">{m}</li>
              ))}
            </ul>
          </div>

          {/* ── Ressources ──────────────────────────────────────── */}
          <div>
            <p className="uppercase text-xs font-semibold tracking-widest text-white mb-4">Ressources</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/" className="hover:text-white transition">Accueil</Link></li>
              <li><Link to="/connexion/login" className="hover:text-white transition">Se connecter</Link></li>
              <li><Link to="/connexion/register" className="hover:text-white transition">S'inscrire</Link></li>
              <li><Link to="/cgu" className="hover:text-white transition">CGU</Link></li>
              <li><Link to="/mentions-legales" className="hover:text-white transition">Mentions légales</Link></li>
              <li><Link to="/confidentialite" className="hover:text-white transition">Confidentialité</Link></li>
            </ul>
          </div>

          {/* ── Réseaux sociaux ─────────────────────────────────── */}
          <div>
            <p className="uppercase text-xs font-semibold tracking-widest text-white mb-4">Suivez-nous</p>
            <ul className="space-y-3 text-sm text-white/70">
              {[
                { icon: RiFacebookFill,  label: "Facebook",  href: config.reseaux?.facebook  },
                { icon: RiDiscordFill,   label: "Discord",   href: config.reseaux?.discord   },
                { icon: RiTwitterFill,   label: "Twitter",   href: config.reseaux?.twitter   },
                { icon: RiInstagramFill, label: "Instagram", href: config.reseaux?.instagram },
              ]
                .filter(r => r.href) // masque les réseaux sans lien configuré
                .map(({ icon: Icon, label, href }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-white transition">
                      <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition">
                        <Icon />
                      </span>
                      {label}
                    </a>
                  </li>
                ))
              }
              {/* Message si aucun réseau configuré */}
              {!config.reseaux?.facebook && !config.reseaux?.discord &&
               !config.reseaux?.twitter  && !config.reseaux?.instagram && (
                <li className="text-white/40 text-xs italic">Aucun réseau configuré</li>
              )}
            </ul>
          </div>
        </div>

        {/* ── Copyright ───────────────────────────────────────────── */}
        <div className="pt-6 text-center text-xs text-white/70">
          &copy; {annee}{" "}
          <span className="text-white font-medium">{config.nomApp}</span>
          {" "}— Tous droits réservés
          {config.emailContact && (
            <> · <a href={`mailto:${config.emailContact}`} className="text-white/70 hover:text-white transition">{config.emailContact}</a></>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
