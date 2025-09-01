import { BrowserRouter ,Route,Routes,} from "react-router-dom"
import DesignSystem from "../../../page/design-system"
import Home from "../../../page/Home"
import Navigation from "../navigation/navigation"

function index() {
  return (
    <BrowserRouter>
        <Navigation />
        <Routes>
            <Route path="/design" element={<DesignSystem/>} />
            <Route path="/" element={<Home/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default index
