import type { RealisationTypeForm } from "../../../../types/FormType";
import Avatar from "../../../design_system/avatar/Avatar";
import Spinner from "../../../design_system/spinner/Spinner";
import Contenair from "../../contenair/Contenair";
import { motion } from "framer-motion"
import PostImages from "../Post";


interface Props {
  realisations: RealisationTypeForm[];
  isLoading: boolean
}

const BASE_URL = import.meta.env.VITE_API_URL;


const RealisationCard = ({ isLoading, realisations }: Props) => {
  return (
    <div>
      <Contenair className="p-2 w-3/5 h-screen overflow-y-auto">

      
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
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 md:w-[48%]"
              >
                {/* Header avec avatar + nom */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <Avatar src={`${BASE_URL}${realisation?.realisateur?.photo}`} alt="Profile" size="very-small" />
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {realisation?.realisateur?.profile?.prenom}{" "}
                    {realisation?.realisateur?.profile?.nom}
                  </h3>
                </div>

                {/* Images */}
                <div className="w-full">
                  <PostImages images={realisation.images} />
                </div>

                {/* Description */}
                <div className="px-4 py-3">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {realisation.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-400">
                    Posté le {new Date().toLocaleDateString()}
                  </span>

                </div>
              </article>
            ))}

          </motion.div>
        )}
      </Contenair>
    </div>
  )
}

export default RealisationCard
