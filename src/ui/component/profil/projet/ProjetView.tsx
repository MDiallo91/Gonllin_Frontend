import type { ProjetTypeForm } from "../../../../types/FormType";
import Spinner from "../../../design_system/spinner/Spinner";
import Typography from "../../../design_system/typography/typography";
import Contenair from "../../contenair/Contenair";
import Textarea from "../../../design_system/form/Textarea";

import { motion } from "framer-motion";
import Avatar from "../../../design_system/avatar/Avatar";
import Button from "../../../design_system/button/button";

interface Props {
  form: any;
  projet: ProjetTypeForm[];
}


const ProjetView = ({ form, projet }: Props) => {
  const { errors, register, handleSubmit, onSubmit, isLoading } = form;
    const BASE_URL = import.meta.env.VITE_API_URL;

    return (
    <Contenair className="flex w-full h-screen gap-4 md:px-60 py-4 bg-secondary-50 relative overflow-hidden">
      {/* Colonne centrale */}
      <Contenair className="p-2 w-3/5 h-screen bg-white py-20 overflow-y-auto">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Spinner variant="primary" size="large" />
          </div>
        ) : projet?.length === 0 ? (
          <p className="text-center w-full text-gray-500">
            Aucun projet trouvé.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4 flex flex-col mb-4"
          >
            {projet?.map((projet, key) => (
              <article
                key={key}
                className="w-full rounded border-t-5 border-primary shadow-md p-4 flex bg-gray-50 flex-col gap-3"
              >
                {/* Header : Avatar + Nom */}
                <div className="flex items-center gap-3">
                  <Avatar   src={`${BASE_URL}${projet.user?.photo}`} alt={projet?.user?.profile?.prenom} size="very-small" />
                  <h3 className="font-semibold text-lg">
                    {projet.user?.profile?.nom}
                  </h3>
                </div>

                {/* Contenu projet */}
                <div>
                  <h4 className="font-bold text-gray-800">
                    Description du projet
                  </h4>
                  <p className="text-gray-700 text-sm mt-1 line-clamp-3">
                    {projet.description}
                  </p>
                </div>

                {/* Infos bas de carte */}
                <div className="mt-2 border-t pt-2 text-sm text-gray-500">
                  <p>
                    Ville d’exécution :
                    <span className="font-medium ml-1"> {projet.localite} </span>
                  </p>
                  <p className="mt-1">
                    Compétence nécessaire :
                    <span className="font-medium ml-1"> {projet.secteur.nom}  </span>
                  </p>
                  <p className="mt-1 pt-3">

                    <span className="font-medium ml-1 py-2 px-4 rounded text-white bg-primary"> {projet.dateDebut || "Date"}  </span>
                  </p>
                </div>

                {/* Formulaire commentaire */}
                <form onSubmit={handleSubmit((data: any) => onSubmit(data, projet._id))} className="mt-3">
                  <Typography
                    variant="body-sm"
                    component="h5"
                    weight="medium"
                    className="text-left"
                  >
                    Ajouter un texte pour convaintre le client de vous choisir
                  </Typography>
                  <div className="space-y-4 pt-3 pb-3 mt-1">
                    <Textarea
                      isLoading={isLoading}
                      register={register}
                      errors={errors}
                      id="description"
                      required={true}
                      placeholder="Exemple : Bonjour, je suis le canditat ideale pour votre projet"
                      errorMsg="Ce champ est obligatoire"
                    />
                  </div>
                  <Button isLoading={isLoading} variant="outline" type="submit" >Postuler</Button>
                </form>
              </article>
            ))}
          </motion.div>
        )}
      </Contenair>
    </Contenair>
  );
};

export default ProjetView;
