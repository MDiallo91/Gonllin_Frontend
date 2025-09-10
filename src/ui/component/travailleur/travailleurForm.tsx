import type { FormPropsType, SecteurFormType } from "../../../types/FormType";
import Button from "../../design_system/button/button";
import Input from "../../design_system/form/Input";
import Select from "../../design_system/form/Select";
import Textarea from "../../design_system/form/Textarea";
import Typography from "../../design_system/typography/typography";

interface Props {
  form: FormPropsType
  etap: number
  secteur:SecteurFormType[]
  setEtap: React.Dispatch<React.SetStateAction<number>> // 👈 bien typé ici aussi
  totalEtaps: number
}


function TravailleurForm({ form, etap, setEtap, totalEtaps ,secteur }: Props) {
    const { errors, register, handleSubmit, onSubmit, isLoading } = form;

    return (
        <>
            {etap===1 &&(
            <div>
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded flex-col">
                <Typography variant="h5" component="h1" className="text-xl">Informations personnellles</Typography>
                <Typography variant="body-base" component="p" className="py-2 text-justify">
                    Ces informations nous 
                    permettent de mieux vous identifier et de faciliter la communication avec vous. Elles resteront
                     confidentielles.
                </Typography>   
        
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-8 pb-5" >
                <Input
                    isLoading={isLoading}
                    placeholder="Prenom"
                    register={register}
                    type="text"
                    errors={errors}
                    errorMsg="Ce champ est aubligatoir"
                    id="prenom"
                />
                <Input
                    isLoading={isLoading}
                    placeholder="Nom"
                    register={register}
                    type="text"
                    errors={errors}
                    errorMsg="Ce champ est aubligatoir"
                    id="nom"
                />
                 <Input
                    isLoading={isLoading}
                    placeholder="Telephone"
                    register={register}
                    type="text"
                    errors={errors}
                    errorMsg="Ce champ est aubligatoir"
                    id="telephone"
                />
                <Input
                    isLoading={isLoading}
                    placeholder="Ville"
                    register={register}
                    type="text"
                    errors={errors}
                    errorMsg="Ce champ est aubligatoir"
                    id="adresse"
                />
              

                <Button isLoading={isLoading}   type="submit" >Suivant</Button>
            </form>
            </div>
        )}

         {etap===2 &&(
            <div>
            <div className="flex items-center justify-between flex-col p-3 bg-secondary-50 rounded">
                <Typography variant="h5" component="h1" className="text-xl md:text-2xl">Informations Professionnelles</Typography>
                <Typography variant="body-base" component="p" className="py-2 text-justify">Ces informations nous permettent de mieux vous identifier et de faciliter la communication avec vous. Elles resteront confidentielles.</Typography>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-8 pb-5" >
<Select
  isLoading={isLoading}
  register={register}
  errors={errors}
  id="secteur"
  header="Votre métier"
  options={secteur.map((s) => ({
    label: s.nom,
    value: s._id,
  }))}
/>


                 <Select
                    isLoading={isLoading}
                    register={register}
                    errors={errors}
                    id="zoneIntervention"
                    options={[
                        { label: "Kindia", value: "Kindia" },
                        { label: "Mamou", value: "Mamou" },
                        { label: "Labe", value: "Labe" },
                        { label: "Boke", value: "Boke" },
                    ]}
                />
                <Textarea
                    isLoading={isLoading}
                    placeholder="Presenter-vous en queleque ligne exple: Je suis un plombier qualifié avec 2 ans d’expérience dans l’installation, la réparation et l’entretien de systèmes sanitaires et de chauffage. Sérieux et disponible, je vous garantis un travail soigné et durable."
                    register={register}
                    errors={errors}
                    errorMsg="Ce champ est aubligatoir"
                    id="bio"
                />
               
                <div className="flex justify-between">
                    <button
          type="button"
        
          onClick={() => setEtap((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-lg disabled:opacity-50"
        >
          Precedant
        </button>
                
                <Button isLoading={isLoading}  type="submit" >Enregistrer</Button>
                </div>
            </form>
            </div>
        )}

        </>
    )
}

export default TravailleurForm
