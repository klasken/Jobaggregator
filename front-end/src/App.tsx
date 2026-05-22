import { useState, useEffect } from 'react';
import HomePage from './pages/Home';
import Login from './pages/Auth';
import Research from './pages/Research';
import Dashboard from './pages/Dashboard';
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import Sidebar from './pages/Sidebar';
import { translations } from './Trad';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'research' | 'dashboard' | 'notifs' | 'settings' | 'profile' | 'admin'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Nouvel état pour savoir si l'utilisateur vient de s'inscrire ou se connecte normalement
  const [isNewUser, setIsNewUser] = useState(false);

  const [userData, setUserData] = useState<any>({
    name: "",
    nom: "",
    prenom: "",
    email: "",
    competences: "",
    experience: "Junior (0-2 ans)",
    avatar: null,
    role_id: 1
  });

  const [homeFilters, setHomeFilters] = useState({ role: '', city: '' });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [accessibility, setAccessibility] = useState(localStorage.getItem('accessibility') || 'none');
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'fr');

  const t = translations[language] || translations['fr'];

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('accessibility', accessibility);
    localStorage.setItem('lang', language);
    document.body.className = `theme-${theme} access-${accessibility}`;
  }, [theme, accessibility, language]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp && payload.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } else {
        setUserData((prev: any) => ({ ...prev, email: payload.sub, role_id: payload.role_id }));
        setIsLoggedIn(true);

        // Récupération du profil complet au chargement de l'app
        fetch(`/api/dashboard/user/${payload.sub}`)
          .then(res => res.json())
          .then(userDataResp => {
            const nomComplet = userDataResp.nom || "Utilisateur";
            const parties = nomComplet.trim().split(' ', 1);
            const prenom = parties[0] || "Utilisateur";

            setUserData((prev: any) => ({
              ...prev,
              nom: nomComplet,
              name: nomComplet,
              prenom: prenom,
              competences: userDataResp.competences || ""
            }));
          })
          .catch(e => console.error("Erreur de récupération du profil", e));
      }
    } catch {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsNewUser(false);
    setSelectedJobId(null);
    setUserData({
      name: "",
      nom: "",
      prenom: "",
      email: "",
      competences: "",
      experience: "Junior (0-2 ans)",
      avatar: null,
      role_id: 1
    });
    setCurrentPage('home');
  };

  const handleNavigation = (page: string | { page: string; jobId: number }) => {
    if (typeof page === 'object') {
      if (page.page === 'research') {
        setSelectedJobId(page.jobId);
        setCurrentPage('research');
      }
      return;
    }
    if (page === 'logout') {
      handleLogout();
    } else {
      setSelectedJobId(null);
      setCurrentPage(page as any);
    }
  };

  const handleLoginSuccess = async (email: string, isRegister: boolean = false) => {
    try {
      const userResponse = await fetch(`/api/dashboard/user/${email}`);
      const userDataResp = await userResponse.json();

      const nomComplet = userDataResp.nom || "Utilisateur";
      // Extrait uniquement le prénom (premier mot du nom complet)
      const prenom = nomComplet.trim().split(' ')[0] || "Utilisateur";

      setUserData({
        email: email,
        nom: nomComplet,
        name: nomComplet,
        prenom: prenom,
        competences: userDataResp.competences || "",
        role_id: userDataResp.role_id || 1
      });
    } catch (e) {
      setUserData({ email, nom: "Utilisateur", name: "Utilisateur", prenom: "Utilisateur", competences: "", role_id: 1 });
    }
    setIsNewUser(isRegister);
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

  const pagesWithSidebar = ['research', 'dashboard', 'notifs', 'settings', 'profile', 'admin'];
  const showSidebar = pagesWithSidebar.includes(currentPage);

  return (
    <div className="App" style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>

      {showSidebar && (
        <Sidebar
          onNavigate={handleNavigation}
          userData={userData}
          currentPage={currentPage}
          t={t}
        />
      )}

      {/* LA BALISE MANQUANTE ÉTAIT CELLE-CI : */}
      <div className="app-page-content" style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>

        {currentPage === 'home' && (
          <HomePage
            onLoginClick={openLogin}
            onRegisterClick={openRegister}
            onDashboardClick={() => setCurrentPage('dashboard')}
            onNavigate={handleNavigation}
            isLoggedIn={isLoggedIn}
            theme={theme}
            setTheme={setTheme}
            t={t}
            currentLang={language}
            setLang={setLanguage}
            isNewUser={isNewUser}
            userData={userData}
          />
        )}

        {currentPage === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            theme={theme}
            setTheme={setTheme}
            initialStep={authMode}
            t={t}
          />
        )}

        {currentPage === 'research' && (
          <Research
            onNavigate={handleNavigation}
            t={t}
            savedJobs={savedJobs}
            setSavedJobs={setSavedJobs}
            userData={userData}
            homeFilters={homeFilters}
            setHomeFilters={setHomeFilters}
            selectedJobId={selectedJobId}
          />
        )}

        {currentPage === 'dashboard' && (
          <Dashboard
            onNavigate={handleNavigation}
            t={t}
            savedJobs={savedJobs}
            userData={userData}
          />
        )}

        {currentPage === 'notifs' && (
          <NotificationsPage
            onNavigate={handleNavigation}
            t={t}
            userData={userData}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsPage
            onNavigate={handleNavigation}
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
            onNavigate={handleNavigation}
            userData={userData}
            setUserData={setUserData}
            t={t}
          />
        )}

        {currentPage === 'admin' && userData?.role_id === 2 && (
          <AdminPage
            onNavigate={handleNavigation}
            t={t}
            userData={userData}
          />
        )}

        {currentPage === 'admin' && userData?.role_id !== 2 && (
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2 style={{ color: 'red' }}>Accès refusé</h2>
            <p>Vous n'avez pas les droits d'administrateur pour voir cette page.</p>
            <button onClick={() => setCurrentPage('home')} style={{ marginTop: '20px', padding: '10px 20px' }}>
              Retourner à l'accueil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
