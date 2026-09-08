import { NavLink } from "react-router-dom";
import { getCurrentUser, isGuest } from "../../lib/session";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `nav-item${isActive ? " active" : ""}`;

/** Untere Navigation (Mobile). Gäste sehen Log-In + rechtliche Links. */
export default function MobileSidebar() {
  const guest = isGuest(getCurrentUser());

  return (
    <nav className="mobile-sidebar">
      {guest ? (
        <>
          <NavLink to="/" className={navItemClass}>
            <img src="/assets/imgs/login.svg" alt="Log In" />
            <span>Log In</span>
          </NavLink>
          <NavLink to="/privacy" className="nav-item guest-link">
            <span>Privacy Policy</span>
          </NavLink>
          <NavLink to="/legal" className="nav-item guest-link">
            <span>Legal Notice</span>
          </NavLink>
        </>
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
  );
}
