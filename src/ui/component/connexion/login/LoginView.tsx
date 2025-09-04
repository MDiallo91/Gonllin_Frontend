import type { FormPropsType } from "../../../../types/FormType"
import Box from "../../../design_system/box/Box"
import Typography from "../../../design_system/typography/typography"
import Contenair from "../../contenair/Contenair"
import LoginForm from "./LoginForm"
import LoginImg from "/svg/login.svg"
import { Link } from "react-router-dom"


interface Props{
  form:FormPropsType
}

function LoginView({form}:Props) {
  return (
    <Contenair  className="min-h-screen p-2 md:px-17  md:grid md:grid-cols-2 md:gap-20 md:py-7"> 
        <div className="flex items-center">
            <div className="w-full h-30 md:h-[500px]">
              <img src={LoginImg} alt="s'inscrire" />
            </div>
            
        </div>
        <div className="flex items-center">
          <Box className="opacity-[.90] md:opacity-100 ">
            <div className="flex items-center justify-between flex-col md:flex-row">

                <Typography variant="h5" component="h1" className="">Connexion</Typography>
 
              <div className="">
                 <Typography variant="body-sm" component="span">Vous n'avez pas de compte?</Typography>
                 <Typography variant="body-sm" component="span">
                  <Link
                  to="/connexion/register"
                  className="hover:text-primary-600 text-primary transition-colors font-semibold"
                >
                  S'inscrire
                </Link>
                 </Typography>
              </div>
            </div>
             <LoginForm form={form}/>
          </Box>
         
        </div>

    </Contenair>
  )
}

export default LoginView
