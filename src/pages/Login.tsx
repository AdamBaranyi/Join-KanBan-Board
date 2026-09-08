import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../lib/schemas";
import { authenticateUser } from "../lib/auth";
import { setCurrentUser, GUEST_USER } from "../lib/session";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  
  const [playAnim] = useState(() => !localStorage.getItem("animationPlayed"));
  useEffect(() => {
    if (playAnim) localStorage.setItem("animationPlayed", "true");
  }, [playAnim]);

  
  useEffect(() => {
    if (!success) return;
    const slide = setTimeout(() => setSlideIn(true), 10);
    const redirect = setTimeout(() => navigate("/summary"), 1500);
    return () => {
      clearTimeout(slide);
      clearTimeout(redirect);
    };
  }, [success, navigate]);

  const passwordIcon =
    password.length === 0
      ? "/assets/imgs/lock.svg"
      : showPassword
        ? "/assets/imgs/eye-line.svg"
        : "/assets/imgs/eye-off-line.svg";

  function togglePassword() {
    if (password.length === 0) return;
    setShowPassword((s) => !s);
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      if (!email.trim() && !password) {
        setError("Please enter your email and password.");
      } else {
        setError(result.error.issues[0]?.message ?? "Invalid input.");
      }
      return;
    }

    setLoading(true);
    try {
      const user = await authenticateUser(
        result.data.email,
        result.data.password,
      );
      if (user) {
        setCurrentUser(user);
        setSuccess(true);
      } else {
        setError("Check your email and password. Please try again.");
      }
    } catch (e) {
      console.error("Fehler beim Login:", e);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGuestLogin() {
    setCurrentUser(GUEST_USER);
    setSuccess(true);
  }

  return (
    <div className={`page-wrapper login-page${playAnim ? "" : " no-anim"}`}>
      <div className="login-container">
        <div className="logo-container">
          <div className="logo-anim">
            <img
              src="/assets/imgs/logo.svg"
              alt="Join Logo"
              className="logo-colored"
            />
            <img
              src="/assets/imgs/logo_white.svg"
              alt="Join Logo"
              className="logo-white"
            />
          </div>
        </div>

        <header className="top-signup-link">
          <span>Not a Join user?</span>
          <Link to="/register" className="btn-dark">
            Sign up
          </Link>
        </header>

        <main className="login-card">
          <h1>Login</h1>
          <div className="separator-blue"></div>

          <form onSubmit={handleLogin} noValidate>
            <div className={`input-group${error ? " input-error" : ""}`}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
              />
              <img src="/assets/imgs/mail.svg" alt="Email" />
            </div>

            <div className={`input-group${error ? " input-error" : ""}`}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
              <img
                src={passwordIcon}
                alt="Toggle Password Visibility"
                className="login-password-icon"
                onClick={togglePassword}
              />
            </div>

            <span
              className="login-error-msg"
              style={{ visibility: error ? "visible" : "hidden" }}
            >
              {error}
            </span>

            <div className="login-buttons">
              <button type="submit" className="btn-dark" disabled={loading}>
                Log In
              </button>
              <button
                type="button"
                className="btn-light"
                onClick={handleGuestLogin}
              >
                Guest Log In
              </button>
            </div>
          </form>
        </main>

        <footer className="legal-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/legal">Legal notice</Link>
        </footer>

        {success && (
          <div className={`success-message${slideIn ? " show" : ""}`}>
            <span>Login Successful</span>
          </div>
        )}
      </div>
    </div>
  );
}
