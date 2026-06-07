import { useContext, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { SecteurFormType, TravailleurFormType } from "../../../types/FormType";
import TravailleurView from "./ClientView";
import uidContext from "../../../AppContext";
import SecteurService from "../../../service/SecteurService";
import ClientService from "../../../service/ClientService";
import ProjetService from "../../../service/ProjetService";


function ClientContenair() {

  //logique du formulaire
  const [isLoading, setIsLoading] = useState(false)
  //progressBAr
  const [etap, setEtap] = useState(1);
  const totalEtaps = 3
  const progress = (etap / totalEtaps) * 100;
  //Recuperation des secteur pour afficher dans le formulaire
  const [secteur, setSecteur] = useState<SecteurFormType[]>([])

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<TravailleurFormType>();


  useEffect(() => {
    SecteurService.get().then(setSecteur);
  }, []);


  const navigate = useNavigate()
  const travailleur = useContext(uidContext);
  const id = travailleur?.profile?._id;


  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    // Étapes 1 et 2 : avancer sans appel API
    if (etap < totalEtaps) {
      setEtap(prev => prev + 1);
      return;
    }

    // Étape 3 (dernière) : mettre à jour le profil client puis créer le projet
    setIsLoading(true);
    try {
      formData.user = id;
      await ClientService.update(id, {
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone,
      });
      await ProjetService.register(formData);
      toast.success("Votre profil et votre projet ont été enregistrés !");
      navigate("/profil");
    } catch {
      toast.error("Une erreur est survenue, veuillez réessayer");
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <div className="relative space-y-2">
      <div className=" mx-auto p-3 bg-white sticky  w-full  top-0 ">
        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-1 my-2 ">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-center">{etap}/{totalEtaps}  </div>
      </div>


      <TravailleurView
        etap={etap}
        setEtap={setEtap}
        totalEtaps={totalEtaps}
        secteur={secteur}
        form={{
          errors,
          control,
          register,
          handleSubmit,
          onSubmit,
          isLoading,
        }}
      />
    </div>
  )
}

export default ClientContenair
