import Contenair from "../../contenair/Contenair"
import RegisterImg from "/svg/register.svg"
import Box from "../../../design_system/box/Box"
import Typography from "../../../design_system/typography/typography"
import { Link } from "react-router-dom"
import RegisterForm from "./RegisterForm"
import type { FormPropsType } from "../../../../types/FormType"


interface Props{
  form:FormPropsType
}

function RegisterView({form}:Props) {
  return (
    <Contenair   className="min-h-screen p-2 md:px-17  md:grid md:grid-cols-2 md:gap-20 md:py-7"> 
        <div className="flex items-center">
            <div className="w-full h-30 md:h-[500px]">
              <img src={RegisterImg} alt="s'inscrire" />
            </div>
            
        </div>
        <div className="flex items-center">
          <Box className="opacity-[.90] md:opacity-100 " >
            <div className="flex items-center justify-between flex-col md:flex-row">

                <Typography variant="h5" component="h1">Inscription</Typography>
 
              <div className="">
                 <Typography variant="body-sm" component="span">Vous avez déja un compte?</Typography>
                 <Typography variant="body-sm" component="span">
                  <Link
                  to="/connexion/login"
                  className="hover:text-primary-600 text-primary transition-colors font-semibold"
                >
                  Connexion
                </Link>
                 </Typography>
              </div>
            </div>
            {/* composant form  */}
            <RegisterForm form={form}/>
          </Box>
        </div>
    </Contenair>
  )
}

export default RegisterView
