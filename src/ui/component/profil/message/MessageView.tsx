import type { EncherTypeForm, } from "../../../../types/FormType";
import Spinner from "../../../design_system/spinner/Spinner";
import Contenair from "../../contenair/Contenair";

import { motion } from "framer-motion";
import Avatar from "../../../design_system/avatar/Avatar";

interface Props {
  form: any;
  enchere: EncherTypeForm[];
}

const BASE_URL = import.meta.env.VITE_API_URL;

const MessageView = ({ form, enchere }: Props) => {
  const {isLoading } = form;
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
                

                {/* Contenu enchere */}
                <div>

                  <p className="text-gray-700 text-sm mt-1 line-clamp-4">
                     Bonjour, Monsieur <span className="font-medium text-black"> {enchere?.projet?.user?.profile?.prenom} {enchere?.projet?.user?.profile?.nom} </span>vous a engagé suite a votre interet pour son projet <br />
                    Vous veuillez lui joindre via ces coodonnees suivantes.
                  </p>
                </div>

                {/* Infos bas de carte */}
                <div className="mt-2 border-t pt-2 text-sm text-gray-500 ">
                  <p className="text-gray">
                    Telephone :
                    <span className="font-medium ml-1 "> {enchere?.projet?.user?.profile?.telephone}</span>
                  </p>
                  <p className="mt-1 text-gray">
                    Email
                    <span className="font-medium ml-1"> {enchere?.projet?.user?.email}  </span>
                  </p>
                   <p className="mt-1 text-gray">
                    Addresse
                    <span className="font-medium ml-1"> {enchere?.projet?.user?.profile?.adresse}  </span>
                  </p>
                  
                </div>

                

              </article>
            ))}
          </motion.div>
        )}
      </Contenair>
    </Contenair>
  );
};

export default MessageView;
