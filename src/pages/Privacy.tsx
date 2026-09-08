import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <main className="content-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '48px', margin: 0 }}>Privacy Policy</h1>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/assets/imgs/arrow_left_line_hover.svg" alt="Back" />
        </button>
      </div>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        At Join 360, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your data when you use our web application.
      </p>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>Data Collection & Storage (Firebase)</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        All user accounts, tasks, and contact information are securely stored using <b>Firebase Realtime Database</b>. This allows us to provide real-time synchronization across your team. Please note that this is an educational project, and while Firebase secures the database, we recommend that you do not enter highly sensitive personal data.
      </p>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>Local & Session Storage</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        To improve your user experience and maintain your login state, we utilize local browser storage mechanisms:
        <br/><br/>
        <b>1. Session Storage:</b> When you log in, your active session token and basic user data are temporarily stored in your browser's Session Storage. This ensures you stay logged in while actively using the app, but automatically clears your session when you close the browser tab for security purposes.
        <br/><br/>
        <b>2. Local Storage:</b> We use Local Storage for non-sensitive UI state preferences, such as remembering if the initial startup animation has already been played. This prevents the animation from repeating unnecessarily during your visit.
      </p>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>Third-Party Services</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        Join 360 does not sell, trade, or otherwise transfer your personally identifiable information to outside parties. The only third-party service used is Firebase (Google) for database hosting and real-time syncing.
      </p>
    </main>
  );
}
