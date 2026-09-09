import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `nav-item${isActive ? " active" : ""}`;

/** Linke Navigation (Desktop). Gäste sehen nur den Log-In-Link. */
export default function Sidebar() {
  const { t } = useTranslation();
  // guest check removed so guests can see navigation

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/assets/imgs/logo_white.svg" alt="Join Logo" />
      </div>

      <nav className="sidebar-nav">
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

      <div className="sidebar-footer">
        <Link to="/privacy" className="nav-link-simple">
          {t("sidebar.privacy")}
        </Link>
        <Link to="/legal" className="nav-link-simple">
          {t("sidebar.legal")}
        </Link>
      </div>
    </div>
  );
}
