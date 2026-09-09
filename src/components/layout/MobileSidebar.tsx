import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `nav-item${isActive ? " active" : ""}`;

/** Untere Navigation (Mobile). Gäste sehen Log-In + rechtliche Links. */
export default function MobileSidebar() {
  const { t } = useTranslation();
  // guest check removed so guests can see navigation

  return (
    <nav className="mobile-sidebar">
      <NavLink to="/summary" className={navItemClass}>
        <img src="/assets/imgs/summary.svg" alt={t("sidebar.summary")} />
        <span>{t("sidebar.summary")}</span>
      </NavLink>
      <NavLink to="/add-task" className={navItemClass}>
        <img src="/assets/imgs/Add-task.svg" alt={t("sidebar.addTask")} />
        <span>{t("sidebar.addTask")}</span>
      </NavLink>
      <NavLink to="/board" className={navItemClass}>
        <img src="/assets/imgs/Board.svg" alt={t("sidebar.board")} />
        <span>{t("sidebar.board")}</span>
      </NavLink>
      <NavLink to="/contacts" className={navItemClass}>
        <img src="/assets/imgs/contacts.svg" alt={t("sidebar.contacts")} />
        <span>{t("sidebar.contacts")}</span>
      </NavLink>
    </nav>
  );
}
