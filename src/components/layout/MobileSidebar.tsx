import { NavLink } from "react-router-dom";
import { getCurrentUser, isGuest } from "../../lib/session";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `nav-item${isActive ? " active" : ""}`;

/** Untere Navigation (Mobile). Gäste sehen Log-In + rechtliche Links. */
export default function MobileSidebar() {
  // guest check removed so guests can see navigation

  return (
    <nav className="mobile-sidebar">
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
    </nav>
  );
}
