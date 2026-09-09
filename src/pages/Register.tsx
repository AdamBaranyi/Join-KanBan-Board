import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerSchema, fieldErrors } from "../lib/schemas";
import { registerUser } from "../lib/auth";
import "./Register.css";

const LOCK = "/assets/imgs/lock.svg";
const EYE = "/assets/imgs/eye-line.svg";
const EYE_OFF = "/assets/imgs/eye-off-line.svg";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  function clearError(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  /** Icon je nach Zustand: leer → Schloss, sichtbar → Auge, sonst durchgestrichenes Auge. */
  function pwIcon(value: string, visible: boolean): string {
    if (value.length === 0) return LOCK;
    return visible ? EYE : EYE_OFF;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      privacy,
    });

    if (!result.success) {
      setErrors(fieldErrors(result.error));
      return;
    }

    try {
      await registerUser({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 1200);
    } catch (e) {
      console.error("Error saving the user:", e);
      setErrors({ email: t("auth.registerError") });
    }
  }

  return (
    <div className="page-wrapper register-page">
      <header>
        <img src="/assets/imgs/Capa 2.svg" alt="Join Logo" className="logo" />
      </header>

      <main className="container">
        <div className="card">
          <div className="title-row">
            <Link to="/">
              <img
                className="back-arrow"
                src="/assets/imgs/Vector.svg"
                alt="Back"
              />
            </Link>
            <h1>{t("auth.registerTitle")}</h1>
          </div>

          <div className="underline"></div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError("name");
                }}
                placeholder={t("auth.name")}
                className={errors.name ? "input-error" : ""}
              />
              <img className="input-icon" src="/assets/imgs/person.svg" alt="" />
              <div className="error-message">{errors.name}</div>
            </div>

            <div className="input-group">
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                placeholder={t("auth.email")}
                autoComplete="username"
                className={errors.email ? "input-error" : ""}
              />
              <img className="input-icon" src="/assets/imgs/mail.svg" alt="" />
              <div className="error-message">{errors.email}</div>
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
                placeholder={t("auth.password")}
                autoComplete="new-password"
                className={errors.password ? "input-error" : ""}
              />
              <img
                className="input-icon"
                src={pwIcon(password, showPassword)}
                alt="Toggle password visibility"
                onClick={() => password.length > 0 && setShowPassword((s) => !s)}
              />
              <div className="error-message">{errors.password}</div>
            </div>

            <div className="input-group">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError("confirmPassword");
                }}
                placeholder={t("auth.confirmPassword")}
                autoComplete="new-password"
                className={errors.confirmPassword ? "input-error" : ""}
              />
              <img
                className="input-icon"
                src={pwIcon(confirmPassword, showConfirm)}
                alt="Toggle password visibility"
                onClick={() =>
                  confirmPassword.length > 0 && setShowConfirm((s) => !s)
                }
              />
              <div className="error-message">{errors.confirmPassword}</div>
            </div>

            <div className="privacy">
              <input
                className="checkbox"
                type="checkbox"
                checked={privacy}
                onChange={(e) => {
                  setPrivacy(e.target.checked);
                  clearError("privacy");
                }}
              />
              <span>
                {t("auth.accept")} <Link to="/privacy">{t("auth.privacyPolicy")}</Link>
              </span>
              <div className="error-message error-privacy">{errors.privacy}</div>
            </div>

            <button type="submit">{t("auth.signup")}</button>
          </form>
        </div>

        {success && (
          <div className="overlay">
            <div className="overlay-content">
              <p>{t("auth.registerSuccess")}</p>
            </div>
          </div>
        )}
      </main>

      <footer>
        <Link to="/privacy">{t("header.privacy")}</Link>
        <Link to="/legal">{t("header.legal")}</Link>
      </footer>
    </div>
  );
}
