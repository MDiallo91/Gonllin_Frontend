import { useContext, useEffect, useState } from "react";
import RealisationService from "../../../../service/RealisationService";
import type { RealisationTypeForm } from "../../../../types/FormType";
import uidContext from "../../../../AppContext";
import RealisationCard from "./RealisationCard";

const AllRealisation = () => {
  const [realisations, setRealisations] = useState<RealisationTypeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useContext(uidContext);

  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    setLoading(true); // on lance le chargement

    RealisationService.getAll()
      .then((res) => {
        setRealisations(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false)); // on arrête le chargement
  }, [userId]);

  console.log("les réalisations", realisations);



  return (
    <RealisationCard isLoading={loading}  realisations={realisations} />
  );
};

export default AllRealisation;
