import type { FormPropsType, SecteurFormType } from "../../../types/FormType";
import Button from "../../design_system/button/button";
import Input from "../../design_system/form/Input";
import Select from "../../design_system/form/Select";
import Textarea from "../../design_system/form/Textarea";
import Typography from "../../design_system/typography/typography";

interface Props {
    form: FormPropsType
    etap: number
    secteur: SecteurFormType[]
    setEtap: React.Dispatch<React.SetStateAction<number>> // 👈 bien typé ici aussi
    totalEtaps: number
}


function EntrepriseForm({ form, etap, setEtap, totalEtaps, secteur }: Props) {
    const { errors, register, handleSubmit, onSubmit, isLoading } = form;

    return (
        <><form onSubmit={handleSubmit(onSubmit)} className="" >

            {etap === 1 && (
                <div>
                    <div className="flex  text-left  rounded flex-col">
                        <Typography variant="body-sm" component="h5" weight="medium" className="text-left">INformatoin sur votre entreprise</Typography>
                        <p className="text-gray-300 hidden md:block text-sm text-left">
                            Ces informations nous permettront de mieux comprendre votre activité et de présenter votre entreprise aux clients de manière professionnelle.
                        </p>

                    </div>
                    <div className="space-y-4 pt-3 pb-3 mt-1">

                        <Input
                            isLoading={isLoading}
                            placeholder="Nom de l'entreprise"
                            register={register}
                            type="text"
                            errors={errors}
                            errorMsg="Ce champ est aubligatoir"
                            id="nom"
                        />
                        <Select
                            isLoading={isLoading}
                            register={register}
                            errors={errors}
                            id="secteur"
                            header="Secteur d'activité"
                            options={secteur.map((s) => ({
                                label: s.nom,
                                value: s._id,
                            }))}
                        />

                        <Button isLoading={isLoading} type="submit" >Suivant</Button>


                    </div>
                </div>
            )}

            {etap === 2 && (
                <div>
                    <div className="flex  text-left  rounded flex-col">
                        <Typography variant="body-sm" component="h5" weight="medium" className="text-left">Quel sont vos coordonnées </Typography>
                        <p className="text-gray-300 text-sm text-left">
                            Indequez vos coordonnées et votre zone d'intervention
                        </p>

                    </div>
                    <div className="space-y-4 pt-3 pb-3 mt-1">

                        <Input
                            isLoading={isLoading}
                            placeholder="Telephone"
                            register={register}
                            type="text"
                            errors={errors}
                            errorMsg="Ce champ est aubligatoir"
                            id="telephone"
                        />

                        <Select
                            isLoading={isLoading}
                            register={register}
                            errors={errors}
                            id="adresse"
                            header="Ville (votre addresse)"
                            options={[
                                { label: "Kindia", value: "Kindia" },
                                { label: "Mamou", value: "Mamou" },
                                { label: "Labe", value: "Labe" },
                                { label: "Boke", value: "Boke" },
                            ]}
                        />

                        <Select
                            isLoading={isLoading}
                            register={register}
                            errors={errors}
                            id="zoneIntervention"
                            header="Ville d'intervention"
                            options={[
                                { label: "Kindia", value: "Kindia" },
                                { label: "Mamou", value: "Mamou" },
                                { label: "Labe", value: "Labe" },
                                { label: "Boke", value: "Boke" },
                            ]}
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
                        <Typography variant="body-sm" component="h5" weight="medium" className="text-left">Ajouter une description a votre entreprise </Typography>
                        <p className="text-gray-300 text-sm text-left">
                            Ajoutez une description de votre entreprise (ex. : activités principales, années d’expérience, zone d’intervention, valeurs…)
                        </p>
                    </div>
                    <div className="space-y-4 pt-3 pb-3 mt-1">
                        <Textarea
                            isLoading={isLoading}
                            register={register}
                            errors={errors}
                            id="bio"
                            placeholder="Exemple: Entreprise spécialisée dans l’installation, la réparation et l’entretien de systèmes de plomberie et de chauffage..."
                            errorMsg="Ce champ est aubligatoir"
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

export default EntrepriseForm
