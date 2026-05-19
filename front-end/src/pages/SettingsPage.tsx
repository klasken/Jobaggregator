import React from 'react';
import './SettingsPage.css';
import {
  LayoutDashboard, Briefcase, Bell, Settings, LogOut, Home, User,
   Sun, Eye, Languages, Volume2
} from "lucide-react";

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
  onNavigate, theme, setTheme, accessibility, setAccessibility, language, setLanguage, t, userData
}) => {

  const speakTest = () => {
    const text = language === 'fr' ? "Ceci est un test du lecteur d'écran." : "This is a screen reader test.";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'fr' ? 'fr-FR' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="settings-container">
      <aside className="research-sidebar">
        <div className="sidebar-brand" onClick={() => onNavigate('home')} style={{cursor: 'pointer'}}>
          <div className="brand-icon"><Briefcase size={20} /></div>
          <span>EpiDevs</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => onNavigate('home')}><Home size={18} /> Accueil</div>
          <div className="nav-item" onClick={() => onNavigate('dashboard')}><LayoutDashboard size={18} /> {t.dashboard}</div>
          <div className="nav-item" onClick={() => onNavigate('research')}><Briefcase size={18} /> {t.jobs}</div>
          <div className="nav-item"><Bell size={18} /> {t.notifs}</div>
          <div className="nav-item" onClick={() => onNavigate('profile')}><User size={18} /> {t.profile}</div>
          <div className="nav-item active"><Settings size={18} /> {t.settings}</div>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">
            {userData?.avatar ? (
              <img src={userData.avatar} alt="Profil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
            ) : (
              userData?.nom?.charAt(0) || userData?.name?.charAt(0) || "U"
            )}
          </div>
          <div className="user-meta">
            <p className="u-name">{userData?.nom || userData?.name || "Utilisateur"}</p>
            <button className="u-logout" onClick={() => onNavigate('logout')}><LogOut size={14} /> {t.logout}</button>
          </div>
        </div>
      </aside>

      <main className="settings-main">
        <header className="settings-header">
          <h1>{t.settings}</h1>
          <p>Personnalisez votre expérience EpiDevs.</p>
        </header>

        <div className="settings-grid">
          <section className="settings-card">
            <div className="card-title"><Sun size={20} /> <h3>Apparence</h3></div>
            <div className="setting-row">
              <span>Mode Sombre</span>
              <button
                className={`toggle-btn ${theme === 'dark' ? 'on' : ''}`}
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                <div className="toggle-cursor"></div>
              </button>
            </div>
          </section>

          <section className="settings-card">
            <div className="card-title"><Languages size={20} /> <h3>Langue</h3></div>
            <div className="setting-row">
              <span>Langue du système</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </section>

          <section className="settings-card">
            <div className="card-title"><Eye size={20} /> <h3>Vision</h3></div>
            <div className="setting-row">
              <span>Mode Daltonien</span>
              <select value={accessibility} onChange={(e) => setAccessibility(e.target.value)}>
                <option value="none">Standard</option>
                <option value="deuteranopia">Deutéranopie (Vert)</option>
                <option value="protanopia">Protanopie (Rouge)</option>
                <option value="tritanopia">Tritanopie (Bleu)</option>
              </select>
            </div>
            <div className="setting-row">
              <span>Texte Agrandi</span>
              <button
                className={`toggle-btn ${accessibility === 'large-text' ? 'on' : ''}`}
                onClick={() => setAccessibility(accessibility === 'large-text' ? 'none' : 'large-text')}
              >
                <div className="toggle-cursor"></div>
              </button>
            </div>
          </section>

          <section className="settings-card">
            <div className="card-title"><Volume2 size={20} /> <h3>Accessibilité Audio</h3></div>
            <div className="setting-row">
              <span>Lecteur Vocal (Speaker)</span>
              <button className="btn-test-audio" onClick={speakTest}>Tester la voix</button>
            </div>
            <div className="setting-row">
              <span>Sous-titres automatiques</span>
              <button className="toggle-btn on"><div className="toggle-cursor"></div></button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
