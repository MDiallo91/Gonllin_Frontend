import type { FormPropsType } from "../../../../types/FormType"
import Button from "../../../design_system/button/button";
import Input from "../../../design_system/form/Input";

interface Props{
  form:FormPropsType
}


function LoginForm({form}:Props) {
    const { errors,  register, handleSubmit, onSubmit, isLoading } = form;

  return (
   <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-8 pb-5" >
        <Input
          isLoading={isLoading}
          placeholder="mdoudail@gmail.com"
          register={register}
          type="email"
          errors={errors}
          errorMsg="Ce champ est aubligatoir"
          id="email"
        />
        <Input
          isLoading={isLoading}
          placeholder="Mot de passe"
          register={register}
          type="password"
          errors={errors}
          errorMsg="Ce champ est aubligatoir"
          id="password"
        />
       
        <Button isLoading={isLoading} fullWight   type="submit" >Connexion</Button>
    </form>
  )
}

export default LoginForm
