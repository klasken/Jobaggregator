import React from 'react';
import './Dashboard.css';
import { jobs } from './Research'; 
import { 
  LayoutDashboard, Briefcase, Bell, Settings, LogOut, Home, User,
  CheckCircle, Clock, XCircle, Send, Search, Filter, Bookmark
} from "lucide-react";

interface DashboardProps {
  onNavigate: (page: any) => void;
  t: any;
  savedJobs: number[];
  userData: any;
}

const applications = [
  { id: 1, company: "TechVision", position: "Senior Frontend Developer", date: "12 Mai 2024", status: "En attente", color: "warning" },
  { id: 2, company: "CloudStack", position: "DevOps Engineer", date: "10 Mai 2024", status: "Accepté", color: "success" },
  { id: 3, company: "StartupLab", position: "Fullstack Developer", date: "05 Mai 2024", status: "Refusé", color: "danger" },
  { id: 4, company: "DataCorp", position: "Backend Engineer", date: "01 Mai 2024", status: "En attente", color: "warning" },
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, t, savedJobs, userData }) => {
  const favoriteJobs = jobs.filter(job => savedJobs.includes(job.id));

  return (
    <div className="dash-container">
      <aside className="research-sidebar">
        <div className="sidebar-brand" onClick={() => onNavigate('home')} style={{cursor: 'pointer'}}>
          <div className="brand-icon"><Briefcase size={20} /></div>
          <span>EpiDevs</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => onNavigate('home')}><Home size={18} /> Accueil</div>
          <div className="nav-item active"><LayoutDashboard size={18} /> {t.dashboard}</div>
          <div className="nav-item" onClick={() => onNavigate('research')}><Briefcase size={18} /> {t.jobs}</div>
          <div className="nav-item"><Bell size={18} /> {t.notifs}</div>
          <div className="nav-item" onClick={() => onNavigate('profile')}><User size={18} /> {t.profile}</div>
          <div className="nav-item" onClick={() => onNavigate('settings')}><Settings size={18} /> {t.settings}</div>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">
            {userData.avatar ? (
              <img src={userData.avatar} alt="Profil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
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

      <main className="dash-main">
        <header className="dash-header">
          <h1>{t.dashboard}</h1>
          <p>Suivez l'état de vos candidatures en temps réel.</p>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue"><Send size={20} /></div>
            <div className="stat-info"><h3>12</h3><p>Envoyées</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Clock size={20} /></div>
            <div className="stat-info"><h3>8</h3><p>En attente</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><CheckCircle size={20} /></div>
            <div className="stat-info"><h3>2</h3><p>Acceptées</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red"><XCircle size={20} /></div>
            <div className="stat-info"><h3>2</h3><p>Refusées</p></div>
          </div>
        </div>

        <section className="app-list-section">
          <div className="section-head">
            <h2>Mes candidatures</h2>
            <div className="head-actions">
              <div className="search-mini"><Search size={16}/><input type="text" placeholder="Rechercher..."/></div>
              <button className="btn-filter-mini"><Filter size={16}/> Filtrer</button>
            </div>
          </div>

          <div className="app-table-wrapper">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Poste</th>
                  <th>Date d'envoi</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td className="bold">{app.company}</td>
                    <td>{app.position}</td>
                    <td className="text-muted">{app.date}</td>
                    <td><span className={`status-badge ${app.color}`}>{app.status}</span></td>
                    <td><button className="btn-view">Détails</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="app-list-section favorites-block" style={{marginTop: '32px'}}>
          <div className="section-head">
            <h2>Offres favorites</h2>
            {favoriteJobs.length > 0 && (
              <div className="head-actions">
                <span className="count-tag" style={{fontSize: '0.8rem', opacity: 0.7}}>{favoriteJobs.length} offres épinglées</span>
              </div>
            )}
          </div>

          <div className="app-table-wrapper">
            {favoriteJobs.length > 0 ? (
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Entreprise</th>
                    <th>Poste</th>
                    <th>Lieu</th>
                    <th>Salaire</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {favoriteJobs.map(job => (
                    <tr key={job.id}>
                      <td className="bold">
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <Bookmark size={14} style={{color: '#3b82f6'}} fill="#3b82f6"/>
                          {job.company}
                        </div>
                      </td>
                      <td>{job.title}</td>
                      <td className="text-muted">{job.location}</td>
                      <td><span className="salary-tag" style={{color: '#22c55e'}}>{job.salary}</span></td>
                      <td><button className="btn-view" onClick={() => onNavigate('research')}>Voir l'offre</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state" style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
                <Bookmark size={40} style={{marginBottom: '16px', opacity: 0.2}} />
                <p>Vous n'avez aucune offre épinglée pour le moment.</p>
                <button 
                  className="btn-view" 
                  style={{marginTop: '16px'}}
                  onClick={() => onNavigate('research')}
                >
                  Parcourir les offres
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;