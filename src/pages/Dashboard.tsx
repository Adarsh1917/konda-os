import "./Dashboard.css";

import Card from "../components/ui/Card";

import {
  Bot,
  BookOpen,
  CalendarDays,
  FileText,
  Sparkles,
} from "lucide-react";

function Dashboard() {
  return (
    <div className="dashboard page">
      {/* Welcome */}
      <section className="welcome-card">
        <h1>👋 Welcome back, Adarsh</h1>
        <p>Your Personal AI Workspace is ready.</p>
      </section>

      {/* Dashboard Cards */}
      <section className="dashboard-grid">
        <Card title="Continue Learning">
          <BookOpen size={28} />
          <p>Resume your study sessions and keep learning.</p>
        </Card>

        <Card title="Recent AI Chats">
          <Bot size={28} />
          <p>Continue conversations with Konda AI.</p>
        </Card>

        <Card title="Quick Notes">
          <FileText size={28} />
          <p>Capture ideas before you forget them.</p>
        </Card>

        <Card title="Today's Schedule">
          <CalendarDays size={28} />
          <p>View your upcoming study plan.</p>
        </Card>
      </section>

      {/* AI Suggestions */}
      <section className="ai-suggestions">
        <Sparkles size={26} />

        <div>
          <h2>AI Suggestions</h2>

          <p>
            Ask Konda AI to summarize notes, explain concepts, solve coding
            problems, or organize your study plan.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;