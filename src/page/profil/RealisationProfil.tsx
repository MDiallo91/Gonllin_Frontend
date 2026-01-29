import { useContext } from "react"
import RealistionContenair from "../../ui/component/profil/realisation/RealistionContenair"
import uidContext from "../../AppContext"
import EncherContenair from "../../ui/component/profil/enchere/EncherContenair"

function RealisationProfil() {
    const user=useContext(uidContext)

  return (
    <>
     
       {user?.role==="client"?
    (<EncherContenair/>):
    ( <RealistionContenair/>)}
    </>
  )
}

export default RealisationProfil
