import React, { useState } from 'react';
import './index.css';

interface StatItem {
  id: number;
  label: string;
  value: string | number;
  trend: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const stats: StatItem[] = [
    { id: 1, label: 'Offres actives', value: 14, trend: '+12%', icon: '💼', color: 'blue' },
    { id: 2, label: 'Recommandations', value: 3, trend: 'AI', icon: '✨', color: 'green' },
    { id: 3, label: 'Localisations', value: 12, trend: 'Villes', icon: '📍', color: 'purple' },
    { id: 4, label: 'Tendance hebdo', value: '+15', trend: '+8%', icon: '📈', color: 'orange' },
  ];

  return (
    <div className="app-wrapper">
      {/* navbar*/}
      <nav className="navbar">
        <div className="nav-left">
          <div className="brand-badge">JA</div>
          <h2 className="brand-text">Job Aggregator</h2>
          <div className="nav-links">
            {['Dashboard', 'Recherche'].map((tab) => (
              <button 
                key={tab}
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'Dashboard' ? '⊞' : '🔍'} {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="nav-right">
          <div className="user-profile">
            <div className="user-details">
              <span className="user-name">Utilisateur</span>
              <span className="user-status">Membre PRO</span>
            </div>
          </div>
          <button className="btn-logout">
             Déconnexion <span>→</span>
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <header className="page-header">
          <h1>Tableau de bord</h1>
          <p>Bienvenue ! Voici l'analyse de vos opportunités actuelles.</p>
        </header>

        <section className="stats-container">
          {stats.map((stat) => (
            <div key={stat.id} className="glass-card stat-card">
              <div className="stat-top">
                <div className={`icon-box ${stat.color}`}>{stat.icon}</div>
                <span className={`badge ${stat.trend.includes('+') ? 'success' : 'info'}`}>
                  {stat.trend}
                </span>
              </div>
              <div className="stat-bottom">
                <span className="stat-label">{stat.label}</span>
                <h3 className="stat-number">{stat.value}</h3>
              </div>
            </div>
          ))}
        </section>

        <section className="data-grid">
          <div className="glass-card main-chart">
            <div className="card-header">
              <h3>Tendance des offres</h3>
              <div className="chart-actions">
                <button className="btn-mini">7 jours</button>
                <button className="btn-mini">30 jours</button>
              </div>
            </div>
            <div className="visual-placeholder">
               <div className="wave-container">
                  <div className="wave-svg"></div>
               </div>
            </div>
          </div>

          <div className="glass-card side-panel">
            <div className="card-header">
              <h3>Types de contrats</h3>
            </div>
            <div className="contract-list">
              <div className="contract-item">
                <span>CDI</span>
                <div className="progress-bar"><div className="fill" style={{width: '70%'}}></div></div>
                <span>10</span>
              </div>
              <div className="contract-item">
                <span>Freelance</span>
                <div className="progress-bar"><div className="fill" style={{width: '20%'}}></div></div>
                <span>2</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;