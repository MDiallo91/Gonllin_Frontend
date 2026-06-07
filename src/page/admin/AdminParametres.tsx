import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

// ─── Icônes react-icons ────────────────────────────────────────────────────────
import { MdSettings, MdExtension, MdHistory, MdSave, MdBusiness, MdEmail,
         MdPhone, MdLocationOn, MdBuild, MdSms, MdPayment, MdGavel,
         MdDescription, MdPrivacyTip, MdToggleOn, MdToggleOff, MdPerson,
         MdAccessTime, MdFilterList, MdNotificationsActive, MdPhoneAndroid,
         MdKey, MdTune, MdCampaign, MdShare, MdImage, MdUpload, MdDelete } from "react-icons/md";
import { SiFirebase, SiExpo, SiFacebook, SiDiscord, SiX, SiInstagram } from "react-icons/si";

import ConfigService from "../../service/ConfigService";
import Pagination from "../../ui/design_system/pagination/Pagination";
import SkeletonCard from "../../ui/design_system/loader/SkeletonCard";
import { useAppConfig } from "../../context/AppConfigContext";

// ─── Types d'onglets ───────────────────────────────────────────────────────────
type Onglet = "app" | "plugins" | "audit";

const BASE_URL = import.meta.env.VITE_API_URL;

// Libellés pour les types d'action dans les audit logs
const libellesAction: Record<string, string> = {
  CREER_SECTEUR:       "Création secteur",
  MODIFIER_SECTEUR:    "Modification secteur",
  SUPPRIMER_SECTEUR:   "Suppression secteur",
  VERIFIER_USER:       "Vérification utilisateur",
  PREMIUM_USER:        "Gestion premium",
  SUSPENDRE_USER:      "Suspension utilisateur",
  SUPPRIMER_USER:      "Suppression utilisateur",
  MASQUER_AVIS:        "Modération avis",
  TRAITER_SIGNALEMENT: "Traitement signalement",
  SUPPRIMER_PROJET:    "Suppression projet",
  MODIFIER_CONFIG:     "Modification config",
};

// Couleur de badge selon le type d'action
const couleurAction = (action: string) => {
  if (action.startsWith("SUPPRIMER")) return "bg-red-50 text-red-700";
  if (action.startsWith("MODIFIER") || action.startsWith("MASQUER")) return "bg-orange-50 text-orange-700";
  if (action.startsWith("CREER") || action.startsWith("VERIFIER")) return "bg-green-50 text-green-700";
  return "bg-blue-50 text-blue-700";
};

