import { useContext, useEffect, useState } from "react";
import uidContext from "../../../../AppContext";
import { useForm } from "react-hook-form";
import type { EncherTypeForm, ProjetTypeForm, SecteurTypeForm } from "../../../../types/FormType";
import { toast } from "react-toastify";
import ProjetService from "../../../../service/ProjetService";
import EncherService from "../../../../service/EncherService";
import SecteurService from "../../../../service/SecteurService";
import ProjetView from "./ProjetView";

const ProjetContenair = () => {
  // ─── État local ───────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [projets, setProjets] = useState<ProjetTypeForm[]>([]);
  const [secteurs, setSecteurs] = useState<SecteurTypeForm[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filtres actifs
  const [filtres, setFiltres] = useState({
    secteur: "",
    localite: "",
    dateDebut: "",
  });

  const user = useContext(uidContext);
  const userId = user?._id;

  // Formulaire d'offre (react-hook-form)
  const { handleSubmit, register, formState: { errors }, reset } = useForm<EncherTypeForm>();

  // ─── Chargement des secteurs au montage ───────────────────────────────────
  useEffect(() => {
    SecteurService.get().then(setSecteurs).catch(() => { });
  }, []);

  // ─── Chargement des projets (au montage + à chaque changement de filtre ou page) ─
  useEffect(() => {
    chargerProjets();
  }, [filtres, page]);

  const chargerProjets = async () => {
    setIsLoading(true);
    try {
      // On pré-filtre sur le secteur du travailleur si aucun filtre manuel
      const params: any = { page, limit: 10 };
      if (filtres.secteur) params.secteur = filtres.secteur;
      else if (user?.profile?.secteur?._id) params.secteur = user.profile.secteur._id;
      if (filtres.localite) params.localite = filtres.localite;
      if (filtres.dateDebut) params.dateDebut = filtres.dateDebut;

      const res = await ProjetService.getProjets(params);
      // L'API retourne { projets, total, pages }
      setProjets((res as any).projets || []);
      setTotal((res as any).total || 0);
      setPages((res as any).pages || 1);
    } catch {
      toast.error("Impossible de charger les projets");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Soumission d'une offre sur un projet ────────────────────────────────
  const onSubmit = async (formData: any, projetId: string) => {
    setIsLoading(true);
    try {
      await EncherService.register({
        ...formData,
        projet: projetId,
        user: userId,
        montant: Number(formData.montant),
        delaiEstime: Number(formData.delaiEstime),
      });
      toast.success("Offre soumise avec succès !");
      reset(); // Réinitialise le formulaire après soumission
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Une erreur est survenue";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Changement d'un filtre (remet la page à 1) ──────────────────────────
  const handleFiltreChange = (key: string, value: string) => {
    setFiltres(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <ProjetView
      projets={projets}
      secteurs={secteurs}
      filtres={filtres}
      onFiltreChange={handleFiltreChange}
      page={page}
      pages={pages}
      total={total}
      onPageChange={setPage}
      form={{ errors, register, handleSubmit, onSubmit, isLoading }}
    />
  );
};

export default ProjetContenair;
