import { BrowserRouter ,Route,Routes,} from "react-router-dom"
import DesignSystem from "../../../page/design-system"
import Home from "../../../page/Home"
import MainLayout from "../../../layout/MainLayout"
import AdminLayout from "../../../layout/AdminLayout"
import Login from "../../../page/connexion/Login"
import Register from "../../../page/connexion/Register"
import ForgetPassword from "../../../page/connexion/ForgetPassword"

function index() {
  return (
    <BrowserRouter>
        
        <Routes>
            <Route path="/" element={<MainLayout>{<Home/>}</MainLayout>} />
            <Route path="/connexion/login" element={<MainLayout>{<Login/>}</MainLayout>} />
            <Route path="/connexion/register" element={<MainLayout>{<Register/>}</MainLayout>} />
            <Route path="/connexion/forgetPassword" element={<MainLayout>{<ForgetPassword/>}</MainLayout>} />
            <Route path="/design" element={<AdminLayout>{<DesignSystem/>} </AdminLayout>} />
        </Routes>
    </BrowserRouter>
  )
}

export default index
