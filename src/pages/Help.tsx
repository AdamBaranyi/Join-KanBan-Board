import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

export default function Help() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <main className="content-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '48px', margin: 0 }}>{t("help.title")}</h1>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <img src="/assets/imgs/arrow_left_line_hover.svg" alt="Back" />
        </button>
      </div>
      <p style={{ fontSize: '20px', lineHeight: '1.5' }}>
        <Trans i18nKey="help.intro" components={{ b: <b /> }} />
      </p>
      
      <h2 style={{ fontSize: '27px', marginTop: '24px', marginBottom: '16px' }}>{t("help.whatIsTitle")}</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        {t("help.whatIsText")}
      </p>

      <h2 style={{ fontSize: '27px', marginTop: '24px', marginBottom: '16px' }}>{t("help.howToTitle")}</h2>
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        {t("help.howToText1")}
        <br/><br/>
        <Trans i18nKey="help.howToText2" components={{ b: <b /> }} />
        <br/><br/>
        <Trans i18nKey="help.howToText3" components={{ b: <b /> }} />
        <br/><br/>
        <Trans i18nKey="help.howToText4" components={{ b: <b /> }} />
        <br/><br/>
        <Trans i18nKey="help.howToText5" components={{ b: <b /> }} />
      </p>
    </main>
  );
}
