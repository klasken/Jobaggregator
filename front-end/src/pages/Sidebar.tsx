import React, { useState } from 'react';
import './Sidebar.css';
import { 
  LayoutDashboard, Briefcase, Bell, Settings, LogOut, Home, User, ShieldCheck, Menu, X 
} from "lucide-react";

interface SidebarProps {
  onNavigate: (page: string) => void;
  userData: any;
  currentPage: string;
  t: any;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, userData, currentPage, t }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button 
        className="mobile-nav-toggle" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`research-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* En-tête uniquement avec le logo mis à jour sur /logo.png */}
        <div className="sidebar-brand" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <img src="/logo.png" alt="Logo JobyFind" className="custom-sidebar-logo" />
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className={`nav-item ${currentPage === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
            <Home size={18} /> {t.home || "Accueil"}
          </div>
          <div className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavClick('dashboard')}>
            <LayoutDashboard size={18} /> {t.dashboard}
          </div>
          <div className={`nav-item ${currentPage === 'research' ? 'active' : ''}`} onClick={() => handleNavClick('research')}>
            <Briefcase size={18} /> {t.jobs}
          </div>
          <div className={`nav-item ${currentPage === 'notifs' ? 'active' : ''}`} onClick={() => handleNavClick('notifs')}>
            <Bell size={18} /> {t.notifs}
          </div>
          <div className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`} onClick={() => handleNavClick('profile')}>
            <User size={18} /> {t.profile}
          </div>

          {userData?.role_id === 2 && (
            <div className={`nav-item ${currentPage === 'admin' ? 'active' : ''}`} onClick={() => handleNavClick('admin')}>
              <ShieldCheck size={18} /> Admin
            </div>
          )}

          <div className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => handleNavClick('settings')}>
            <Settings size={18} /> {t.settings}
          </div>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {userData?.avatar ? (
              <img src={userData.avatar} alt="Profil" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              userData?.nom?.charAt(0) || userData?.name?.charAt(0) || "U"
            )}
          </div>
          <div className="user-meta">
            <p className="u-name">{userData?.nom || userData?.name || "Utilisateur"}</p>
            <button className="u-logout" onClick={() => handleNavClick('logout')}>
              <LogOut size={14} /> {t.logout}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;