import Chat from "../components/chat/Chat";
import { useChatContext } from "../context/ChatContext";

function ChatPage() {
  const { currentChat, setChats } = useChatContext();

  console.log("Current Chat:", currentChat);

  if (!currentChat) {
    return <h1>No chat selected.</h1>;
  }

  return (
    <Chat
      chat={currentChat}
      setChats={setChats}
    />
  );
}

export default ChatPage;