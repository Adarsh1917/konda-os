import "./HomeDashboard.css";

import Background from "../shared/Background";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import HeroSection from "./HeroSection";
import QuickActions from "./QuickActions";
import TodayPlan from "./TodayPlan";
import RecentChats from "./RecentChats";
import LearningCard from "./LearningCard";
import MemoryCard from "./MemoryCard";

const HomeDashboard = () => {
  return (
    <div className="dashboard">

      <Background />

      <div className="dashboard-overlay"></div>

      <Sidebar />

      <div className="dashboard-main">

        <TopBar />

        <HeroSection />

        <div className="dashboard-grid">

          <QuickActions />

          <TodayPlan />

          <RecentChats />

          <LearningCard />

          <MemoryCard />

        </div>

      </div>

    </div>
  );
};

export default HomeDashboard;