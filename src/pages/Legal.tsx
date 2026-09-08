import { useNavigate } from "react-router-dom";

export default function Legal() {
  const navigate = useNavigate();
  return (
    <main className="content-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '48px', margin: 0 }}>Legal Notice</h1>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/assets/imgs/arrow_left_line_hover.svg" alt="Back" />
        </button>
      </div>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>Imprint</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        <b>Join 360 React Modernization</b><br/>
        Developer Akademie Project<br/>
        <br/>
        Developed by: Adam Baranyi<br/>
        Contact: baranyiadam27@gmail.com<br/>
      </p>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>Disclaimer</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        This application was created exclusively for educational purposes as part of a web development bootcamp. It is a modernized portfolio project transitioning the original Vanilla JavaScript codebase into a React/TypeScript architecture.
      </p>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>Copyright</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        The layout, graphics, and structure of this web application (Join) are part of the curriculum provided by the Developer Akademie. The underlying code and React implementations are the intellectual property of the author mentioned above.
      </p>
    </main>
  );
}
