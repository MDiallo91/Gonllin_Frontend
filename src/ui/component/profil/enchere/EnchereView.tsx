import type { EncherTypeForm, } from "../../../../types/FormType";
import Spinner from "../../../design_system/spinner/Spinner";
import Contenair from "../../contenair/Contenair";

import { motion } from "framer-motion";
import Avatar from "../../../design_system/avatar/Avatar";
import Button from "../../../design_system/button/button";

interface Props {
  form: any;
  enchere: EncherTypeForm[];
}

const BASE_URL = import.meta.env.VITE_API_URL;

const enchereView = ({ form, enchere }: Props) => {
  const { errors, register, handleSubmit, onSubmit, isLoading } = form;
  console.log("dataForm", enchere)
  return (
    <Contenair className="flex w-full h-screen gap-4 md:px-60 py-4 bg-secondary-50 relative overflow-hidden">
      {/* Colonne centrale */}
      <Contenair className="p-2 w-3/5 h-screen bg-white pb-20 overflow-y-auto">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Spinner variant="primary" size="large" />
          </div>
        ) : enchere?.length === 0 ? (
          <p className="text-center w-full text-gray-500">
            Aucun enchere trouvé.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4 flex flex-col mb-4"
          >
            {enchere?.map((enchere, key) => (
              <article
                key={key}
                className="w-full rounded shadow-md p-4 flex bg-gray-50 flex-col gap-3"
              >
                {/* Header : Avatar + Nom */}
                <div className="flex items-center  gap-3 bg-primary-600 p-3 text-white rounded-t">
                  <Avatar src={`${BASE_URL}${enchere?.user?.photo}`} alt="Profile" size="very-small" />
                  <h3 className="font-semibold text-lg">
                    {enchere?.user?.profile?.prenom} {enchere?.user?.profile?.nom}
                  </h3>
                </div>

                {/* Contenu enchere */}
                <div>
                  <h4 className="font-medium text-gray-800">
                    Message
                  </h4>
                  <p className="text-gray-700 text-sm mt-1 line-clamp-3">
                    {enchere?.description}
                  </p>
                </div>

                {/* Infos bas de carte */}
                <div className="mt-2 border-t pt-2 text-sm text-gray-500 ">
                  <p className="text-gray">
                    Adresse :
                    <span className="font-medium ml-1 "> {enchere?.user?.profile?.adresse} </span>
                  </p>
                  <p className="mt-1 text-gray">
                    Type de professionnel:
                    <span className="font-medium ml-1"> {enchere?.user?.role}  </span>
                  </p>

                </div>

                {/* Formulaire commentaire */}

                <form
                  onSubmit={handleSubmit(() =>
                    onSubmit(
                      enchere._id, 
                      {
                        userChoisi: enchere?.user?._id, 
                      }
                      
                    )
                  )}
                  className="mt-3"
                >
                  <Button isLoading={isLoading} variant="secondary" type="submit">
                    Engager
                  </Button>
                </form>

              </article>
            ))}
          </motion.div>
        )}
      </Contenair>
    </Contenair>
  );
};

export default enchereView;
