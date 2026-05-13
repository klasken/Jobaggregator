import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Auth'; 
import Research from './pages/Research';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

const translations: any = {
  fr: { dashboard: "Tableau de bord", jobs: "Offres d'emploi", profile: "Profil", notifs: "Notifications", settings: "Paramètres", logout: "Déconnexion" },
  en: { dashboard: "Dashboard", jobs: "Job Offers", profile: "Profile", notifs: "Notifications", settings: "Settings", logout: "Logout" },
  es: { dashboard: "Tablero", jobs: "Ofertas de travail", profile: "Perfil", notifs: "Notificaciones", settings: "Ajustes", logout: "Cerrar sesión" }
};

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'research' | 'dashboard' | 'settings' | 'profile'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedJobs, setSavedJobs] = useState<number[]>([]); 
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [userData, setUserData] = useState({
    name: "Sacha Bouron",
    email: "sacha.bouron@icloud.com",
    skills: ["React", "TypeScript"],
    experience: "Junior (0-2 ans)",
    avatar: null
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [accessibility, setAccessibility] = useState(localStorage.getItem('accessibility') || 'none');
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'fr');

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('accessibility', accessibility);
    localStorage.setItem('lang', language);
    document.body.className = `theme-${theme} access-${accessibility}`;
  }, [theme, accessibility, language]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('home'); 
  };

  const openLogin = () => {
    setAuthMode('login');
    setCurrentPage('login');
  };

  const openRegister = () => {
    setAuthMode('register');
    setCurrentPage('login');
  };

  return (
    <div className="App">
      {currentPage === 'home' && (
        <Home 
          onLoginClick={openLogin} 
          onRegisterClick={openRegister}
          onDashboardClick={() => setCurrentPage('dashboard')} 
          onNavigate={(page) => setCurrentPage(page as any)}
          isLoggedIn={isLoggedIn}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      {currentPage === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          theme={theme} 
          setTheme={setTheme}
          initialStep={authMode}
        />
      )}

      {currentPage === 'research' && (
        <Research 
          onNavigate={(page) => setCurrentPage(page as any)} 
          t={t} 
          savedJobs={savedJobs} 
          setSavedJobs={setSavedJobs} 
          userData={userData}
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard 
          onNavigate={(page) => setCurrentPage(page as any)} 
          t={t} 
          savedJobs={savedJobs} 
          userData={userData}
        />
      )}

      {currentPage === 'settings' && (
        <SettingsPage 
          onNavigate={(page) => setCurrentPage(page as any)} 
          theme={theme}
          setTheme={setTheme}
          accessibility={accessibility}
          setAccessibility={setAccessibility}
          language={language}
          setLanguage={setLanguage}
          t={t}
          userData={userData}
        />
      )}

      {currentPage === 'profile' && (
        <ProfilePage 
          onNavigate={(page) => setCurrentPage(page as any)} 
          userData={userData} 
          setUserData={setUserData} 
          t={t} 
        />
      )}
    </div>
  );
}

export default App;