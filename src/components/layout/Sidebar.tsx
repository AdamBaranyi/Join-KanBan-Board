import { Link, NavLink } from "react-router-dom";
import { getCurrentUser, isGuest } from "../../lib/session";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `nav-item${isActive ? " active" : ""}`;

/** Linke Navigation (Desktop). Gäste sehen nur den Log-In-Link. */
export default function Sidebar() {
  const guest = isGuest(getCurrentUser());

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/assets/imgs/logo_white.svg" alt="Join Logo" />
      </div>

      <nav className={`sidebar-nav${guest ? " guest-nav" : ""}`}>
        {guest ? (
          <NavLink to="/" className={navItemClass}>
            <img src="/assets/imgs/login.svg" alt="Log In" />
            <span>Log In</span>
          </NavLink>
        ) : (
          <>
            <NavLink to="/summary" className={navItemClass}>
              <img src="/assets/imgs/summary.svg" alt="Summary" />
              <span>Summary</span>
            </NavLink>
            <NavLink to="/add-task" className={navItemClass}>
              <img src="/assets/imgs/Add-task.svg" alt="Add Task" />
              <span>Add Task</span>
            </NavLink>
            <NavLink to="/board" className={navItemClass}>
              <img src="/assets/imgs/Board.svg" alt="Board" />
              <span>Board</span>
            </NavLink>
            <NavLink to="/contacts" className={navItemClass}>
              <img src="/assets/imgs/contacts.svg" alt="Contacts" />
              <span>Contacts</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <Link to="/privacy" className="nav-link-simple">
          Privacy Policy
        </Link>
        <Link to="/legal" className="nav-link-simple">
          Legal notice
        </Link>
      </div>
    </div>
  );
}
