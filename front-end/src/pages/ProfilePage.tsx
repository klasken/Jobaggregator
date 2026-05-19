import React, { useState, useRef } from 'react';
import './ProfilePage.css';
import {
  LayoutDashboard, Briefcase, Bell, Settings, LogOut, Home, User,
  Camera, Check, Plus, X
} from "lucide-react";

interface ProfileProps {
  onNavigate: (page: string) => void;
  userData: any;
  setUserData: (data: any) => void;
  t: any;
}

const ProfilePage: React.FC<ProfileProps> = ({ onNavigate, userData, setUserData, t }) => {
  // État local temporaire pour les modifications avant sauvegarde
  const [tempData, setTempData] = useState<any>(() => {
    let compArray = [];
    if (userData?.competences) {
      compArray = typeof userData.competences === 'string'
        ? userData.competences.split(',').map((s: string) => s.trim()).filter(Boolean)
        : userData.competences;
    }
    return {
      ...userData,
      nom: userData?.nom || "Utilisateur",
      email: userData?.email || "",
      competences: compArray || []
    };
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableSkills = ["React", "TypeScript", "Node.js", "Python", "Java", "C++", "PHP", "Vue.js", "Angular", "Swift", "Docker", "SQL"];

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
    const newSkills = tempData.competences.includes(skill)
      ? tempData.competences.filter((s: string) => s !== skill)
      : [...tempData.competences, skill];
    setTempData({...tempData, competences: newSkills});
  };

const handleSave = async () => {
    const skillsString = tempData.competences.join(', '); // Format texte propre (ex: "React, SQL")

    try {
      // Appel API vers le endpoint PUT que l'on vient de créer
      const response = await fetch(`/api/dashboard/user/${tempData.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nom: tempData.nom,
          competences: skillsString
        }),
      });

      if (response.ok) {
        // Si la BDD est mise à jour avec succès, on met à jour l'état global React
        const dataToSave = {
          ...tempData,
          name: tempData.nom, // Compatibilité
          competences: skillsString
        };
        setUserData(dataToSave);
        alert("Profil enregistré et synchronisé en base de données ! 🎉");
      } else {
        alert("Erreur lors de la sauvegarde côté serveur.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Impossible de joindre le serveur backend.");
    }
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
          <div className="nav-item active"><User size={18} /> {t.profile}</div>
          <div className="nav-item" onClick={() => onNavigate('settings')}><Settings size={18} /> {t.settings}</div>
        </nav>

        {/* BLOC RESTAURÉ : Informations de l'utilisateur + Vrai bouton déconnexion */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {userData?.avatar ? (
              <img src={userData.avatar} alt="Profil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
            ) : (
              userData?.nom?.charAt(0) || "U"
            )}
          </div>
          <div className="user-meta">
            <p className="u-name">{userData?.nom || "Utilisateur"}</p>
            <button className="u-logout" onClick={() => onNavigate('logout')}><LogOut size={14} /> {t.logout}</button>
          </div>
        </div>
      </aside>

      <main className="profile-main">
        <header className="profile-header">
          <h1>Mon Profil</h1>
          <p>Personnalisez votre identité de développeur.</p>
        </header>

        <div className="profile-content-grid">
          {/* Section Avatar et Nom */}
          <section className="profile-card hero-card">
            <div className="avatar-edit-wrapper">
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
              <div className="avatar-circle">
                {tempData.avatar ? <img src={tempData.avatar} alt="Avatar" /> : <div className="initials">{tempData.nom.charAt(0)}</div>}
                <button className="camera-overlay" onClick={() => fileInputRef.current?.click()}><Camera size={16} /></button>
              </div>
            </div>
            <div className="hero-info">
              <input
                type="text"
                className="edit-name-input"
                value={tempData.nom}
                onChange={(e) => setTempData({...tempData, nom: e.target.value})}
                placeholder="Votre nom"
              />
              <p className="user-email-text">{tempData.email}</p>
            </div>
          </section>

          {/* Section Compétences */}
          <section className="profile-card">
            <h3>Mes Hard Skills</h3>
            <p className="card-subtitle">Cliquez sur les langages pour les ajouter ou les retirer de votre profil.</p>
            <div className="interactive-skills-grid">
              {availableSkills.map(skill => (
                <button
                  key={skill}
                  className={`skill-pill ${tempData.competences.includes(skill) ? 'active' : ''}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill} {tempData.competences.includes(skill) ? <X size={14} /> : <Plus size={14} />}
                </button>
              ))}
            </div>
          </section>

          {/* Section Expérience */}
          <section className="profile-card">
            <h3>Séniorité</h3>
            <div className="select-wrapper">
              <select
                className="modern-select"
                value={tempData.experience}
                onChange={(e) => setTempData({...tempData, experience: e.target.value})}
              >
                <option>Junior (0-2 ans)</option>
                <option>Intermédiaire (2-5 ans)</option>
                <option>Sénior (5+ ans)</option>
              </select>
            </div>
          </section>
        </div>

        <div className="profile-actions-footer">
          <button className="save-profile-btn" onClick={handleSave}>
            <Check size={20} /> Sauvegarder les modifications
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
