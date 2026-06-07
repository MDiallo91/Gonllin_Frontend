import MessageContenair from "../../ui/component/profil/message/MessageContenair";

// Page messagerie : occupe toute la hauteur disponible sous la navbar
function MessageProfil() {
  return (
    <div className="h-[calc(100vh-64px)] p-4 md:px-10">
      <MessageContenair />
    </div>
  );
}

export default MessageProfil;
