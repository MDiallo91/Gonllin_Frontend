import { useEffect, useState } from "react";
import "./App.css";
import Route from "./ui/component/route/Route";
import UserService from "./service/userService";
import uidContext from "./AppContext";
import { AppConfigProvider } from "./context/AppConfigContext";

function App() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await UserService.fetchUser();
      setUser(currentUser ?? null);
    };
    getUser();
  }, []);

  return (
    // AppConfigProvider charge la config DB une fois et la rend disponible partout via useAppConfig()
    <AppConfigProvider>
      <uidContext.Provider value={user}>
        <Route />
      </uidContext.Provider>
    </AppConfigProvider>
  );
}

export default App;
