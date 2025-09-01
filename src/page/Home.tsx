import Contenair from "../ui/component/contenair/Contenair"
import Typography from "../ui/design_system/typography/typography"
import image1 from "../../public/images/profil1.png"
import Button from "../ui/design_system/button/button"
import { RiArrowRightFill } from "react-icons/ri"
import Avatar from "../ui/design_system/avatar/Avatar"
import PubProjet from "../../public/svg/publierProjet.svg"
import ChoiOuvrier from "../../public/svg/choiOuvrier.svg"
import Postuler from "../../public/svg/postuler.svg"


function Home() {
  return (
    <>
        <Contenair className="flex flex-col md:flex-row  text-white items-center p-6 py-12 bg-primary-200 gap-3 md:gap-10">
        {/* Texte */}
        <div className="flex flex-col w-full md:w-1/2 text-center md:text-left">
            <Typography component="h1" variant="body-lg" weight="medium" theme="secondary"  className=" text-center md:text-5xl md:text-left font-medium "
 >
            Connectez-vous avec des professionnels qualifiés
            </Typography>

            <Typography
            variant="body-base"
            component="p"
            weight="medium"
            className="mt-4 p-3 text-sm text-white hidden md:block"
            >
            Bienvenue sur notre plateforme, où la recherche d'ouvriers qualifiés
            devient simple et rapide. Trouvez des professionnels de confiance pour
            tous vos projets de travaux.
            </Typography>

            <Typography
            variant="h5"
            weight="medium"
            component="div"
            className="text-lg md:text-xl my-2 md:my-6 text-white"
            >
            Réalisez votre projet
            </Typography>

            <form action="" className="w-full max-w-md mx-auto my-1 md:mx-0">
            <div className="flex items-center bg-white rounded-2xl shadow-md overflow-hidden my-6">
                <input
                type="text"
                placeholder="Décrivez votre projet..."
                className="flex-grow px-4 py-2 bg-transparent focus:outline-none text-gray-700 text-sm md:text-base"
                />
                <Button
                variant="icon"
                size="small"
                icon={{ icon: RiArrowRightFill }}
                />
            </div>
            </form>
        </div>

        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center">
            <img
            src={image1}
            alt="profil"
            className="w-3/4 md:w-full max-w-sm md:max-w-md rounded-xl "
            />
        </div>
        </Contenair>


      {/* Section comment ça marche */}
        <Contenair className="md:py-5 p-0 md:px-6 mx-auto gap-1 md:gap-8 bg-gray-50">
            <Typography
                component="h3"
                weight="medium"
                theme="secondary"
                className="text-center my-10 text-xl md:text-2xl"
            >
                Comment ça marche
            </Typography>

            <Contenair className="flex flex-col md:flex-row justify-around items-center my-7 gap-10">
                <div className="flex flex-col justify-center items-center text-center w-full md:w-1/3">
                    <Avatar src={PubProjet} size="small" alt="projet" />
                    <Typography
                        variant="h5"
                        weight="medium"
                        component="div"
                        className="text-base md:text-lg my-1"
                    >
                        Publiez votre projet
                    </Typography>
                     <p className="px-5 text-sm">Décrivez vos besoins en quelques clics : type de travaux, budget et délais. Votre projet sera visible par des ouvriers qualifiés prêts à vous aider.</p>
                </div>

                <div className="flex flex-col justify-center items-center text-center w-full md:w-1/3">
                    <Avatar src={Postuler} size="small" alt="projet" />
                    <Typography
                        variant="h5"
                        weight="medium"
                        component="div"
                        className="text-base md:text-lg my-1"
                    >
                        Les ouvriers postulent à votre projet
                    </Typography>
                     <p className="px-5 text-sm">Des ouvriers compétents ou entreprise consultent votre projet et vous envoient leurs propositions. Comparez les profils, l’expérience et les avis laissés par d’autres clients.</p>
                </div>

                <div className="flex flex-col justify-center items-center text-center w-full md:w-1/3">
                    <Avatar src={ChoiOuvrier} size="small" alt="projet" />
                    <Typography
                        variant="h5"
                        weight="medium"
                        component="div"
                        className="text-base md:text-lg my-1"
                    >
                        Vous choisissez votre ouvrier
                    </Typography>
                    <p className="px-5 text-sm">Sélectionnez l’ouvrier qui correspond le mieux à vos attentes. Collaborez en toute confiance et suivez l’avancement de votre projet.</p>
                </div>
            </Contenair>
            <div className="flex items-center justify-center px-20 pb-3 pt-10">
                <Button size="small" variant="outline">
                    Publier votre projet
                </Button>
            </div>
        </Contenair>

        {/* section Impact  */}
        <Contenair className=" bg-primary-200 ">
            <Typography component="h3" weight="medium" theme="secondary"
                className="text-center text-white py-10 text-xl md:text-2xl">
                Notre impact
            </Typography>
            <Contenair className="p-10 mx-auto flex flex-col gap-4 md:flex-row md:justify-around md:px-8 md:py-10">
                {/* Bloc 1 */}
                <div
                    className="flex items-center gap-3 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow p-4 md:p-6">
                    <Avatar src={PubProjet} size="very-small" alt="projet" />
                    <div className="flex flex-col">
                        <Typography variant="h5" weight="medium"
                            className="text-xl md:text-2xl text-primary">
                            222
                        </Typography>
                        <Typography variant="body-sm" weight="regular"
                            className="text-gray-600">
                            Professionnels
                        </Typography>
                    </div>
                </div>
                {/* Bloc 2 */}
                <div
                    className="flex items-center gap-3 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow p-4 md:p-6">
                    <Avatar src={PubProjet} size="very-small" alt="projet" />
                    <div className="flex flex-col">
                        <Typography variant="h5" weight="medium"
                            className="text-xl md:text-2xl text-primary">
                            122
                        </Typography>
                        <Typography variant="body-sm" weight="regular"
                            className="text-gray-600">
                            Métiers
                        </Typography>
                    </div>
                </div>
                {/* Bloc 3 */}
                <div
                    className="flex items-center gap-3 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow p-4 md:p-6">
                    <Avatar src={PubProjet} size="very-small" alt="projet" />
                    <div className="flex flex-col">
                        <Typography variant="h5" weight="medium"
                            className="text-xl md:text-2xl text-primary">
                            252
                        </Typography>
                        <Typography variant="body-sm" weight="regular"
                            className="text-gray-600">
                            Projets
                        </Typography>
                    </div>
                </div>
            </Contenair>
        </Contenair>

    </>
  )
}

export default Home
