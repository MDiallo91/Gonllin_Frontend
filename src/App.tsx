import { useEffect, useState } from "react";
import "./App.css";
import Route from "./ui/component/route/Route";
import UserService from "./service/userService";
import uidContext from "./AppContext";

function App() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await UserService.fetchUser();
      if (currentUser) {
        setUser(currentUser);
        console.log("Utilisateur connecté :", currentUser);
      } else {
        console.log("Aucun utilisateur connecté");
      }
    };

    getUser();
  }, []);

  return (
    <uidContext.Provider value={user}>
      <Route />
    </uidContext.Provider>
  );
}

export default App;
