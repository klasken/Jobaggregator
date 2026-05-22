import React from 'react';
import './SettingsPage.css';
import { Sun, Eye, Languages, Volume2 } from "lucide-react";

interface SettingsProps {
  onNavigate: (page: any) => void;
  theme: string;
  setTheme: (t: string) => void;
  accessibility: string;
  setAccessibility: (a: string) => void;
  language: string;
  setLanguage: (l: string) => void;
  t: any;
  userData: any;
}

const SettingsPage: React.FC<SettingsProps> = ({
  theme, setTheme, accessibility, setAccessibility, language, setLanguage, t
}) => {

  const speakTest = () => {
    const text = language === 'fr' ? "Ceci est un test du lecteur d'écran." : "This is a screen reader test.";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'fr' ? 'fr-FR' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="settings-container">
      <main className="settings-main">
        <header className="settings-header">
          <h1>{t.settings}</h1>
          <p>{t.settingsSub || "Personnalisez votre expérience JobyFind."}</p>
        </header>

        <div className="settings-grid">
          <section className="settings-card">
            <div className="card-title"><Sun size={20} /> <h3>{t.appearanceLabel || "Apparence"}</h3></div>
            <div className="setting-row">
              <span>{t.modeDark || "Mode Sombre"}</span>
              <button
                className={`toggle-btn ${theme === 'dark' ? 'on' : ''}`}
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                <div className="toggle-cursor"></div>
              </button>
            </div>
          </section>

          <section className="settings-card">
            <div className="card-title"><Languages size={20} /> <h3>{t.languageSection || "Langue"}</h3></div>
            <div className="setting-row">
              <span>{t.systemLanguage || "Langue du système"}</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="ar">العربية</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </section>

          <section className="settings-card">
            <div className="card-title"><Eye size={20} /> <h3>{t.visionLabel || "Vision"}</h3></div>
            <div className="setting-row">
              <span>{t.colorblindMode || "Mode Daltonien"}</span>
              <select value={accessibility} onChange={(e) => setAccessibility(e.target.value)}>
                <option value="none">{t.standardVision || "Standard"}</option>
                <option value="deuteranopia">Deutéranopie (Vert)</option>
                <option value="protanopia">Protanopie (Rouge)</option>
                <option value="tritanopia">Tritanopie (Bleu)</option>
              </select>
            </div>
            <div className="setting-row">
              <span>{t.largeText || "Texte Agrandi"}</span>
              <button
                className={`toggle-btn ${accessibility === 'large-text' ? 'on' : ''}`}
                onClick={() => setAccessibility(accessibility === 'large-text' ? 'none' : 'large-text')}
              >
                <div className="toggle-cursor"></div>
              </button>
            </div>
          </section>

          <section className="settings-card">
            <div className="card-title"><Volume2 size={20} /> <h3>{t.audioAccessibility || "Accessibilité Audio"}</h3></div>
            <div className="setting-row">
              <span>{t.screenReader || "Lecteur Vocal (Speaker)"}</span>
              <button className="btn-test-audio" onClick={speakTest}>{t.testVoice || "Tester la voix"}</button>
            </div>
            <div className="setting-row">
              <span>{t.autoSubtitles || "Sous-titres automatiques"}</span>
              <button className="toggle-btn on"><div className="toggle-cursor"></div></button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;