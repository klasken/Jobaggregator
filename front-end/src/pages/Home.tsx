import React, { useState } from 'react';
import './Home.css';
import { Search, MapPin, Briefcase, Settings, Moon, Sun, LayoutDashboard, ShieldCheck, HelpCircle } from 'lucide-react';

interface HomeProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onDashboardClick: () => void;
  onNavigate: (page: any) => void;
  isLoggedIn: boolean;
  theme: string;
  setTheme: (t: string) => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick, onRegisterClick, onDashboardClick, onNavigate, isLoggedIn, theme, setTheme }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={theme === "dark" ? "home-dark-theme" : "home-light-theme"}>
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo">
            <div className="logo-icon"><Briefcase size={22} /></div>
            <span className="brand-name">EpiDevs</span>
          </div>
          <div className="nav-links">
            <a href="#" onClick={() => onNavigate('research')}>Offres</a>
            <a href="#" onClick={() => onNavigate('reviews')}>Avis Entreprises</a>
            <a href="#" onClick={() => onNavigate('salaries')}>Estimation Salaires</a>
          </div>
        </div>
        
        <div className="nav-right" style={{ position: 'relative' }}>
          <button className="nav-icon-btn" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={20} />
          </button>

          {showSettings && (
            <div className="settings-dropdown">
              <div className="dropdown-item" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                <span>{theme === 'dark' ? "Mode Clair" : "Mode Sombre"}</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item" onClick={() => onNavigate('settings')}>
                <Settings size={18} />
                <span>Tous les paramètres</span>
              </div>
            </div>
          )}

          {isLoggedIn ? (
            <button className="nav-dashboard-btn" onClick={onDashboardClick}>
              <LayoutDashboard size={18} />
              Tableau de bord
            </button>
          ) : (
            <>
              <button className="nav-login-btn" onClick={onLoginClick}>Connexion</button>
              <button className="nav-signup-btn" onClick={onRegisterClick}>S'inscrire</button>
            </>
          )}
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-tag">
          <span>Le nouveau standard du recrutement Tech</span>
        </div>

        <h1>Trouvez le job qui <br />vous fait <span className="text-blue">vibrer.</span></h1>
        <p>Accédez à des milliers d'offres tech exclusives centralisées pour vous.</p>
        
        <div className="search-container">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Développeur, Data, Product..." />
          </div>
          <div className="search-box">
            <MapPin className="search-icon" size={20} />
            <input type="text" placeholder="Paris, Remote, Lyon..." />
          </div>
          <button className="main-search-btn" onClick={() => onNavigate('research')}>Rechercher</button>
        </div>

        <div className="hero-footer-info">
          <div className="info-card">
            <HelpCircle size={20} className="info-icon" />
            <div className="info-text">
              <h3>C'est quoi EpiDevs ?</h3>
              <p>Une plateforme intelligente qui centralise les meilleures offres tech pour les développeurs exigeants.</p>
            </div>
          </div>
          <div className="info-card">
            <ShieldCheck size={20} className="info-icon security" />
            <div className="info-text">
              <h3>Données sécurisées</h3>
              <p>Votre vie privée est notre priorité. Vos données sont chiffrées et restent strictement confidentielles.</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;