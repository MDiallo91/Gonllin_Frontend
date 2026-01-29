import { useContext, useEffect, useState } from "react";
import uidContext from "../../../../AppContext";
import { useForm, } from "react-hook-form";
import type { EncherTypeForm } from "../../../../types/FormType";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EncherService from "../../../../service/EncherService";
import EncherView from "./EnchereView"

const EncherContenair = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [encher,setEncher]=useState<EncherTypeForm[]>([])

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
  const userId= user?._id
  const secteurId= user?.profile?.secteur;
  // console.log("secteur",secteurId)

useEffect(() => {
  setIsLoading(true)
  EncherService.getEncherByUser(userId).then((res) => {
    setEncher(res.data);
      setIsLoading(false)
  });
}, [userId]);


const onSubmit = async (enchereId: string, data: { userChoisi: string }) => {
  setIsLoading(true);
  // console.log("Enchère ID:", enchereId);
  // console.log("Payload:", data);

  try {
    const { status } = await EncherService.update(enchereId, data);
    if (status === 200) {
      toast.success("vous avez engagé ce professionnel!");
      navigate("/profil/realisation");
    }
  } catch (err) {
    console.error("Erreur de connexion:", err);
    toast.error("Une erreur est survenue, veuillez réessayer");
  } finally {
    setIsLoading(false);
  }
};




  return (
    <EncherView
      enchere={encher}
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

export default EncherContenair;
