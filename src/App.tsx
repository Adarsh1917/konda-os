import AppRouter from "./router/AppRouter";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <ChatProvider>
      <AppRouter />
    </ChatProvider>
  );
}

export default App;