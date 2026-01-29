import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RealisationService from "../../../../service/RealisationService";

const ProjetForm = ({ realisateurId }: { realisateurId: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!files || files.length === 0) {
            toast.warning("Veuillez choisir au moins une image");
            return;
        }

        const formData = new FormData();
        formData.append("realisateur", realisateurId);
        formData.append("description", description);

        for (let i = 0; i < files.length; i++) {
            formData.append("images", files[i]);
        }

        try {
            const { status } = await RealisationService.post(formData);

            if (status === 200) {
                toast.success("Publié !");
                setIsOpen(false);
                navigate("/profil"); // redirection après succès
                navigate("/profil/realisation"); // redirection après succès
            }
        } catch (err) {
            console.error("Erreur d'enregistrement:", err);
            toast.error("Une erreur est survenue lors de l'enregistrement");
        }
    };

    return (
        <>
            {/* bouton d'ouverture */}
            <button
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                onClick={() => setIsOpen(true)}
            >
                Publier quelque chose
            </button>

            {/* modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Ajouter une réalisation</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">


                            <div className="space-y-2">
                                <label
                                    htmlFor="images"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Choisir des images <span className="text-red-500">*</span>
                                </label>

                                <input
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setFiles(e.target.files)}
                                    className="block w-full text-sm text-gray-600 
                                        file:mr-4 file:py-2 file:px-4 
                                        file:rounded-lg file:border-0 
                                        file:text-sm file:font-semibold 
                                        file:bg-primary file:text-white 
                                        hover:file:bg-primary-400"
                                />

                                <p className="text-xs text-gray-500">
                                    Vous pouvez sélectionner une ou plusieurs images (format JPG ou PNG).
                                </p>
                            </div>

                            <textarea
                                className="w-full border border-primary rounded p-2"
                                placeholder="Ajoutez du texte"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />


                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 rounded"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded"
                                >
                                    Publier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjetForm;
