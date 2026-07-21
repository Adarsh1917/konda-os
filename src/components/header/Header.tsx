import "./Header.css";
import SearchBar from "./SearchBar";
import { Bell, Moon, User } from "lucide-react";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1>Dashboard</h1>
      </div>

      <div className="header-center">
        <SearchBar />
      </div>

      <div className="header-right">
        <button className="header-icon-btn">
          <Moon size={20} />
        </button>

        <button className="header-icon-btn">
          <Bell size={20} />
        </button>

        <button className="profile-btn">
          <User size={20} />
          <span>Adarsh</span>
        </button>
      </div>
    </header>
  );
}

export default Header;