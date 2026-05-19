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

  const [userData, setUserData] = useState<any>({
    nom: "Sacha Bouron",
    name: "Sacha Bouron",
    email: "sacha.bouron@icloud.com",
    competences: "React, TypeScript",
    experience: "Junior (0-2 ans)",
    avatar: null
  });

  // --- 1. LE NOUVEL ÉTAT POUR TRANSPORTER LA RECHERCHE DE L'ACCUEIL ---
  const [homeFilters, setHomeFilters] = useState({ role: '', city: '' });

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

  // FONCTION DE NAVIGATION INTERACTIVE (Gère la vraie déconnexion)
  const handleNavigate = (page: string) => {
    if (page === 'logout') {
      setIsLoggedIn(false);
      localStorage.removeItem('token'); // Supprime le jeton JWT
      setUserData({
        nom: "",
        name: "",
        email: "",
        competences: "",
        experience: "",
        avatar: null
      });
      setCurrentPage('home');
    } else {
      setCurrentPage(page as any);
    }
  };

  const handleLoginSuccess = (userEmail: string) => {
    setIsLoggedIn(true);

    fetch(`/api/dashboard/user/${userEmail}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUserData({
            nom: data.nom,
            name: data.nom,
            email: data.email,
            competences: data.competences || "",
            experience: "Junior (0-2 ans)",
            avatar: null
          });
        }
      })
      .catch(err => console.error("Erreur lors de la récupération du profil utilisateur :", err));

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
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          theme={theme}
          setTheme={setTheme}
          setHomeFilters={setHomeFilters} // <-- 2. ENVOYÉ À HOME
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
          onNavigate={handleNavigate}
          t={t}
          savedJobs={savedJobs}
          setSavedJobs={setSavedJobs}
          userData={userData}
          homeFilters={homeFilters}       // <-- 3. ENVOYÉ À RESEARCH
          setHomeFilters={setHomeFilters} // <-- 4. ENVOYÉ À RESEARCH
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          onNavigate={handleNavigate}
          t={t}
          savedJobs={savedJobs}
          userData={userData}
        />
      )}

      {currentPage === 'settings' && (
        <SettingsPage
          onNavigate={handleNavigate}
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
          onNavigate={handleNavigate}
          userData={userData}
          setUserData={setUserData}
          t={t}
        />
      )}
    </div>
  );
}

export default App;
