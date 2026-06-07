import { Link } from "react-router-dom";
import { MdArrowBack, MdBusiness, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { useAppConfig } from "../../context/AppConfigContext";

// Page Mentions Légales — contenu géré depuis l'admin (Paramètres > Config de l'app > Mentions légales)
export default function MentionsLegales() {
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
              <MdBusiness className="text-primary text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Mentions légales</h1>
          </div>
          <p className="text-gray-400 text-sm">{config.nomApp} — Informations légales obligatoires.</p>
        </div>
      </div>

      {/* Corps */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {config.mentionsLegales ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Contenu saisi dans l'admin, whitespace préservé */}
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {config.mentionsLegales}
            </div>
          </div>
        ) : (
          /* Contenu par défaut structuré */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

            <Section titre="Éditeur du site">
              <InfoLine icon={MdBusiness} label="Société">{config.nomApp}</InfoLine>
              {config.adresse && <InfoLine icon={MdLocationOn} label="Adresse">{config.adresse}</InfoLine>}
              {config.emailContact && (
                <InfoLine icon={MdEmail} label="Email">
                  <a href={`mailto:${config.emailContact}`} className="text-primary hover:underline">
                    {config.emailContact}
                  </a>
                </InfoLine>
              )}
              {config.telephone && (
                <InfoLine icon={MdPhone} label="Téléphone">
                  <a href={`tel:${config.telephone}`} className="text-primary hover:underline">
                    {config.telephone}
                  </a>
                </InfoLine>
              )}
            </Section>

            <div className="border-t border-gray-100" />

            <Section titre="Hébergement">
              <p className="text-gray-600 text-sm leading-relaxed">
                Le site {config.nomApp} est hébergé par un prestataire d'hébergement professionnel.
                Pour toute question relative à l'hébergement, veuillez nous contacter via
                {config.emailContact ? (
                  <> l'adresse <a href={`mailto:${config.emailContact}`} className="text-primary hover:underline"> {config.emailContact}</a>.</>
                ) : " notre service client."}
              </p>
            </Section>

            <div className="border-t border-gray-100" />

            <Section titre="Propriété intellectuelle">
              <p className="text-gray-600 text-sm leading-relaxed">
                L'ensemble du contenu de la plateforme {config.nomApp} — incluant textes, images,
                graphiques, logo, icônes et code source — est la propriété exclusive de {config.nomApp}
                et est protégé par les lois en vigueur sur la propriété intellectuelle.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-3">
                Toute reproduction, représentation, modification, publication ou adaptation de tout
                ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est
                interdite sans autorisation écrite préalable.
              </p>
            </Section>

            <div className="border-t border-gray-100" />

            <Section titre="Responsabilité">
              <p className="text-gray-600 text-sm leading-relaxed">
                {config.nomApp} s'efforce d'assurer l'exactitude et la mise à jour des informations
                diffusées sur ce site. Cependant, {config.nomApp} ne peut garantir l'exactitude,
                la complétude ou l'actualité de ces informations et décline toute responsabilité pour
                les dommages directs ou indirects pouvant résulter de l'accès au site.
              </p>
            </Section>

            <div className="border-t border-gray-100" />

            <Section titre="Données personnelles">
              <p className="text-gray-600 text-sm leading-relaxed">
                Conformément à la réglementation applicable en matière de protection des données
                personnelles, vous disposez de droits sur vos données. Pour en savoir plus, consultez
                notre{" "}
                <Link to="/confidentialite" className="text-primary hover:underline">
                  Politique de confidentialité
                </Link>.
              </p>
            </Section>

            <div className="border-t border-gray-100" />

            <Section titre="Contact">
              <p className="text-gray-600 text-sm leading-relaxed">
                Pour toute question relative aux présentes mentions légales :
              </p>
              <div className="mt-3 space-y-2">
                {config.emailContact && (
                  <a href={`mailto:${config.emailContact}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <MdEmail /> {config.emailContact}
                  </a>
                )}
                {config.telephone && (
                  <a href={`tel:${config.telephone}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <MdPhone /> {config.telephone}
                  </a>
                )}
              </div>
            </Section>
          </div>
        )}

        {/* Liens légaux */}
        <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-400 justify-center">
          <Link to="/cgu" className="hover:text-primary transition">CGU</Link>
          <span>·</span>
          <Link to="/confidentialite" className="hover:text-primary transition">Politique de confidentialité</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-4">{titre}</h2>
      <div>{children}</div>
    </div>
  );
}

function InfoLine({ icon: Icon, label, children }: {
  icon: React.ElementType; label: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 mb-2">
      <Icon className="text-primary flex-shrink-0 mt-0.5" />
      <span className="text-sm text-gray-600">
        <span className="font-medium text-gray-800">{label} : </span>
        {children}
      </span>
    </div>
  );
}
