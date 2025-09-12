import { useState } from "react";
import type { LoginFormType } from "../../types/FormType";
import LoginView from "../../ui/component/connexion/login/LoginView"
import { useForm, type SubmitHandler } from "react-hook-form";
import UserService from "../../service/userService";
import { useNavigate } from "react-router-dom";
import  {toast} from "react-toastify"


function Login() {

  //logique du formulaire
  const [isLoading, setIsLoading] = useState(false)
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setError,
    reset,
  } = useForm<LoginFormType>();

  const navigate =useNavigate()

  const onSubmit: SubmitHandler<LoginFormType> = async (formData:LoginFormType) => {
    console.log("formData avant", formData)
    setIsLoading(true)
    await UserService.login(formData)
      .then(async({  status }) => {


        if(status===200){
          navigate('/profil'); // redirection après succès
          window.location.reload()
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
    <div>
      <LoginView
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

export default Login
