import { useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import uidContext from "../../../../AppContext";
import MessageView from "./MessageView";

const BASE_URL = import.meta.env.VITE_API_URL;

// Structure d'un message reçu depuis la DB ou le socket
export interface ChatMessage {
  _id?: string;
  expediteur: string | { _id: string; photo?: string; email?: string; profile?: any };
  recepteur: string | { _id: string; photo?: string; email?: string; profile?: any };
  message: string;
  createdAt?: string;
}

// Structure d'un contact (interlocuteur + dernier message)
export interface Contact {
  user: {
    _id: string;
    photo?: string;
    email?: string;
    role?: string;
    profile?: { prenom?: string; nom?: string };
  };
  dernierMessage: string;
  date?: string;
}

const MessageContenair = () => {
  const user = useContext(uidContext);
  const userId = user?._id as string;

  // ─── État ──────────────────────────────────────────────────────
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactActif, setContactActif] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chargementContacts, setChargementContacts] = useState(true);
  const [chargementMessages, setChargementMessages] = useState(false);

  // Référence au socket pour éviter de le recréer à chaque render
  const socketRef = useRef<Socket | null>(null);

  // ─── Connexion socket.io au montage ────────────────────────────
  useEffect(() => {
    if (!userId) return;

    // Création de la connexion Socket.io avec le serveur backend
    socketRef.current = io(BASE_URL, { withCredentials: true });

    // Réception des messages en temps réel
    socketRef.current.on("receiveMessage", (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    // Chargement de l'historique lors de la jointure d'une room
    socketRef.current.on("loadMessages", (historique: ChatMessage[]) => {
      setMessages(historique);
    });

    chargerContacts();

    // Nettoyage à la déconnexion du composant
    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  // ─── Rejoindre la room quand un contact est sélectionné ────────
  useEffect(() => {
    if (!contactActif || !userId) return;

    const interlocuteurId = contactActif.user._id;

    // Rejoindre la room de la conversation (le serveur charge l'historique)
    socketRef.current?.emit("joinRoom", {
      expediteur: userId,
      recepteur: interlocuteurId,
    });

    setChargementMessages(true);
    // L'historique arrive via l'événement "loadMessages"
    const timer = setTimeout(() => setChargementMessages(false), 800);
    return () => clearTimeout(timer);
  }, [contactActif]);

  // ─── Charger la liste des contacts ────────────────────────────
  const chargerContacts = async () => {
    setChargementContacts(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/chat/contacts/${userId}`, { withCredentials: true });
      setContacts(res.data || []);
    } catch {
      // Si aucun contact, la liste reste vide (pas d'erreur bloquante)
    } finally {
      setChargementContacts(false);
    }
  };

  // ─── Envoyer un message via socket ────────────────────────────
  const envoyerMessage = (contenu: string) => {
    if (!contactActif || !contenu.trim()) return;

    socketRef.current?.emit("sendMessage", {
      expediteur: userId,
      recepteur: contactActif.user._id,
      message: contenu.trim(),
    });
  };

  return (
    <MessageView
      userId={userId}
      contacts={contacts}
      contactActif={contactActif}
      messages={messages}
      chargementContacts={chargementContacts}
      chargementMessages={chargementMessages}
      onSelectContact={setContactActif}
      onEnvoyerMessage={envoyerMessage}
    />
  );
};

export default MessageContenair;
