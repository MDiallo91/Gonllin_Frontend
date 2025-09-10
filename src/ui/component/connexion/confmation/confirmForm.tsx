import type { FormPropsType } from "../../../../types/FormType"
import Button from "../../../design_system/button/button";
import Input from "../../../design_system/form/Input";

interface Props{
  form:FormPropsType
}


function ConfirmForm({form}:Props) {
    const { errors,  register, handleSubmit, onSubmit, isLoading } = form;

  return (
   <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-8 pb-5" >

        <Input
          isLoading={isLoading}
          placeholder="Code de confirmation"
          register={register}
          type="text"
          errors={errors}
          errorMsg="Ce champ est aubligatoir"
          id="code"
        />
       
        <Button isLoading={isLoading} fullWight   type="submit" >Verifier</Button>
    </form>
  )
}

export default ConfirmForm
