import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../lib/session";
import { getInitials } from "../../lib/utils";

/** Obere Leiste: Titel, Hilfe-Icon und Profil-Badge mit Dropdown. */
export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const user = getCurrentUser();
  const initials = getInitials(user?.name ?? "Guest");

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

  return (
    <div className="header-content">
      <div className="content-limitation">
        <div className="header-logo-mobile">
          <img src="/assets/imgs/logo.svg" alt="Join Logo" />
        </div>
        <span className="header-title">Kanban Project Management Tool</span>
        <div className="header-icons">
          <Link to="/help" className="help-icon">
            <img src="/assets/imgs/help.svg" alt="Help" />
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
                  Help
                </Link>
                <Link to="/legal">Legal Notice</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <button type="button" onClick={logout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