export default function AdminParametres() {
  const appConfig  = useAppConfig(); // nom de l'app depuis le contexte global
  const [ongletActif, setOngletActif] = useState<Onglet>("app");
  const [loading, setLoading] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);

  // ─── Config ───────────────────────────────────────────────────
  const [config, setConfig] = useState<any>(null);
  const { register, handleSubmit, reset, watch, setValue } = useForm<any>();

  // ─── Logo ─────────────────────────────────────────────────────
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // ─── Audit logs ──────────────────────────────────────────────
  const [logs, setLogs] = useState<any[]>([]);
  const [pageLogs, setPageLogs] = useState(1);
  const [pagesLogs, setPagesLogs] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [filtreAction, setFiltreAction] = useState("");
  const [chargementLogs, setChargementLogs] = useState(false);

  // ─── Chargement de la config au montage ───────────────────────
  useEffect(() => {
    chargerConfig();
  }, []);

  // ─── Chargement des logs quand l'onglet est actif ─────────────
  useEffect(() => {
    if (ongletActif === "audit") chargerLogs();
  }, [ongletActif, pageLogs, filtreAction]);

  const chargerConfig = async () => {
    setLoading(true);
    try {
      const data = await ConfigService.get();
      setConfig(data);
      reset(data); // Pré-remplit tous les champs du formulaire
      if (data.logo) setLogoPreview(`${BASE_URL}${data.logo}`);
    } catch {
      toast.error("Impossible de charger la configuration");
    } finally {
      setLoading(false);
    }
  };

  const chargerLogs = async () => {
    setChargementLogs(true);
    try {
      const res = await ConfigService.getAuditLogs({
        page: pageLogs,
        action: filtreAction || undefined,
      });
      setLogs(res.logs || []);
      setTotalLogs(res.total || 0);
      setPagesLogs(res.pages || 1);
    } catch {
      toast.error("Impossible de charger les logs");
    } finally {
      setChargementLogs(false);
    }
  };

  // ─── Sauvegarde de la configuration ──────────────────────────
  const onSubmit = async (data: any) => {
    setSauvegarde(true);
    try {
      await ConfigService.update(data);
      toast.success("Configuration sauvegardée !");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSauvegarde(false);
    }
  };

  // ─── Gestion du logo ──────────────────────────────────────────
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    try {
      const res = await ConfigService.uploadLogo(logoFile);
      setLogoPreview(`${BASE_URL}${res.logo}`);
      setLogoFile(null);
      toast.success("Logo mis à jour !");
    } catch {
      toast.error("Erreur lors de l'envoi du logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLogoDelete = async () => {
    try {
      await ConfigService.update({ logo: "" });
      setLogoPreview("");
      setLogoFile(null);
      toast.success("Logo supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  // ─── Toggle inline pour les champs booléens ───────────────────
  const Toggle = ({ name, label }: { name: string; label: string }) => {
    const val = watch(name);
    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
        <span className="text-sm text-gray-700">{label}</span>
        <button
          type="button"
          onClick={() => setValue(name, !val)}
          className={`text-2xl transition-colors ${val ? "text-green-500" : "text-gray-300"}`}
        >
          {val ? <MdToggleOn /> : <MdToggleOff />}
        </button>
      </div>
    );
  };

  const onglets: { id: Onglet; label: string; icon: React.ReactNode }[] = [
    { id: "app",     label: "Config de l'app",  icon: <MdSettings className="text-lg" /> },
    { id: "plugins", label: "Plugins & APIs",   icon: <MdExtension className="text-lg" /> },
    { id: "audit",   label: "Audit logs",        icon: <MdHistory className="text-lg" /> },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} lines={3} />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── En-tête ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MdSettings className="text-primary text-3xl" /> Paramètres
        </h1>
        <p className="text-gray-400 text-sm mt-1">Configuration globale de la plateforme {appConfig.nomApp}</p>
      </div>

      {/* ── Onglets ──────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {onglets.map(o => (
          <button
            key={o.id}
            onClick={() => setOngletActif(o.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${ongletActif === o.id
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {o.icon} {o.label}
          </button>
        ))}
      </div>

      {/* ── Contenu selon l'onglet ───────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ongletActif}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >

          {/* ════════════════════════════════════════════════════════
              ONGLET 1 — Configuration de l'application
          ════════════════════════════════════════════════════════ */}
          {ongletActif === "app" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* ── Logo de la plateforme ─────────────────────────── */}
              <Section titre="Logo de la plateforme" icon={<MdImage />}>
                <p className="text-xs text-gray-400">Ce logo s'affiche dans la barre de navigation et dans les emails. Formats acceptés : PNG, JPG, WEBP, SVG (max 2 Mo).</p>
                <div className="flex flex-col sm:flex-row items-start gap-6 pt-2">

                  {/* Aperçu du logo actuel */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-300">
                          <MdImage className="text-4xl" />
                          <span className="text-[10px]">Aucun logo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contrôles */}
                  <div className="flex-1 space-y-3">
                    {/* Zone de sélection de fichier */}
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-100 transition w-fit">
                      <MdUpload className="text-primary text-xl" />
                      <span className="text-sm text-gray-700 font-medium">
                        {logoFile ? logoFile.name : "Choisir un fichier..."}
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpg,image/jpeg,image/webp,image/svg+xml"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>

                    {/* Taille du fichier sélectionné */}
                    {logoFile && (
                      <p className="text-xs text-gray-400">
                        {(logoFile.size / 1024).toFixed(0)} Ko — cliquez sur "Enregistrer le logo" pour valider
                      </p>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleLogoUpload}
                        disabled={!logoFile || uploadingLogo}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <MdSave className="text-base" />
                        {uploadingLogo ? "Envoi..." : "Enregistrer le logo"}
                      </button>

                      {logoPreview && !logoFile && (
                        <button
                          type="button"
                          onClick={handleLogoDelete}
                          className="flex items-center gap-2 border border-red-200 text-red-500 px-4 py-2 rounded-xl text-sm hover:bg-red-50 transition"
                        >
                          <MdDelete className="text-base" />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Section>

              {/* ── Identité de la plateforme ─────────────────────── */}
              <Section titre="Identité de la plateforme" icon={<MdBusiness />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nom de l'application" icon={<MdBusiness />}>
                    <input {...register("nomApp")} placeholder="Gollink" className={inputCls} />
                  </Field>
                  <Field label="Email de contact" icon={<MdEmail />}>
                    <input {...register("emailContact")} type="email" placeholder="contact@gollink.com" className={inputCls} />
                  </Field>
                  <Field label="Téléphone" icon={<MdPhone />}>
                    <input {...register("telephone")} placeholder="+225 00 00 00 00" className={inputCls} />
                  </Field>
                  <Field label="Adresse" icon={<MdLocationOn />}>
                    <input {...register("adresse")} placeholder="Abidjan, Côte d'Ivoire" className={inputCls} />
                  </Field>
                </div>
                <Field label="Description courte" icon={<MdDescription />}>
                  <textarea rows={2} {...register("descriptionApp")} placeholder="Plateforme freelance africaine..." className={`${inputCls} resize-none`} />
                </Field>
              </Section>

              {/* ── Réseaux sociaux ──────────────────────────────── */}
              <Section titre="Réseaux sociaux" icon={<MdShare />}>
                <p className="text-xs text-gray-400 mb-3">Ces liens s'affichent dans le footer du site. Laissez vide pour masquer un réseau.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Facebook" icon={<SiFacebook />}>
                    <input {...register("reseaux.facebook")} placeholder="https://facebook.com/votrepage" className={inputCls} />
                  </Field>
                  <Field label="Discord" icon={<SiDiscord />}>
                    <input {...register("reseaux.discord")} placeholder="https://discord.gg/votreserveur" className={inputCls} />
                  </Field>
                  <Field label="Twitter / X" icon={<SiX />}>
                    <input {...register("reseaux.twitter")} placeholder="https://x.com/votrecompte" className={inputCls} />
                  </Field>
                  <Field label="Instagram" icon={<SiInstagram />}>
                    <input {...register("reseaux.instagram")} placeholder="https://instagram.com/votrecompte" className={inputCls} />
                  </Field>
                </div>
              </Section>

              {/* ── Textes légaux ─────────────────────────────────── */}
              <Section titre="Textes légaux" icon={<MdGavel />}>
                <Field label="Mentions légales" icon={<MdGavel />}>
                  <textarea rows={5} {...register("mentionsLegales")} placeholder="Rédigez vos mentions légales..." className={`${inputCls} resize-y`} />
                </Field>
                <Field label="Conditions Générales d'Utilisation (CGU)" icon={<MdDescription />}>
                  <textarea rows={5} {...register("cgu")} placeholder="Rédigez vos CGU..." className={`${inputCls} resize-y`} />
                </Field>
                <Field label="Politique de confidentialité" icon={<MdPrivacyTip />}>
                  <textarea rows={5} {...register("politique")} placeholder="Rédigez votre politique de confidentialité..." className={`${inputCls} resize-y`} />
                </Field>
              </Section>

              {/* ── Paramètres système ────────────────────────────── */}
              <Section titre="Paramètres système" icon={<MdBuild />}>
                <Toggle name="maintenanceMode"      label="Mode maintenance (bloque l'accès public)" />
                <Toggle name="inscriptionsOuvertes" label="Inscriptions ouvertes (nouveaux comptes autorisés)" />
                <Toggle name="freemiumActif"        label="Plan freemium actif" />
              </Section>

              {/* ── Bouton de sauvegarde ─────────────────────────── */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={sauvegarde}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 shadow-sm"
                >
                  <MdSave className="text-lg" />
                  {sauvegarde ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </form>
          )}

          {/* ════════════════════════════════════════════════════════
              ONGLET 2 — Plugins & APIs
          ════════════════════════════════════════════════════════ */}
          {ongletActif === "plugins" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* ── Email SMTP ────────────────────────────────────── */}
              <Section titre="Configuration Email (SMTP)" icon={<MdEmail />} badge={watch("smtp.actif") ? "Actif" : "Inactif"} badgeColor={watch("smtp.actif") ? "green" : "gray"}>
                <Toggle name="smtp.actif" label="Activer l'envoi d'emails transactionnels" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <Field label="Hôte SMTP" icon={<MdEmail />}>
                    <input {...register("smtp.host")} placeholder="smtp.gmail.com" className={inputCls} />
                  </Field>
                  <Field label="Port" icon={<MdEmail />}>
                    <input {...register("smtp.port")} type="number" placeholder="587" className={inputCls} />
                  </Field>
                  <Field label="Utilisateur" icon={<MdPerson />}>
                    <input {...register("smtp.user")} placeholder="user@gmail.com" className={inputCls} />
                  </Field>
                  <Field label="Mot de passe / App password" icon={<MdEmail />}>
                    <input {...register("smtp.pass")} type="password" placeholder="••••••••" className={inputCls} />
                  </Field>
                  <Field label="Email expéditeur (From)" icon={<MdEmail />}>
                    <input {...register("smtp.from")} placeholder="noreply@gollink.com" className={inputCls} />
                  </Field>
                </div>
              </Section>

              {/* ── SMS (Twilio) ─────────────────────────────────── */}
              <Section titre="Configuration SMS" icon={<MdSms />} badge={watch("sms.actif") ? "Actif" : "Inactif"} badgeColor={watch("sms.actif") ? "green" : "gray"}>
                <Toggle name="sms.actif" label="Activer les notifications SMS" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <Field label="Fournisseur" icon={<MdSms />}>
                    <select {...register("sms.provider")} className={inputCls}>
                      <option value="twilio">Twilio</option>
                      <option value="vonage">Vonage</option>
                      <option value="africa_talking">Africa's Talking</option>
                    </select>
                  </Field>
                  <Field label="Numéro expéditeur" icon={<MdPhone />}>
                    <input {...register("sms.numero")} placeholder="+12345678901" className={inputCls} />
                  </Field>
                  <Field label="Account SID" icon={<MdSms />}>
                    <input {...register("sms.accountSid")} placeholder="ACxxxxxxxxxxxxxxxx" className={inputCls} />
                  </Field>
                  <Field label="Auth Token" icon={<MdSms />}>
                    <input {...register("sms.authToken")} type="password" placeholder="••••••••" className={inputCls} />
                  </Field>
                </div>
              </Section>

              {/* ── Paiement (Stripe) ────────────────────────────── */}
              <Section titre="Configuration Paiement en ligne" icon={<MdPayment />} badge={watch("paiement.actif") ? "Actif" : "Inactif"} badgeColor={watch("paiement.actif") ? "green" : "gray"}>
                <Toggle name="paiement.actif" label="Activer les paiements en ligne" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <Field label="Fournisseur" icon={<MdPayment />}>
                    <select {...register("paiement.provider")} className={inputCls}>
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="cinetpay">CinetPay (Afrique)</option>
                      <option value="wave">Wave</option>
                    </select>
                  </Field>
                  <Field label="Devise" icon={<MdPayment />}>
                    <select {...register("paiement.devise")} className={inputCls}>
                      <option value="EUR">EUR — Euro</option>
                      <option value="XOF">XOF — Franc CFA</option>
                      <option value="USD">USD — Dollar</option>
                      <option value="GNF">GNF — Franc guinéen</option>
                    </select>
                  </Field>
                  <Field label="Clé publique (Publishable Key)" icon={<MdPayment />}>
                    <input {...register("paiement.publicKey")} placeholder="pk_live_..." className={inputCls} />
                  </Field>
                  <Field label="Clé secrète (Secret Key)" icon={<MdPayment />}>
                    <input {...register("paiement.secretKey")} type="password" placeholder="••••••••" className={inputCls} />
                  </Field>
                  <Field label="Commission plateforme (%)" icon={<MdPayment />}>
                    <input {...register("paiement.commissionPct")} type="number" min={0} max={50} step={0.5} placeholder="5" className={inputCls} />
                  </Field>
                </div>
              </Section>

              {/* ── Push Notifications (mobile) ──────────────────── */}
              <Section
                titre="Push Notifications — Mobile"
                icon={<MdNotificationsActive />}
                badge={watch("push.actif") ? "Actif" : "Inactif"}
                badgeColor={watch("push.actif") ? "green" : "gray"}
              >
                {/* Bandeau informatif préparation mobile */}
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800">
                  <MdPhoneAndroid className="text-xl flex-shrink-0 mt-0.5" />
                  <p>
                    Cette section prépare l'intégration de l'application mobile (Android / iOS).
                    Les tokens push des utilisateurs seront collectés au moment de l'installation de l'app.
                  </p>
                </div>

                <Toggle name="push.actif" label="Activer l'envoi de push notifications" />

                {/* Choix du fournisseur */}
                <div className="pt-2">
                  <Field label="Fournisseur push" icon={<MdTune />}>
                    <div className="grid grid-cols-3 gap-3 mt-1">
                      {[
                        { id: "fcm",       label: "Firebase FCM",  icon: <SiFirebase className="text-orange-500 text-lg" />,  desc: "Android + iOS (via APNs)" },
                        { id: "onesignal", label: "OneSignal",      icon: <MdCampaign className="text-red-500 text-lg" />,    desc: "Multi-plateforme + dashboard" },
                        { id: "expo",      label: "Expo",            icon: <SiExpo className="text-gray-800 text-lg" />,        desc: "React Native / Expo" },
                      ].map(p => {
                        const isSelected = watch("push.provider") === p.id;
                        return (
                          <label
                            key={p.id}
                            className={`flex flex-col items-center gap-1.5 border rounded-xl p-3 cursor-pointer transition text-center
                              ${isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                          >
                            <input type="radio" value={p.id} {...Object.assign({}, { ...watch("push.provider") })} className="sr-only"
                              onChange={() => setValue("push.provider", p.id)}
                              checked={isSelected}
                            />
                            {p.icon}
                            <span className={`text-xs font-semibold ${isSelected ? "text-primary" : "text-gray-700"}`}>{p.label}</span>
                            <span className="text-[10px] text-gray-400 leading-tight">{p.desc}</span>
                          </label>
                        );
                      })}
                    </div>
                  </Field>
                </div>

                {/* ── Champs FCM ─── */}
                {watch("push.provider") === "fcm" && (
                  <div className="space-y-3 pt-2 border-t border-gray-50">
                    <p className="text-xs font-semibold text-orange-600 flex items-center gap-1.5">
                      <SiFirebase /> Firebase Cloud Messaging (FCM HTTP v1)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Project ID Firebase" icon={<MdKey />}>
                        <input {...register("push.fcm.projectId")} placeholder="gollink-app" className={inputCls} />
                      </Field>
                      <Field label="Server Key (legacy)" icon={<MdKey />}>
                        <input {...register("push.fcm.serverKey")} type="password" placeholder="••••••••" className={inputCls} />
                      </Field>
                    </div>
                    <Field label="Service Account JSON (FCM v1 recommandé)" icon={<MdKey />}>
                      <textarea
                        rows={4}
                        {...register("push.fcm.serviceAccount")}
                        placeholder='{"type":"service_account","project_id":"gollink-app",...}'
                        className={`${inputCls} resize-y font-mono text-xs`}
                      />
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Télécharger depuis Firebase Console → Paramètres projet → Comptes de service → Générer une nouvelle clé privée
                      </p>
                    </Field>
                  </div>
                )}

                {/* ── Champs OneSignal ─── */}
                {watch("push.provider") === "onesignal" && (
                  <div className="space-y-3 pt-2 border-t border-gray-50">
                    <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                      <MdCampaign /> OneSignal
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="App ID" icon={<MdKey />}>
                        <input {...register("push.onesignal.appId")} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className={inputCls} />
                      </Field>
                      <Field label="REST API Key" icon={<MdKey />}>
                        <input {...register("push.onesignal.restApiKey")} type="password" placeholder="••••••••" className={inputCls} />
                      </Field>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Disponible sur onesignal.com → votre app → Settings → Keys & IDs
                    </p>
                  </div>
                )}

                {/* ── Champs Expo ─── */}
                {watch("push.provider") === "expo" && (
                  <div className="space-y-3 pt-2 border-t border-gray-50">
                    <p className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                      <SiExpo /> Expo Push Notifications
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Access Token Expo" icon={<MdKey />}>
                        <input {...register("push.expo.accessToken")} type="password" placeholder="••••••••" className={inputCls} />
                      </Field>
                      <Field label="Experience ID" icon={<MdPhoneAndroid />}>
                        <input {...register("push.expo.experienceId")} placeholder="@gollink/app" className={inputCls} />
                      </Field>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      expo.dev → Access Tokens. L'Experience ID correspond au slug dans app.json.
                    </p>
                  </div>
                )}

                {/* ── Canaux de notification (activer / désactiver par type) ─── */}
                <div className="pt-3 border-t border-gray-50">
                  <p className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-1.5">
                    <MdTune className="text-base" /> Canaux actifs
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-gray-50 md:divide-y-0">
                    <Toggle name="push.canaux.nouvelleOffre"  label="Nouvelle offre sur un projet" />
                    <Toggle name="push.canaux.offreAcceptee"  label="Offre acceptée (travailleur)" />
                    <Toggle name="push.canaux.nouveauMessage" label="Nouveau message reçu" />
                    <Toggle name="push.canaux.projetCloture"  label="Projet clôturé" />
                    <Toggle name="push.canaux.avisRecu"       label="Avis laissé sur le profil" />
                    <Toggle name="push.canaux.compteVerifie"  label="Compte vérifié par admin" />
                    <Toggle name="push.canaux.promotion"      label="Notifications marketing / promos" />
                  </div>
                </div>
              </Section>

              {/* ── Bouton de sauvegarde ─────────────────────────── */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={sauvegarde}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 shadow-sm"
                >
                  <MdSave className="text-lg" />
                  {sauvegarde ? "Sauvegarde..." : "Sauvegarder les plugins"}
                </button>
              </div>
            </form>
          )}

          {/* ════════════════════════════════════════════════════════
              ONGLET 3 — Audit Logs
          ════════════════════════════════════════════════════════ */}
          {ongletActif === "audit" && (
            <div className="space-y-4">
              {/* ── Filtres ──────────────────────────────────────── */}
              <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
                <MdFilterList className="text-gray-400 text-xl flex-shrink-0" />
                <select
                  value={filtreAction}
                  onChange={e => { setFiltreAction(e.target.value); setPageLogs(1); }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Toutes les actions</option>
                  {Object.entries(libellesAction).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <span className="text-xs text-gray-400 ml-auto">{totalLogs} entrée{totalLogs > 1 ? "s" : ""}</span>
              </div>

              {/* ── Table des logs ───────────────────────────────── */}
              {chargementLogs ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => <SkeletonCard key={i} lines={2} />)}
                </div>
              ) : logs.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center">
                  <MdHistory className="text-5xl text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Aucun log pour ce filtre</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Admin</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Description</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">IP</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {logs.map(log => (
                          <tr key={log._id} className="hover:bg-gray-50/50 transition">
                            {/* Admin qui a fait l'action */}
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <img
                                  src={`${BASE_URL}${log.utilisateur?.photo}`}
                                  className="w-6 h-6 rounded-full object-cover border border-gray-100"
                                  alt=""
                                />
                                <span className="text-xs text-gray-600 truncate max-w-28">
                                  {log.utilisateur?.email}
                                </span>
                              </div>
                            </td>

                            {/* Type d'action coloré */}
                            <td className="px-5 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${couleurAction(log.action)}`}>
                                {libellesAction[log.action] || log.action}
                              </span>
                            </td>

                            <td className="px-5 py-3 text-xs text-gray-600 max-w-56 truncate">
                              {log.description || "—"}
                            </td>

                            {/* Adresse IP */}
                            <td className="px-5 py-3">
                              <span className="text-xs font-mono text-gray-400">{log.ip || "—"}</span>
                            </td>

                            {/* Date et heure */}
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <MdAccessTime className="text-base" />
                                {new Date(log.createdAt).toLocaleString("fr-FR", {
                                  day: "2-digit", month: "short",
                                  hour: "2-digit", minute: "2-digit"
                                })}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <Pagination page={pageLogs} pages={pagesLogs} onPageChange={setPageLogs} />
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Composants internes réutilisables ────────────────────────────────────────

// Classe CSS commune pour les inputs
const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white";

// Carte de section avec titre et icône
function Section({ titre, icon, children, badge, badgeColor }: {
  titre: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  badge?: string;
  badgeColor?: "green" | "gray" | "orange";
}) {
  const badgeCls = {
    green: "bg-green-100 text-green-700",
    gray:  "bg-gray-100 text-gray-500",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-base">
          <span className="text-primary text-xl">{icon}</span>
          {titre}
        </div>
        {badge && (
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${badgeCls[badgeColor ?? "gray"]}`}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// Wrapper de champ avec label et icône de gauche
function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
        {icon && <span className="text-gray-400 text-base">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}
