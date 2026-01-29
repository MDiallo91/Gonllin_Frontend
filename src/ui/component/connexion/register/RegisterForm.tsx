import type { FormPropsType } from "../../../../types/FormType"
import Button from "../../../design_system/button/button";
import Input from "../../../design_system/form/Input";
import Select from "../../../design_system/form/Select";


interface Props{
  form:FormPropsType
  role?:string
}


function RegisterForm({form,role}:Props) {
  const { errors,  register, handleSubmit, onSubmit, isLoading } = form;

  return (
  
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-8 pb-5" >
        <Input
          isLoading={isLoading}
          placeholder="exemple@gmail.com"
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
        {!role &&(
            <Select
          isLoading={isLoading}
          register={register}
          errors={errors}
          id="role"
          options={[
            { label: "Entreprise", value: "entreprise" },
            { label: "Indépendant", value: "independant" },
          ]}
        />
        )}
       

        <Button isLoading={isLoading} fullWight  type="submit" >S'inscrire</Button>
    </form>
   
  )
}

export default RegisterForm
