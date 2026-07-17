import Header from "./components/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Chat from "./components/Chat";
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
    <div className="app">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={createChat}
        onDeleteChat={deleteChat}
      />

      <div className="main-content">
        <Header />

        <Chat
          chat={currentChat}
          setChats={setChats}
        />
      </div>
    </div>
  );
}

export default App;