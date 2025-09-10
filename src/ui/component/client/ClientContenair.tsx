import { useContext, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { ClientFormType, SecteurFormType, TravailleurFormType } from "../../../types/FormType";
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
    setError,
    reset,
  } = useForm<TravailleurFormType>();


  useEffect(() => {
    SecteurService.get().then(setSecteur);
  }, []);


  const navigate = useNavigate()
  const travailleur = useContext(uidContext);
  const id = travailleur?.profile._id;


  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    setIsLoading(true)
    if(formData){
      formData.user=id
    }
     console.log("formData avant", formData)

    await ClientService.update(id, formData)
      .then(async ({ status }) => {
        if (etap < totalEtaps) {
          setEtap((prev) => prev + 1)
          return
        } else if (status === 200) {
           toast.success("Votre projet a été publier avec succes")
          navigate('/'); // redirection après succès
        }
        
      })

      //enregistrement du projet
      await ProjetService.register(formData)
      .then(async ({ status }) => {
         if (status === 200) {
         
          navigate('/'); // redirection après succès
        }

      })
      .catch(err => {
        console.error("Erreur de connexion:", err);
        toast.error("Une erreur est survenue, veuillez reesayer")
      })
      .finally(() => {
        setIsLoading(false);
      });

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
