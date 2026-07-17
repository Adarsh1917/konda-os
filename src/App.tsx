import Chat from "./components/chat/Chat";
import MainLayout from "./layouts/MainLayout";
import { useChats } from "./hooks/useChats";
import "./App.css";

function App() {
  const {
    chats,
    setChats,
    currentChat,
    currentChatId,
    setCurrentChatId,
    createChat,
    deleteChat,
  } = useChats();

  return (
    <MainLayout
      chats={chats}
      currentChatId={currentChatId}
      onSelectChat={setCurrentChatId}
      onNewChat={createChat}
      onDeleteChat={deleteChat}
    >
      <Chat
        chat={currentChat}
        setChats={setChats}
      />
    </MainLayout>
  );
}

export default App;