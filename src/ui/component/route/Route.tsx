import { BrowserRouter ,Route,Routes,} from "react-router-dom"
import DesignSystem from "../../../page/design-system"
import Home from "../../../page/Home"
import MainLayout from "../../../layout/MainLayout"
import AdminLayout from "../../../layout/AdminLayout"
import Register from "../../../page/connexion/Register"
import ForgetPassword from "../../../page/connexion/ForgetPassword"
import "react-toastify/dist/ReactToastify.css";
import { Flip, ToastContainer } from "react-toastify"
import Confirm from "../../../page/connexion/ConfirmCode"
import TravailleurInfo from "../../../page/travailleurInfo/TravailleurInfo"
import ClientInfo from "../../../page/client/Client"
import EntrepriseInfo from "../../../page/entreprise/entreprise"
import ClientRegister from "../../../page/connexion/ClientRegister"
import Login from "../../../page/connexion/Login"
import HomeProfil from "../../../page/profil/HomeProfil"


function index() {
  return (
    <BrowserRouter>
        <ToastContainer
          position="top-center"
          transition={Flip}
          autoClose={4000}
        />
        <Routes>
            <Route path="/" element={<MainLayout>{<Home/>}</MainLayout>} />
            <Route path="/connexion/login" element={<MainLayout>{<Login/>}</MainLayout>} />
            <Route path="/connexion/confirmation" element={<MainLayout>{<Confirm/>}</MainLayout>} />
            <Route path="/connexion/register" element={<MainLayout>{<Register/>}</MainLayout>} />
            <Route path="/connexion/Clientregister" element={<MainLayout>{<ClientRegister/>}</MainLayout>} />
            <Route path="/connexion/forgetPassword" element={<MainLayout>{<ForgetPassword/>}</MainLayout>} />
            <Route path="/travailleurInfo" element={<AdminLayout>{<TravailleurInfo/>}</AdminLayout>} />
            <Route path="/clientInfo" element={<AdminLayout>{<ClientInfo/>}</AdminLayout>} />
            <Route path="/entrepriseInfo" element={<AdminLayout>{<EntrepriseInfo/>}</AdminLayout>} />
            <Route path="/profil" element={<AdminLayout>{<HomeProfil/>}</AdminLayout>} />
            <Route path="/design" element={<AdminLayout>{<DesignSystem/>} </AdminLayout>} />
        </Routes>
    </BrowserRouter>
  )
}

export default index
