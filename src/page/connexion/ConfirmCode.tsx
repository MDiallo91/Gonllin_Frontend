import { useState } from "react";
import type { confirmFormType } from "../../types/FormType";
import { useForm, type SubmitHandler } from "react-hook-form";
import UserService from "../../service/userService";
import { toast } from "react-toastify";
import ConfirmView from "../../ui/component/connexion/confmation/confirmView";


function Confirm() {

  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<confirmFormType>();

  const onSubmit: SubmitHandler<confirmFormType> = async (formData: confirmFormType) => {
    setIsLoading(true);
    try {
      const { status, data } = await UserService.confirm(formData);
      if (status === 200) {
        // On utilise la réponse API car le contexte n'est pas encore rafraîchi
        const role = data?.user?.role;
        // window.location.href force un rechargement complet → App.tsx re-fetch le user avec le cookie JWT
        if (role === "client")       window.location.href = "/clientInfo";
        else if (role === "independant") window.location.href = "/travailleurInfo";
        else if (role === "entreprise")  window.location.href = "/entrepriseInfo";
        else                             window.location.href = "/profil";
      }
    } catch {
      toast.error("Erreur de confirmation, vérifiez le code et réessayez");
    } finally {
      setIsLoading(false);
    }
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
