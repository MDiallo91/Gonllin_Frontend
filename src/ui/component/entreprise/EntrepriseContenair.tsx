import { useContext, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type {  EntrepriseFormType, SecteurFormType } from "../../../types/FormType";
import TravailleurView from "./EntrepriseView";
import uidContext from "../../../AppContext";
import SecteurService from "../../../service/SecteurService";
import EntrepriseService from "../../../service/EntrepriseService";


function EntrepriseContenair() {

  //logique du formulaire
  const [isLoading,setIsLoading]=useState(false)
  //progressBAr
  const [etap, setEtap] = useState(1);
  const totalEtaps = 3
  const progress = (etap / totalEtaps) * 100;
  //Recuperation des secteur pour afficher dans le formulaire
  const [secteur,setSecteur]=useState<SecteurFormType[]>([])

  const {
    handleSubmit,
    control,
    register,
    formState:{errors},
    setError,
    reset,
  }=useForm<EntrepriseFormType>();

  
  useEffect(() => {
  SecteurService.get().then(setSecteur);
}, []);


  const navigate =useNavigate()
  const travailleur = useContext(uidContext);
  const id=travailleur?.profile._id;


  const onSubmit: SubmitHandler<EntrepriseFormType> = async (formData:EntrepriseFormType) => {
    console.log("formData avant", formData)
    setIsLoading(true)
    
    await EntrepriseService.update(id,formData)
      .then(async({  status }) => {

        if(etap<totalEtaps){
          setEtap((prev) => prev + 1)
        }else if(status===200){
          navigate('/profil'); // redirection après succès
        }

      })
      .catch(err => {
        console.error("Erreur de connexion:", err);
         toast.error("Une erreur est survenue, veuillez réesayer")
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

export default EntrepriseContenair
