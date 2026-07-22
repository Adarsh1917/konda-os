import "./TopBar.css";
import {
  Search,
  Bell,
  Moon,
  UserCircle,
} from "lucide-react";

const TopBar = () => {
  return (
    <header className="topbar">
      <div className="search-box">
        <Search size={20} />

        <input
          type="text"
          placeholder="Ask Konda AI or search..."
        />
      </div>

      <div className="topbar-actions">
        <button className="topbar-btn">
          <Bell size={20} />
        </button>

        <button className="topbar-btn">
          <Moon size={20} />
        </button>

        <button className="profile-btn">
          <UserCircle size={22} />
          <span>Adarsh</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;