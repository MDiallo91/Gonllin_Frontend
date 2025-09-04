import { useForm, type SubmitHandler } from "react-hook-form"
import RegisterView from "../../ui/component/connexion/register/RegisterView"
import type {  RegisterFormType } from "../../types/FormType";
import { useState } from "react";


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

  const onSubmit :SubmitHandler<RegisterFormType> = async (formData) =>{
    console.log("formData",formData)
    setIsLoading(true)
  }
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
