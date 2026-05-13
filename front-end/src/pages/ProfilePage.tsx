import React, { useState, useRef } from 'react';
import './ProfilePage.css';
import { 
  LayoutDashboard, Briefcase, Bell, Settings, LogOut, Home, User, Camera, Check, Plus, X
} from "lucide-react";

interface ProfileProps {
  onNavigate: (page: any) => void;
  userData: any;
  setUserData: (data: any) => void;
  t: any;
}

const ProfilePage: React.FC<ProfileProps> = ({ onNavigate, userData, setUserData, t }) => {
  const [tempData, setTempData] = useState({...userData});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = ["React", "TypeScript", "Node.js", "Python", "Java", "C++", "PHP", "Vue.js", "Angular", "Swift"];

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData({ ...tempData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill: string) => {
    const newSkills = tempData.skills.includes(skill) 
      ? tempData.skills.filter((s: string) => s !== skill) 
      : [...tempData.skills, skill];
    setTempData({...tempData, skills: newSkills});
  };

  const handleSave = () => {
    setUserData(tempData);
    alert("Profil mis à jour avec succès !");
  };

  return (
    <div className="profile-container">
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
          <div className="nav-item active" onClick={() => onNavigate('profile')}><User size={18} /> {t.profile}</div>
          <div className="nav-item" onClick={() => onNavigate('settings')}><Settings size={18} /> {t.settings}</div>
        </nav>
        
        <div className="sidebar-user">
          <div className="user-avatar">
            {userData.avatar ? (
              <img src={userData.avatar} alt="Profil" className="sidebar-img-circle" />
            ) : (
              userData.name.charAt(0)
            )}
          </div>
          <div className="user-meta">
            <p className="u-name">{userData.name}</p>
            <button className="u-logout" onClick={() => onNavigate('home')}><LogOut size={14} /> {t.logout}</button>
          </div>
        </div>
      </aside>

      <main className="profile-main">
        <header className="profile-header">
          <h1>Mon Profil</h1>
          <p>Gérez vos informations personnelles et techniques.</p>
        </header>

        <div className="profile-content-grid">
          <section className="profile-card avatar-section">
            <div className="avatar-wrapper">
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              
              {tempData.avatar ? (
                <img src={tempData.avatar} alt="Avatar" className="user-avatar-main" />
              ) : (
                <div className="avatar-placeholder">{tempData.name.charAt(0)}</div>
              )}
              
              <button className="change-avatar-btn" onClick={handleCameraClick}>
                <Camera size={16} />
              </button>
            </div>
            <div className="avatar-info">
              <input 
                type="text" 
                className="profile-input-name" 
                value={tempData.name} 
                onChange={(e) => setTempData({...tempData, name: e.target.value})} 
              />
              <p>{tempData.email}</p>
            </div>
          </section>

          <section className="profile-card">
            <h3>Mes Langages & Frameworks</h3>
            <div className="skills-grid-profile">
              {languages.map(lang => (
                <button 
                  key={lang} 
                  className={`skill-badge ${tempData.skills.includes(lang) ? 'active' : ''}`}
                  onClick={() => toggleSkill(lang)}
                >
                  {lang} {tempData.skills.includes(lang) ? <X size={12} /> : <Plus size={12} />}
                </button>
              ))}
            </div>
          </section>

          <section className="profile-card">
            <h3>Expérience professionnelle</h3>
            <select 
              className="profile-select" 
              value={tempData.experience} 
              onChange={(e) => setTempData({...tempData, experience: e.target.value})}
            >
              <option>Junior (0-2 ans)</option>
              <option>Intermédiaire (2-5 ans)</option>
              <option>Sénior (5+ ans)</option>
            </select>
          </section>
        </div>

        <footer className="profile-footer">
          <button className="btn-save-profile" onClick={handleSave}>
            <Check size={18} /> Enregistrer les modifications
          </button>
        </footer>
      </main>
    </div>
  );
};

export default ProfilePage;