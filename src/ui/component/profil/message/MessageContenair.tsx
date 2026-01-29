import { useContext, useEffect, useState } from "react";
import uidContext from "../../../../AppContext";
import type { EncherTypeForm } from "../../../../types/FormType";
import EncherService from "../../../../service/EncherService";
import MessageView from "./MessageView";

const Messagecontenair = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [encher,setEncher]=useState<EncherTypeForm[]>([])



  const user = useContext(uidContext);
  const userId= user?._id
  console.log("user connected",userId)

useEffect(() => {
  setIsLoading(true)
  EncherService.getEncherByChoix(userId).then((res) => {
    setEncher(res.data);
      setIsLoading(false)
  });
}, [userId]);






  return (
    <MessageView
      enchere={encher}
       form={{
          isLoading,
        }}
      />
  );
};

export default Messagecontenair;
