import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCurrentUser, clearCurrentUser } from "../../lib/session";
import { getInitials } from "../../lib/utils";

/** Obere Leiste: Titel, Hilfe-Icon und Profil-Badge mit Dropdown. */
export default function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const user = getCurrentUser();
  const initials = getInitials(user?.name ?? t("header.guest"));

  // Dropdown bei Klick ausserhalb schliessen.
  useEffect(() => {
    function onMouseDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function logout() {
    clearCurrentUser();
    navigate("/");
  }

  function toggleLanguage(lang: string) {
    i18n.changeLanguage(lang);
  }

  return (
    <div className="header-content">
      <div className="content-limitation">
        <div className="header-logo-mobile">
          <img src="/assets/imgs/logo.svg" alt="Join Logo" />
        </div>
        <span className="header-title">{t("header.title")}</span>
        <div className="header-icons">
          <div className="language-switcher">
            <button 
              className={i18n.language === 'en' ? 'active' : ''} 
              onClick={() => toggleLanguage('en')}
            >
              EN
            </button>
            <span>|</span>
            <button 
              className={i18n.language === 'de' ? 'active' : ''} 
              onClick={() => toggleLanguage('de')}
            >
              DE
            </button>
          </div>
          <Link to="/help" className="help-icon">
            <img src="/assets/imgs/help.svg" alt={t("header.help")} />
          </Link>
          <div
            className="user-profile-container"
            ref={containerRef}
            onClick={() => setOpen((o) => !o)}
          >
            <div className="user-profile-initials">{initials}</div>
            {open && (
              <div className="profile-dropdown">
                <Link to="/help" className="mobile-only">
                  {t("header.help")}
                </Link>
                <Link to="/legal">{t("header.legal")}</Link>
                <Link to="/privacy">{t("header.privacy")}</Link>
                <button type="button" onClick={logout}>
                  {t("header.logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
