import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

export default function Privacy() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <main className="content-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '48px', margin: 0 }}>{t("privacy.title")}</h1>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/assets/imgs/arrow_left_line_hover.svg" alt="Back" />
        </button>
      </div>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        {t("privacy.intro")}
      </p>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>{t("privacy.dataTitle")}</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        <Trans i18nKey="privacy.dataText" components={{ b: <b /> }} />
      </p>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>{t("privacy.storageTitle")}</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        {t("privacy.storageText1")}
        <br/><br/>
        <Trans i18nKey="privacy.storageText2" components={{ b: <b /> }} />
        <br/><br/>
        <Trans i18nKey="privacy.storageText3" components={{ b: <b /> }} />
      </p>

      <h2 style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>{t("privacy.thirdPartyTitle")}</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px' }}>
        {t("privacy.thirdPartyText")}
      </p>
    </main>
  );
}
