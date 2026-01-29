import type { FormPropsType, SecteurFormType } from "../../../types/FormType";
import Button from "../../design_system/button/button";
import Input from "../../design_system/form/Input";
import Radio from "../../design_system/form/Radio";
import Select from "../../design_system/form/Select";
import Textarea from "../../design_system/form/Textarea";
import Typography from "../../design_system/typography/typography";

interface Props {
    form: FormPropsType
    etap: number
    secteur: SecteurFormType[]
    setEtap: React.Dispatch<React.SetStateAction<number>> 
    totalEtaps?: number
}


function ClientForm({ form, etap, setEtap, totalEtaps, secteur }: Props) {
    const { errors, register, handleSubmit, onSubmit, isLoading } = form;

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="" >

                {etap === 1 && (
                    <div>
                        <div className="flex  text-left  rounded flex-col">
                            <Typography variant="body-sm" component="h5" weight="medium" className="text-left">Quel type de projet voulez-vous réalisé ?</Typography>
                            <p className="text-gray-200 text-sm text-left">
                                Indiquez le type de votre projet et où il sera réalisé
                            </p>

                        </div>
                        <div className="space-y-4 pt-3 pb-3 mt-1">

                            <Select
                                isLoading={isLoading}
                                register={register}
                                errors={errors}
                                id="secteur"
                                header="Choisissez"
                                options={secteur.map((s) => ({
                                    label: s.nom,
                                    value: s._id,
                                }))}
                            />

                            <Input
                                isLoading={isLoading}
                                placeholder="Ville"
                                register={register}
                                type="text"
                                errors={errors}
                                errorMsg="Ce champ est aubligatoir"
                                id="localite"
                            />
                            <Button isLoading={isLoading} type="submit" >Suivant</Button>


                        </div>
                    </div>
                )}

                {etap === 2 && (
                    <div>
                        <div className="flex  text-left  rounded flex-col">
                            <Typography variant="body-sm" component="h5" weight="medium" className="text-left">Decrivez nous votre projet ?</Typography>
                            <p className="text-gray-200 text-sm text-left hidden md:block">
                                La description de votre projet nous permettra d'examiner de pres le projet et de le montré a de potientiels realisateur
                            </p>

                        </div>
                        <div className="space-y-4 pt-3 pb-3 mt-1">

                            <Textarea
                                isLoading={isLoading}
                                register={register}
                                errors={errors}
                                id="description"
                                placeholder="Exemple:Je Veut construire une maison 4 chambre ,salon deux douche, une terrasse"
                                errorMsg="Ce champ est aubligatoir"
                            />
                            <div className="flex  text-left  rounded flex-col">
                                <Typography variant="body-sm" component="h5" weight="medium" className="text-left">Quand est ce que vous voulez réaliser votre projet ?</Typography>
                                <p className="text-gray-200 hidden md:block text-sm text-left ">
                                    Indiquez la période à laquelle vous souhaitez que votre projet démarre afin que nous puissions mieux planifier sa réalisation                                </p>
                            </div>
                            <Radio
                                isLoading={false}
                                label="Urgent"
                                value="urgent"
                                register={register}
                                errors={errors}
                                id="dateDebut"
                            />

                            <Radio
                                isLoading={false}
                                label="Dans une semaine"
                                value="semaine"
                                register={register}
                                errors={errors}
                                id="dateDebut"
                            />
                            <Radio
                                isLoading={false}
                                label="Dans un moi"
                                value="moi"
                                register={register}
                                errors={errors}
                                id="dateDebut"
                            />
                            <div className="flex justify-between">
                                <button
                                    type="button"

                                    onClick={() => setEtap((prev) => prev - 1)}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-lg disabled:opacity-50"
                                >
                                    Precedant
                                </button>

                                <Button isLoading={isLoading} type="submit" >Suivant</Button>
                            </div>



                        </div>
                    </div>
                )}

                {etap === 3 && (
                    <div>
                        <div className="flex  text-left  rounded flex-col">
                            <Typography variant="body-sm" component="h5" weight="medium" className="text-left">Vos information </Typography>
                            <p className="text-gray-200 hidden md:block text-sm text-left ">
                                Ajoutez vos informations afin qu'on puisse presenter votre projet a des potientiels realisateur                                </p>

                        </div>
                        <div className="space-y-4 pt-3 pb-3 mt-1">

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
                                placeholder="Nom (facultif)"
                                register={register}
                                type="text"
                                errors={errors}
                                errorMsg="Ce champ est aubligatoir"
                                id="nom"
                                required={false}
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

                            <div className="flex justify-between">
                                <button
                                    type="button"

                                    onClick={() => setEtap((prev) => prev - 1)}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-lg disabled:opacity-50"
                                >
                                    Precedant
                                </button>

                                <Button isLoading={isLoading} type="submit" >Enregistrer</Button>
                            </div></div>
                    </div>
                )}

            </form>

        </>
    )
}

export default ClientForm
