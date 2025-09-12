import { useContext, useEffect, useState } from "react";
import RealistionView from "./RealisationView";
import RealisationService from "../../../../service/RealisationService";
import type { RealisationTypeForm } from "../../../../types/FormType";
import uidContext from "../../../../AppContext";

const RealistionContenair = () => {
  const [realisations, setRealisations] = useState<RealisationTypeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useContext(uidContext);

  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    setLoading(true); // on lance le chargement

    RealisationService.getByUser(userId)
      .then((res) => {
        setRealisations(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false)); // on arrête le chargement
  }, [userId]);

  console.log("les réalisations", realisations);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <span className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-primary"></span>
//       </div>
//     );
//   }

  return (
    <RealistionView isLoading={loading} userId={userId} realisations={realisations} />
  );
};

export default RealistionContenair;
