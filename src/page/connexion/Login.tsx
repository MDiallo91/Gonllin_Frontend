import { useState } from "react";
import type { LoginFormType } from "../../types/FormType";
import LoginView from "../../ui/component/connexion/login/LoginView"
import { useForm, type SubmitHandler } from "react-hook-form";

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

  const onSubmit: SubmitHandler<LoginFormType> = async (formData) => {
    console.log("formData", formData)
    setIsLoading(true)
  }

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
