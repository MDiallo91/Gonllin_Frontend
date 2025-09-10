import { useContext, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type {  SecteurFormType, TravailleurFormType } from "../../../types/FormType";
import TravailleurView from "./travailleurView";
import TravailleurService from "../../../service/TravailleurService";
import uidContext from "../../../AppContext";
import SecteurService from "../../../service/SecteurService";


function TravailleurContenair() {

  //logique du formulaire
  const [isLoading,setIsLoading]=useState(false)
  //progressBAr
  const [etap, setEtap] = useState(1);
  const totalEtaps = 2
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
  }=useForm<TravailleurFormType>();

  
  useEffect(() => {
  SecteurService.get().then(setSecteur);
}, []);


  const navigate =useNavigate()
  const travailleur = useContext(uidContext);
  const id=travailleur?.profile._id;
  console.log("iid de user", id)


  const onSubmit: SubmitHandler<TravailleurFormType> = async (formData:TravailleurFormType) => {
    console.log("formData avant", formData)
    setIsLoading(true)
    
    await TravailleurService.update(id,formData)
      .then(async({  status }) => {

        if(etap<totalEtaps){
          setEtap((prev) => prev + 1)
        }else if(status===200){
          navigate('/'); // redirection après succès
        }

      })
      .catch(err => {
        console.error("Erreur de connexion:", err);
         toast.error("Email ou mot de pass incorrect")
      })
      .finally(() => {
        setIsLoading(false);
      });
    
  };


  return ( 
    <>
        <div className=" mx-auto p-3 bg-white ">
      {/* Barre de progression */}
      <div className="w-full bg-gray-200 rounded-full h-1 my-2">
        <div
          className="bg-primary h-1 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      </div>
      <div className="text-center">{etap}/{totalEtaps}  </div>

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
    </>
  )
}

export default TravailleurContenair
