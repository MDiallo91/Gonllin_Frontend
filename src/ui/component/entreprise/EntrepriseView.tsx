import type { FormPropsType, SecteurFormType } from "../../../types/FormType"
import Box from "../../design_system/box/Box"
import Contenair from "../contenair/Contenair"
import EntrepriseForm from "./EntrepriseForm"
// import EntrepriseForm from "./entrepriseForm"

import RegisterImg from "/svg/presentation.svg"


interface Props {
  form: FormPropsType
  etap: number
  setEtap: React.Dispatch<React.SetStateAction<number>> 
  totalEtaps: number
  secteur:SecteurFormType[]
}


const EntrepriseView=({form, etap, setEtap, totalEtaps,secteur }:Props)=> {
  return (
    <Contenair  className="min-h-screen px-5 md:px-10 py-0 flex flex-col items-center md:flex-row md:gap-20 md:py-7"> 
        <div className="flex items-center w-full md:w-1/3">
            <div className="w-full h-30 md:h-[500px]">
              <img src={RegisterImg} alt="s'inscrire" />
            </div>
            
        </div>
        <div className="flex items-center w-full md:w-2/3">
          <Box className="opacity-[.90] md:opacity-100 " >

            {/* composant form  */}
            <EntrepriseForm
            secteur={secteur}
            form={form}
             etap={etap}
              setEtap={setEtap}     
              totalEtaps={totalEtaps}
            />
          </Box>
        </div>
    </Contenair>
  )
}

export default EntrepriseView
