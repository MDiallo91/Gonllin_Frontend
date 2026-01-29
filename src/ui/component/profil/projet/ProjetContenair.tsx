import { useContext, useEffect, useState } from "react";
import uidContext from "../../../../AppContext";
import ProjetView from "./ProjetView";
import { useForm, } from "react-hook-form";
import type { EncherTypeForm, ProjetTypeForm } from "../../../../types/FormType";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProjetService from "../../../../service/ProjetService";
import EncherService from "../../../../service/EncherService";

const ProjetContenair = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [projet,setProjet]=useState<ProjetTypeForm[]>([])

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setError,
    reset,
  } = useForm<EncherTypeForm>();


  const navigate = useNavigate()
  const user = useContext(uidContext);
  const userId= user?._id;
  console.log("les user id",userId)
  const secteurId= user?.profile.secteur._id;
  console.log("secteur",secteurId)

useEffect(() => {
  setIsLoading(true)
  ProjetService.getProjets(secteurId).then((res) => {
    setProjet(res.data);
    console.log("Data",res)
      setIsLoading(false)
    
  });
}, []);




const onSubmit = async (formData: any, projetId: string) => {
  setIsLoading(true);


  const payload = {
    ...formData,
    projet: projetId,
    user: userId,
  };
  console.log("les dataForm",payload)
  try {
    const { status } = await EncherService.register(payload);
      toast.success("Succes!");
    if (status === 200) {
       
      navigate("/profil/projet");
      
    }
  } catch (err) {
    console.error("Erreur de connexion:", err);
    toast.error("Une erreur est survenue, veuillez réessayer");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <ProjetView
      projet={projet}
       form={{
          errors,
          control,
          register,
          handleSubmit,
          onSubmit,
          isLoading,
        }}
      />
  );
};

export default ProjetContenair;
