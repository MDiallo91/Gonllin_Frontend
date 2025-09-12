import type { RealisationTypeForm } from "../../../../types/FormType";
import Spinner from "../../../design_system/spinner/Spinner";
import Contenair from "../../contenair/Contenair";
import PostImages from "../Post";
import RealisationForm from "./RealisationForm";
import image1 from "/images/profil1.png";
import { motion } from "framer-motion"


interface Props {
  realisations: RealisationTypeForm[];
  userId: string,
  isLoading:boolean
}

const RealisationView = ({isLoading, realisations, userId }: Props) => {
  return (
    <Contenair className="flex w-full h-screen gap-4 md:px-6 py-4 bg-secondary-50 relative overflow-hidden">
      {/* Colonne gauche */}
      <div className="hidden md:block w-1/5 bg-white rounded shadow-sm p-2 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3 text-center border-b border-b-primary">Menu</h2>
        <ul className="space-y-2">
          <li className="hover:text-primary text-center cursor-pointer p-3 border border-gray-300 bg-primary-400 hover:bg-primary-600 hover:text-white rounded ">
            Profil
          </li>
          <li className="hover:text-primary text-center cursor-pointer p-3 border border-gray-300 bg-primary-400 hover:bg-primary-600 hover:text-white rounded ">
            Premium
          </li>
          <li className="hover:text-primary text-center cursor-pointer p-3 border border-gray-300 bg-primary-400 hover:bg-primary-600 hover:text-white rounded ">
            Groupes
          </li>
          <li className="hover:text-primary text-center cursor-pointer p-3 border border-gray-300 bg-primary-400 hover:bg-primary-600 hover:text-white rounded ">
            Paramètres
          </li>
        </ul>
      </div>

      {/* Colonne centrale */}

      
      {/* Colonne centrale */}
      <Contenair className="p-2 w-3/5 h-screen overflow-y-auto">
        <div className="bg-white rounded shadow-sm p-4 mb-4">
          <RealisationForm realisateurId={userId} />
        </div>

        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Spinner variant="primary" size="large" />
          </div>
        ) : realisations.length === 0 ? (
          <p className="text-center w-full text-gray-500">Aucune réalisation trouvée.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-3 flex flex-col mb-4 md:flex-row md:flex-wrap gap-3"
          >
            {realisations.map((realisation) => (
              <article
                key={realisation._id}
                className="bg-white rounded shadow-sm p-4 md:w-[48%]"
              >
                <h3 className="font-semibold">{realisation.realisateur}</h3>
                <PostImages images={realisation.images} />
                <p className="text-gray-700 mt-2 line-clamp-3">
                  {realisation.description}
                </p>
              </article>
            ))}
          </motion.div>
        )}
      </Contenair>

      {/* Colonne droite */}
      <div className="hidden md:block w-1/5 bg-white rounded shadow-sm p-2 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3 text-center  border-b border-b-primary">Sponsorisé</h2>
        <ul className="space-y-2">
          <li className="hover:text-primary cursor-pointer">
            <img src={image1} alt="img" />
          </li>

        </ul>
      </div>
    </Contenair>
  );
};

export default RealisationView;
