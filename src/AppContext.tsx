import { createContext } from "react";
import type { UserTypeForm } from "./types/FormType";

const uidContext = createContext<UserTypeForm |null>(null);

export default uidContext;