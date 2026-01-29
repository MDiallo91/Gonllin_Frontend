import { useContext } from "react"
import image1 from "../../../public/images/profil1.png"
import uidContext from "../../AppContext"


function HomeProfil() {
  const user = useContext(uidContext)
  const BASE_URL = import.meta.env.VITE_API_URL;



  return (
    <div className="max-w-4xl mx-auto bg-white my-6 rounded-xl shadow-lg overflow-hidden font-sans">
      {/* Couverture */}
      <div className="relative h-56">
        <img
          src={`${BASE_URL}${user?.profile?.secteur?.picture}`}
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary  bg-opacity-40"></div>
        <div className="absolute md:bottom-4 bottom-10 left-8 flex items-center">
          <img
            
             src={`${BASE_URL}${user?.photo}`}
            alt="profile"
            className="w-25 h-25 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
          />
          <div className="ml-6 text-white drop-shadow-lg">
            <h1 className="text-2xl md:text-4xl font-bold">{user?.profile?.prenom} {user?.profile?.nom}</h1>
            <p className="text-lg">Activité: {user?.profile?.secteur?.nom} </p>
           
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-10 space-y-8 text-gray-700">

        {/* À propos */}
        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-300 pb-2 mb-4">À propos</h2>
          <p className="leading-relaxed"> {user?.profile.bio} </p>
        </section>

        {/* Expérience */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">Adresse</h2>
          <h4  className="mb-6 font-bold"> {user?.profile?.adresse} </h4>
        </section>


        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">Contact</h2>
           <h4  className="mb-1 "><span className="font-bold">Telephone: </span> {user?.profile?.telephone} </h4>
           <h4  className=" "> <span className="font-bold">Email: </span> {user?.email} </h4>
        </section>
      </div>
    </div>
    
  )
}

export default HomeProfil
