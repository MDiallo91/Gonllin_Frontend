import { useContext, useState } from "react";
import type { confirmFormType } from "../../types/FormType";
import { useForm, type SubmitHandler } from "react-hook-form";
import UserService from "../../service/userService";
import { useNavigate } from "react-router-dom";
import  {toast} from "react-toastify"
import ConfirmView from "../../ui/component/connexion/confmation/confirmView";
import uidContext from "../../AppContext";


function Confirm() {

  //logique du formulaire
  const [isLoading, setIsLoading] = useState(false)
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
 
  } = useForm<confirmFormType>();

  const navigate =useNavigate()
  const user = useContext(uidContext);

  const onSubmit: SubmitHandler<confirmFormType> = async (formData:confirmFormType) => {
    console.log("formData avant", formData)
    setIsLoading(true)
    await UserService.confirm(formData)
      .then(async({  status }) => {


        if(status===200){
          if(user?.role==="client"){
             navigate('/clientInfo'); // redirection après succès
          }
          if(user?.role==="independant"){
             navigate('/travailleurInfo'); // redirection après succès
          }
          if(user?.role==="entreprise"){
             navigate('/entrepriseInfo'); // redirection après succès
          }
        }
        
      })
      .catch(err => {
        console.error("Erreur de connexion:", err);
         toast.error("Erreur de cofirmation, verifier le code et reessayer")
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  

  return (
    <div>
      <ConfirmView
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

export default Confirm
