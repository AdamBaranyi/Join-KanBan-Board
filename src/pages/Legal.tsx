import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

export default function Legal() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <main className="content-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '48px', margin: 0 }}>{t("legal.title")}</h1>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/assets/imgs/arrow_left_line_hover.svg" alt="Back" />
        </button>
      </div>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>{t("legal.imprintTitle")}</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        <Trans i18nKey="legal.imprintText" components={{ b: <b />, br: <br /> }} />
      </p>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>{t("legal.disclaimerTitle")}</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        {t("legal.disclaimerText")}
      </p>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>{t("legal.copyrightTitle")}</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        {t("legal.copyrightText")}
      </p>
    </main>
  );
}
