import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  MdSearch, MdVerified, MdStar, MdPeople, MdFolder,
  MdHandshake, MdArrowForward, MdCheckCircle,
  MdPhone, MdEmail, MdWork,
} from "react-icons/md";

import { useAppConfig } from "../context/AppConfigContext";

const BASE_URL = import.meta.env.VITE_API_URL;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
  viewport: { once: true, amount: 0.2 },
});

const etapes = [
  { num: "01", titre: "Publiez votre projet",    desc: "Décrivez vos besoins en quelques clics : type de travaux, budget et délais. Visible par des professionnels qualifiés.", icon: MdFolder,    color: "bg-blue-50 text-blue-600" },
  { num: "02", titre: "Recevez des offres",       desc: "Des indépendants et entreprises consultent votre projet et vous envoient leurs propositions. Comparez profils, avis et tarifs.", icon: MdPeople,    color: "bg-indigo-50 text-indigo-600" },
  { num: "03", titre: "Choisissez et collaborez", desc: "Sélectionnez le professionnel qui correspond le mieux. Suivez l'avancement et finalisez en toute confiance.", icon: MdHandshake, color: "bg-emerald-50 text-emerald-600" },
];

const avantages = [
  "Professionnels vérifiés et notés",
  "Messagerie intégrée sécurisée",
  "Suivi de projet en temps réel",
  "Avis certifiés après prestation",
  "Zéro frais d'inscription",
  "Support client réactif",
];

