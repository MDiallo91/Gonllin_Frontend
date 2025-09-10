import { useState } from "react";
import ForgetPasswordView from "../../ui/component/connexion/forgetPassword/ForgetPasswordView.tsx"
import type { ForgetPasswordFormType } from "../../types/FormType.tsx";
import { useForm, type SubmitHandler } from "react-hook-form";

function ForgetPassword() {

   //logique du formulaire
    const [isLoading,setIsLoading]=useState(false)
    const {
      handleSubmit,
      control,
      register,
      formState:{errors},
      setError,
      reset,
    }=useForm<ForgetPasswordFormType>();
  
    const onSubmit :SubmitHandler<ForgetPasswordFormType> = async (formData) =>{
      console.log("formData",formData)
      setIsLoading(true)
    }

  return (
    <div>
      <ForgetPasswordView
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

export default ForgetPassword
