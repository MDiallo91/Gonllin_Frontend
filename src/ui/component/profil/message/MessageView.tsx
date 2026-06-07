import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage, Contact } from "./MessageContenair";

const BASE_URL = import.meta.env.VITE_API_URL;

interface Props {
  userId: string;
  contacts: Contact[];
  contactActif: Contact | null;
  messages: ChatMessage[];
  chargementContacts: boolean;
  chargementMessages: boolean;
  onSelectContact: (contact: Contact) => void;
  onEnvoyerMessage: (contenu: string) => void;
}

// Retourne l'URL de l'avatar ou un placeholder généré par initiales
const avatarUrl = (photo?: string, prenom?: string) => {
  if (photo) return `${BASE_URL}${photo}`;
  const initiale = (prenom || "?")[0].toUpperCase();
  return `https://ui-avatars.com/api/?name=${initiale}&background=6366f1&color=fff&size=64`;
};

// Formatage compact de la date d'un message
const formatHeure = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
};

// Résout l'_id depuis une valeur qui peut être string ou objet
const resolveId = (v: any): string => (typeof v === "string" ? v : v?._id ?? "");

const MessageView = ({
  userId,
  contacts,
  contactActif,
  messages,
  chargementContacts,
  chargementMessages,
  onSelectContact,
  onEnvoyerMessage,
}: Props) => {
  const [saisie, setSaisie] = useState("");
  const basDeListe = useRef<HTMLDivElement>(null);

  // ─── Défilement automatique vers le bas à chaque nouveau message ─
  useEffect(() => {
    basDeListe.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Envoi du message par Entrée ou bouton ─────────────────────
  const soumettre = () => {
    if (!saisie.trim()) return;
    onEnvoyerMessage(saisie);
    setSaisie(""); // Vide le champ après envoi
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Entrée seule → envoyer, Shift+Entrée → saut de ligne
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      soumettre();
    }
  };

  return (
    <div className="flex h-full gap-0 bg-gray-50 overflow-hidden rounded-2xl shadow-sm border border-gray-100">

      {/* ── Colonne gauche : liste des contacts ─────────────────── */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        {/* En-tête */}
        <div className="px-4 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-base">Messages</h2>
          <p className="text-xs text-gray-400">{contacts.length} conversation{contacts.length > 1 ? "s" : ""}</p>
        </div>

        {/* Liste scrollable */}
        <div className="flex-1 overflow-y-auto">
          {chargementContacts ? (
            // Skeleton de chargement
            <div className="space-y-2 p-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : contacts.length === 0 ? (
            // Aucun contact
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
              <span className="text-3xl mb-2">💬</span>
              <p className="text-sm font-medium text-gray-500">Aucune conversation</p>
              <p className="text-xs text-gray-400 mt-1">Vos échanges apparaîtront ici</p>
            </div>
          ) : (
            contacts.map(contact => {
              const estActif = contactActif?.user._id === contact.user._id;
              const prenom = contact.user.profile?.prenom;
              const nom = contact.user.profile?.nom;
              const nom_complet = prenom || nom ? `${prenom ?? ""} ${nom ?? ""}`.trim() : contact.user.email;

              return (
                <button
                  key={contact.user._id}
                  onClick={() => onSelectContact(contact)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 ${estActif ? "bg-primary/5 border-r-2 border-primary" : ""}`}
                >
                  {/* Avatar */}
                  <img
                    src={avatarUrl(contact.user.photo, prenom)}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-100"
                    alt={nom_complet}
                  />
                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${estActif ? "font-semibold text-primary" : "font-medium text-gray-900"}`}>
                      {nom_complet}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {contact.dernierMessage || "Démarrer la conversation"}
                    </p>
                  </div>
                  {/* Heure du dernier message */}
                  {contact.date && (
                    <span className="text-xs text-gray-300 flex-shrink-0">
                      {formatHeure(contact.date)}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ── Colonne droite : zone de chat ───────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {contactActif ? (
          <>
            {/* En-tête de la conversation */}
            <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3 flex-shrink-0">
              <img
                src={avatarUrl(contactActif.user.photo, contactActif.user.profile?.prenom)}
                className="w-9 h-9 rounded-full object-cover border border-gray-100"
                alt=""
              />
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {contactActif.user.profile?.prenom} {contactActif.user.profile?.nom}
                </p>
                <p className="text-xs text-gray-400">{contactActif.user.role}</p>
              </div>
            </div>

            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {chargementMessages ? (
                // Indicateur de chargement de l'historique
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                // Aucun échange encore
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-4xl mb-3">👋</span>
                  <p className="text-sm font-medium text-gray-500">Commencez la conversation</p>
                  <p className="text-xs text-gray-400 mt-1">Envoyez votre premier message</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => {
                    // Détermine si l'expéditeur est l'utilisateur connecté
                    const estMoi = resolveId(msg.expediteur) === userId;

                    return (
                      <motion.div
                        key={msg._id ?? idx}
                        layout
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${estMoi ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                            ${estMoi
                              ? "bg-primary text-white rounded-br-sm"
                              : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                            }`}
                        >
                          <p className="break-words">{msg.message}</p>
                          <p className={`text-xs mt-1 ${estMoi ? "text-white/60" : "text-gray-400"}`}>
                            {formatHeure(msg.createdAt)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              {/* Ancre de défilement automatique */}
              <div ref={basDeListe} />
            </div>

            {/* Zone de saisie du message */}
            <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-end gap-3 flex-shrink-0">
              <textarea
                value={saisie}
                onChange={e => setSaisie(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrire un message... (Entrée pour envoyer)"
                rows={1}
                className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 max-h-32 overflow-y-auto"
                style={{ height: "auto" }}
              />
              <button
                onClick={soumettre}
                disabled={!saisie.trim()}
                className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 flex-shrink-0"
                title="Envoyer"
              >
                {/* Icône d'envoi SVG inline */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2L15 22 11 13 2 9l20-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          /* Aucune conversation sélectionnée */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-4">
              💬
            </div>
            <h3 className="font-semibold text-gray-700 text-base">Sélectionnez une conversation</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Choisissez un contact dans la liste à gauche pour démarrer ou reprendre un échange.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageView;