function Home() {
  const config = useAppConfig();

  // ─── Données dynamiques depuis la DB ──────────────────────────
  const [secteurs, setSecteurs]         = useState<any[]>([]);
  const [stats, setStats]               = useState<any>(null);
  const [temoignages, setTemoignages]   = useState<any[]>([]);

  useEffect(() => {
    // Chargement parallèle des 3 sources
    Promise.all([
      axios.get(`${BASE_URL}/api/secteur/public`),
      axios.get(`${BASE_URL}/api/admin/stats/public`),
      axios.get(`${BASE_URL}/api/temoignage/public`),
    ]).then(([secRes, statRes, temRes]) => {
      setSecteurs(secRes.data   || []);
      setStats(statRes.data     || null);
      setTemoignages(temRes.data || []);
    }).catch(() => { /* silencieux — les sections s'affichent vides */ });
  }, []);

  // Construit les blocs stats depuis la DB, avec fallback "--"
  const statsBlocs = [
    { valeur: stats?.totalPros    ? `${stats.totalPros}+`    : "--", label: "Professionnels inscrits" },
    { valeur: stats?.totalMetiers ? `${stats.totalMetiers}+` : "--", label: "Métiers couverts" },
    { valeur: stats?.totalProjets ? `${stats.totalProjets}+` : "--", label: "Projets réalisés" },
    { valeur: stats?.noteMoyenne  ? `${stats.noteMoyenne}★`  : "--", label: "Note moyenne" },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-indigo-700 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
          <motion.div className="flex-1 text-center md:text-left" {...fadeUp()}>
            <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-wider">
              Plateforme freelance #1
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Trouvez le bon professionnel,<br />
              <span className="text-yellow-300">au bon moment</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0">
              {config.descriptionApp ||
                `${config.nomApp} connecte clients et artisans qualifiés pour tous vos projets.`}
            </p>

            <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto md:mx-0">
              <MdSearch className="text-gray-400 text-xl ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Ex : électricien, plombier, maçon..."
                className="flex-1 px-3 py-3 text-gray-700 text-sm focus:outline-none bg-transparent"
              />
              <Link to="/connexion/Clientregister">
                <button className="bg-primary text-white text-sm font-semibold px-5 py-3 hover:bg-indigo-700 transition whitespace-nowrap">
                  Chercher
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-4 mt-6 justify-center md:justify-start flex-wrap">
              {["Pros vérifiés", "Avis certifiés", "Gratuit"].map(b => (
                <span key={b} className="flex items-center gap-1 text-white/80 text-xs">
                  <MdCheckCircle className="text-yellow-300" /> {b}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stats depuis la DB */}
          <motion.div className="flex-1 grid grid-cols-2 gap-4 w-full max-w-sm" {...fadeUp(0.15)}>
            {statsBlocs.map(s => (
              <div key={s.label}
                className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center border border-white/20">
                <p className="text-3xl font-extrabold text-yellow-300">{s.valeur}</p>
                <p className="text-white/70 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          COMMENT ÇA MARCHE
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14" {...fadeUp()}>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Simple & rapide</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Comment ça marche</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm">En 3 étapes, trouvez le professionnel idéal pour votre projet.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {etapes.map((e, i) => {
              const Icon = e.icon;
              return (
                <motion.div key={e.num} {...fadeUp(i * 0.1)}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${e.color} flex items-center justify-center mb-5`}>
                    <Icon className="text-2xl" />
                  </div>
                  <span className="text-4xl font-black text-gray-100 select-none">{e.num}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 mb-3">{e.titre}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{e.desc}</p>
                </motion.div>
              );
            })}
          </div>
          <motion.div className="text-center mt-10" {...fadeUp(0.3)}>
            <Link to="/connexion/Clientregister">
              <button className="bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition inline-flex items-center gap-2">
                Publier un projet gratuitement <MdArrowForward />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          NOS MÉTIERS — depuis la DB (afficherAccueil: true)
      ════════════════════════════════════════════════════════════ */}
      {secteurs.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-14" {...fadeUp()}>
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Expertise</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Nos domaines d'activité</h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm">Des professionnels qualifiés dans tous les corps de métier.</p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {secteurs.map((s, i) => (
                <motion.div key={s._id} {...fadeUp(i * 0.05)}
                  className="flex flex-col items-center gap-3 group cursor-pointer">
                  {/* Image ou couleur */}
                  <div
                    className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm"
                    style={{ backgroundColor: s.couleur ? `${s.couleur}20` : "#e0e7ff" }}
                  >
                    {s.picture && s.picture !== "/upload/profil/random_user.png" ? (
                      <img
                        src={`${BASE_URL}${s.picture}`}
                        alt={s.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MdWork className="text-3xl" style={{ color: s.couleur || "#6366f1" }} />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 text-center">{s.nom}</p>
                  {s.description && (
                    <p className="text-xs text-gray-400 text-center line-clamp-2">{s.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          AVANTAGES
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-primary to-indigo-700 py-20 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <motion.div className="flex-1" {...fadeUp()}>
            <span className="text-yellow-300 text-sm font-semibold uppercase tracking-widest">Pourquoi nous choisir</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-6">La plateforme pensée pour vous</h2>
            <ul className="space-y-3">
              {avantages.map(a => (
                <li key={a} className="flex items-center gap-3 text-sm text-white/90">
                  <MdCheckCircle className="text-yellow-300 text-lg flex-shrink-0" /> {a}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div className="flex-1 grid grid-cols-2 gap-4" {...fadeUp(0.15)}>
            {[
              { icon: MdVerified,  titre: "Pros certifiés",   desc: "Chaque professionnel est vérifié avant publication." },
              { icon: MdStar,      titre: "Avis authentiques", desc: "Notation réelle après chaque prestation terminée." },
              { icon: MdHandshake, titre: "Mise en relation",  desc: "Directe, sans intermédiaire, sans frais cachés." },
              { icon: MdFolder,    titre: "Gestion de projet", desc: "Suivez chaque étape depuis votre tableau de bord." },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={c.titre} {...fadeUp(i * 0.08)}
                  className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5">
                  <Icon className="text-yellow-300 text-2xl mb-3" />
                  <p className="font-semibold text-sm mb-1">{c.titre}</p>
                  <p className="text-white/70 text-xs leading-relaxed">{c.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TÉMOIGNAGES — depuis la DB
      ════════════════════════════════════════════════════════════ */}
      {temoignages.length > 0 && (
        <section className="bg-gray-50 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-14" {...fadeUp()}>
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Ils nous font confiance</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Ce que disent nos utilisateurs</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {temoignages.slice(0, 6).map((t, i) => (
                <motion.div key={t._id} {...fadeUp(i * 0.1)}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <MdStar key={j} className={j < t.note ? "text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic flex-1">"{t.texte}"</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                    {t.photo ? (
                      <img
                        src={t.photo.startsWith("http") ? t.photo : `${BASE_URL}${t.photo}`}
                        alt={t.nom}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {t.nom?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">{t.nom}</p>
                      {t.role && <p className="text-gray-400 text-xs">{t.role}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          SECTION PROFESSIONNELS
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <motion.div className="flex-1 flex justify-center" {...fadeUp()}>
            <div className="w-72 h-72 rounded-3xl bg-gradient-to-br from-primary/10 to-indigo-100 flex items-center justify-center">
              <MdWork className="text-primary text-9xl opacity-30" />
            </div>
          </motion.div>
          <motion.div className="flex-1" {...fadeUp(0.15)}>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Pour les professionnels</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-4">
              Vous êtes un pro dans votre domaine ?
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Que vous soyez artisan, indépendant ou entreprise, {config.nomApp} vous met en
              relation directe avec des clients qui recherchent vos compétences.
            </p>
            <ul className="space-y-2 mb-8">
              {["Profil professionnel gratuit", "Accès aux projets de votre secteur", "Messagerie directe avec les clients"].map(a => (
                <li key={a} className="flex items-center gap-2 text-sm text-gray-700">
                  <MdCheckCircle className="text-primary flex-shrink-0" /> {a}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/connexion/register">
                <button className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition inline-flex items-center gap-2">
                  S'inscrire gratuitement <MdArrowForward />
                </button>
              </Link>
              <Link to="/connexion/login">
                <button className="border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition">
                  Se connecter
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA FINAL + CONTACT
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#111827] py-20 px-6 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-white/60 mb-8 text-sm">
              Rejoignez des milliers d'utilisateurs qui font confiance à {config.nomApp}.
            </p>
            <div className="flex justify-center gap-4 flex-wrap mb-12">
              <Link to="/connexion/Clientregister">
                <button className="bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-600 transition inline-flex items-center gap-2">
                  Publier un projet <MdArrowForward />
                </button>
              </Link>
              <Link to="/connexion/register">
                <button className="border border-white/20 text-white font-semibold px-8 py-3 rounded-xl hover:border-white/50 transition">
                  Rejoindre comme pro
                </button>
              </Link>
            </div>

            {(config.emailContact || config.telephone) && (
              <div className="border-t border-white/10 pt-8 flex flex-wrap justify-center gap-6 text-sm text-white/60">
                <span className="font-medium text-white/40">Service client :</span>
                {config.emailContact && (
                  <a href={`mailto:${config.emailContact}`} className="flex items-center gap-1.5 hover:text-white transition">
                    <MdEmail className="text-primary" /> {config.emailContact}
                  </a>
                )}
                {config.telephone && (
                  <a href={`tel:${config.telephone}`} className="flex items-center gap-1.5 hover:text-white transition">
                    <MdPhone className="text-primary" /> {config.telephone}
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
