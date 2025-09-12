import { useForm, type SubmitHandler } from "react-hook-form"
import RegisterView from "../../ui/component/connexion/register/RegisterView"
import type {  RegisterFormType } from "../../types/FormType";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserService from "../../service/userService";


function Register() {

  //logique du formulaire
  const [isLoading,setIsLoading]=useState(false)
  const {
    handleSubmit,
    control,
    register,
    formState:{errors},
    setError,
    reset,
  }=useForm<RegisterFormType>();

  const navigate =useNavigate()

  const onSubmit: SubmitHandler<RegisterFormType> = async (formData:RegisterFormType) => {
    // console.log("formData avant", formData)
    setIsLoading(true)
    //gestion des erreur
    if (formData.password.length <= 5) {
      setError("password", {
        type: "manual",
        message: "Mot de passe trop court"
      });
      setIsLoading(false)
      return
    }

    await UserService.register(formData)
      .then(async({  status }) => {

        // if(status===200){
          navigate('/connexion/confirmation'); // redirection après succès
          window.location.reload()
        // }
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
      <RegisterView
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

export default Register
