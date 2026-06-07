import { Link } from "react-router-dom";
import { MdArrowBack, MdGavel, MdEmail } from "react-icons/md";
import { useAppConfig } from "../../context/AppConfigContext";

// Page CGU — contenu entièrement géré depuis l'admin (Paramètres > Config de l'app > CGU)
export default function CGU() {
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
              <MdGavel className="text-primary text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Conditions Générales d'Utilisation
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            {config.nomApp} — Dernière mise à jour disponible dans l'administration.
          </p>
        </div>
      </div>

      {/* Corps */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {config.cgu ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Le contenu est affiché en préservant les retours à la ligne saisis dans l'admin */}
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {config.cgu}
            </div>
          </div>
        ) : (
          /* Contenu par défaut si l'admin n'a pas encore rempli le champ */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
            <Section titre="1. Objet">
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la
              plateforme {config.nomApp}, accessible via notre site web et nos applications mobiles.
              En accédant à la plateforme, vous acceptez sans réserve les présentes conditions.
            </Section>

            <Section titre="2. Inscription et compte utilisateur">
              L'accès à la plupart des fonctionnalités de {config.nomApp} nécessite la création d'un
              compte. Vous vous engagez à fournir des informations exactes, complètes et à jour lors
              de votre inscription. Vous êtes seul responsable de la confidentialité de votre mot de
              passe et de toutes les activités survenant sous votre compte.
            </Section>

            <Section titre="3. Description du service">
              {config.nomApp} est une marketplace mettant en relation des clients (particuliers ou
              entreprises) avec des professionnels indépendants ou des sociétés prestataires de
              services. La plateforme facilite la mise en relation mais n'est pas partie aux contrats
              conclus entre les utilisateurs.
            </Section>

            <Section titre="4. Obligations des utilisateurs">
              Tout utilisateur s'engage à :{"\n\n"}
              • Utiliser la plateforme conformément aux lois en vigueur{"\n"}
              • Ne pas publier de contenu illicite, trompeur ou offensant{"\n"}
              • Respecter les droits de propriété intellectuelle{"\n"}
              • Ne pas tenter de contourner les mécanismes de sécurité{"\n"}
              • Signaler tout contenu ou comportement inapproprié
            </Section>

            <Section titre="5. Responsabilités">
              {config.nomApp} met tout en œuvre pour assurer la disponibilité et la sécurité de la
              plateforme. Cependant, elle ne peut être tenue responsable des dommages résultant de
              l'utilisation de la plateforme ou de l'inexécution des contrats conclus entre
              utilisateurs.
            </Section>

            <Section titre="6. Propriété intellectuelle">
              L'ensemble des éléments de la plateforme (logo, design, textes, images, code source)
              est protégé par les droits de propriété intellectuelle de {config.nomApp}. Toute
              reproduction non autorisée est interdite.
            </Section>

            <Section titre="7. Données personnelles">
              Le traitement de vos données personnelles est régi par notre{" "}
              <Link to="/confidentialite" className="text-primary hover:underline">
                Politique de confidentialité
              </Link>
              , consultable à tout moment sur la plateforme.
            </Section>

            <Section titre="8. Modification des CGU">
              {config.nomApp} se réserve le droit de modifier les présentes CGU à tout moment.
              Les utilisateurs seront informés de toute modification significative. La poursuite
              de l'utilisation de la plateforme après modification vaut acceptation des nouvelles CGU.
            </Section>

            <Section titre="9. Résiliation">
              Tout utilisateur peut résilier son compte à tout moment depuis les paramètres de son
              profil. {config.nomApp} se réserve le droit de suspendre ou supprimer tout compte en
              cas de violation des présentes CGU.
            </Section>

            <Section titre="10. Contact">
              Pour toute question relative aux présentes CGU, contactez-nous :{" "}
              {config.emailContact && (
                <a href={`mailto:${config.emailContact}`} className="text-primary hover:underline">
                  {config.emailContact}
                </a>
              )}
            </Section>
          </div>
        )}

        {/* Pied de page légal */}
        <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-400 justify-center">
          <Link to="/mentions-legales" className="hover:text-primary transition">Mentions légales</Link>
          <span>·</span>
          <Link to="/confidentialite" className="hover:text-primary transition">Politique de confidentialité</Link>
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

// Bloc de section avec titre
function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-3">{titre}</h2>
      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{children}</p>
    </div>
  );
}
