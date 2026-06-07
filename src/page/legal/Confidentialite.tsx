import { Link } from "react-router-dom";
import { MdArrowBack, MdPrivacyTip, MdEmail, MdLock, MdPerson,
         MdDelete, MdStorage, MdShare } from "react-icons/md";
import { useAppConfig } from "../../context/AppConfigContext";

// Page Politique de confidentialité — contenu géré depuis l'admin (Paramètres > Config > Politique)
export default function Confidentialite() {
  const config = useAppConfig();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition mb-6">
            <MdArrowBack /> Retour à l'accueil
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <MdPrivacyTip className="text-primary text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Politique de confidentialité</h1>
          </div>
          <p className="text-gray-400 text-sm">
            {config.nomApp} — Comment nous collectons et protégeons vos données.
          </p>
        </div>
      </div>

      {/* Corps */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {config.politique ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Contenu saisi dans l'admin, whitespace préservé */}
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {config.politique}
            </div>
          </div>
        ) : (
          /* Contenu par défaut avec icônes */
          <div className="space-y-6">

            {/* Résumé visuel */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: MdLock,    titre: "Données sécurisées",    desc: "Chiffrement SSL sur toutes les communications" },
                { icon: MdPerson,  titre: "Vos droits respectés",  desc: "Accès, rectification et suppression sur demande" },
                { icon: MdStorage, titre: "Stockage limité",        desc: "Conservation uniquement le temps nécessaire" },
                { icon: MdShare,   titre: "Pas de revente",         desc: "Vos données ne sont jamais vendues à des tiers" },
                { icon: MdDelete,  titre: "Droit à l'oubli",        desc: "Supprimez votre compte et vos données à tout moment" },
                { icon: MdEmail,   titre: "Transparence",           desc: "Contactez-nous pour toute question sur vos données" },
              ].map(c => {
                const Icon = c.icon;
                return (
                  <div key={c.titre}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-2">
                    <Icon className="text-primary text-2xl" />
                    <p className="text-sm font-semibold text-gray-800">{c.titre}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Contenu détaillé */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

              <Section titre="1. Qui sommes-nous ?">
                <p>
                  {config.nomApp} est responsable du traitement de vos données personnelles dans
                  le cadre de l'utilisation de notre plateforme de mise en relation entre clients et
                  professionnels.
                  {config.emailContact && (
                    <> Contact DPO : <a href={`mailto:${config.emailContact}`}
                      className="text-primary hover:underline">{config.emailContact}</a>.</>
                  )}
                </p>
              </Section>

              <div className="border-t border-gray-100" />

              <Section titre="2. Données collectées">
                <p className="mb-3">Nous collectons les données suivantes :</p>
                <ul className="space-y-2">
                  {[
                    "Informations d'identité : nom, prénom, adresse email, numéro de téléphone",
                    "Informations de profil : photo, compétences, expériences, réalisations",
                    "Données de navigation : adresse IP, type de navigateur, pages visitées",
                    "Données de transaction : offres soumises, projets publiés, messages échangés",
                    "Données de notation : avis laissés et reçus après prestations",
                  ].map(d => (
                    <li key={d} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </Section>

              <div className="border-t border-gray-100" />

              <Section titre="3. Finalités du traitement">
                <p className="mb-3">Vos données sont utilisées pour :</p>
                <ul className="space-y-2">
                  {[
                    "Créer et gérer votre compte utilisateur",
                    "Faciliter la mise en relation entre clients et professionnels",
                    "Envoyer des notifications liées à votre activité sur la plateforme",
                    "Améliorer nos services grâce à des analyses statistiques anonymisées",
                    "Assurer la sécurité et prévenir les fraudes",
                    "Respecter nos obligations légales",
                  ].map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Section>

              <div className="border-t border-gray-100" />

              <Section titre="4. Base légale">
                <p>
                  Le traitement de vos données repose sur : l'exécution du contrat (fourniture du
                  service), votre consentement (communications marketing), nos obligations légales,
                  et nos intérêts légitimes (sécurité, amélioration du service).
                </p>
              </Section>

              <div className="border-t border-gray-100" />

              <Section titre="5. Conservation des données">
                <p>
                  Vos données sont conservées pendant la durée d'existence de votre compte et
                  supprimées dans un délai de 30 jours suivant la fermeture de celui-ci, sauf
                  obligation légale de conservation plus longue.
                </p>
              </Section>

              <div className="border-t border-gray-100" />

              <Section titre="6. Vos droits">
                <p className="mb-3">Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { droit: "Accès", desc: "Obtenir une copie de vos données" },
                    { droit: "Rectification", desc: "Corriger des données inexactes" },
                    { droit: "Suppression", desc: "Demander l'effacement de vos données" },
                    { droit: "Portabilité", desc: "Récupérer vos données dans un format lisible" },
                    { droit: "Opposition", desc: "Vous opposer à certains traitements" },
                    { droit: "Limitation", desc: "Limiter le traitement de vos données" },
                  ].map(d => (
                    <div key={d.droit} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-sm font-semibold text-gray-800">{d.droit}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{d.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Pour exercer vos droits, contactez-nous :{" "}
                  {config.emailContact ? (
                    <a href={`mailto:${config.emailContact}`} className="text-primary hover:underline">
                      {config.emailContact}
                    </a>
                  ) : "notre service client"}. Nous répondrons dans un délai de 30 jours.
                </p>
              </Section>

              <div className="border-t border-gray-100" />

              <Section titre="7. Cookies">
                <p>
                  Notre plateforme utilise des cookies essentiels au fonctionnement du service
                  (authentification, préférences). Aucun cookie publicitaire tiers n'est utilisé
                  sans votre consentement explicite.
                </p>
              </Section>

              <div className="border-t border-gray-100" />

              <Section titre="8. Sécurité">
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
                  protéger vos données contre tout accès non autorisé, altération, divulgation ou
                  destruction : chiffrement HTTPS, authentification par tokens sécurisés httpOnly,
                  accès restreint aux données sensibles.
                </p>
              </Section>

              <div className="border-t border-gray-100" />

              <Section titre="9. Contact">
                <p>
                  Pour toute question relative à cette politique ou à vos données personnelles :
                </p>
                <div className="mt-3 space-y-2">
                  {config.emailContact && (
                    <a href={`mailto:${config.emailContact}`}
                      className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <MdEmail /> {config.emailContact}
                    </a>
                  )}
                </div>
              </Section>
            </div>
          </div>
        )}

        {/* Liens légaux */}
        <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-400 justify-center">
          <Link to="/cgu" className="hover:text-primary transition">CGU</Link>
          <span>·</span>
          <Link to="/mentions-legales" className="hover:text-primary transition">Mentions légales</Link>
          {config.emailContact && (
            <>
              <span>·</span>
              <a href={`mailto:${config.emailContact}`} className="flex items-center gap-1 hover:text-primary transition">
                <MdEmail /> {config.emailContact}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-3">{titre}</h2>
      <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
