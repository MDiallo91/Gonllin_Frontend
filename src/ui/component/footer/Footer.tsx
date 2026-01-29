import { RiFacebookFill, RiDiscordFill, RiTwitterFill, RiInstagramFill } from "react-icons/ri";
import Button from "../../design_system/button/button";
import Contenair from "../contenair/Contenair";



function Footer() {
        const date = new Date();
        const annee = date.getFullYear();

  return (
    <>
       <Contenair className=" bg-gray-900 text-white px-15 py-10">
            <footer className="px-10 md:flex  justify-around">
                <div className="">
                    <p className=" uppercase mb-3">Nos metier</p>
                    <ul className="text-sm gap-5">
                        <li className="mb-3">Plomberie</li>
                        <li className="mb-3">Menuserie</li>
                        <li className="mb-3">Carrelage</li> 
                        <li className="mb-3">Mecanique</li>
                        <li className="mb-3">Plomberie</li>
                    </ul>
                </div>
                 <div className="">
                    <p className="  uppercase mb-3">Resources</p>
                    <ul className="text-sm gap-5">
                        <li className="mb-3">Accueil</li>
                        <li className="mb-3">Publier un projet</li>
                        <li className="mb-3">se connecter</li>
                        <li className="mb-3">S'inscrire</li>
                        <li className="mb-3">Decouvrir</li>
                    </ul>
                </div>
                 <div className="">
                    <p className="  uppercase mb-3">Suivez nous</p>
                    <ul className="text-sm gap-5">
                          <li className="mb-3 flex items-center gap-2"><Button
                              variant="icon"
                              size="small"
                              icon={{ icon: RiFacebookFill }}
                          />Facebook</li>
                           <li className="mb-3 flex items-center gap-2"><Button
                              variant="icon"
                              size="small"
                              icon={{ icon: RiDiscordFill }}
                          />Discord</li>
                         <li className="mb-3 flex items-center gap-2"><Button
                              variant="icon"
                              size="small"
                              icon={{ icon: RiTwitterFill }}
                          />Twitter</li>
                           <li className="mb-3 flex items-center gap-2"><Button
                              variant="icon"
                              size="small"
                              icon={{ icon: RiInstagramFill }}
                          />Intagram</li>
                    </ul>

                </div>
               
            </footer>
             <div className="text-center ">
                    <p>&copy; Copyright Gollain {annee} - Tous droits réservés</p>
                </div>
        </Contenair>
    </>
  )
}

export default Footer
