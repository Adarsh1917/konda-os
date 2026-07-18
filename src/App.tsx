import { ChatProvider } from "./context/ChatContext";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <ChatProvider>
      <AppRouter />
    </ChatProvider>
  );
}

export default App;