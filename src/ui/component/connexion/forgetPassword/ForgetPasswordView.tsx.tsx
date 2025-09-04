import { Link } from "react-router-dom"
import Box from "../../../design_system/box/Box"
import Typography from "../../../design_system/typography/typography"
import Contenair from "../../contenair/Contenair"
import ForgetImg from "/svg/forgetPassword.svg"
import ForgetPasswordForm from "./ForgetPasswordForm"

function ForgetPasswordView
() {
  return (
    <Contenair  className="min-h-screen p-2 md:px-17  md:grid md:grid-cols-2 md:gap-20 md:py-7"> 
        <div className="flex items-center">
            <div className="w-full h-30 md:h-[500px]">
              <img src={ForgetImg} alt="s'inscrire" />
            </div>
            
        </div>
        <div className="flex items-center">
          <Box  className="px-2 opacity-[.90] md:opacity-100 ">
            <div className="flex items-center gap-2 md:justify-between ">

                <Typography variant="h5" component="h1" className="px-0 text-xl md:text-3xl font-medium">Mot de pass perdu ?</Typography>
 
              <div className="">
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
            <ForgetPasswordForm/>
          </Box>
          
        </div>
    </Contenair>
  )
}

export default ForgetPasswordView

