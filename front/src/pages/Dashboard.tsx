import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

interface StatItem {
  id: number;
  label: string;
  value: string | number;
  trend: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const Dashboard: React.FC = () => {
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
          {/* Nouveau bouton Profil / Login */}
          <Link to="/login" className="user-profile-btn" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="user-profile">
              <div className="avatar-icon">👤</div>
              <div className="user-details">
                <span className="user-name">Connexion</span>
                <span className="user-status">Mon profil</span>
              </div>
            </div>
          </Link>

          <button className="btn-logout">
             Déconnexion <span>→</span>
          </button>
        </div>
      </nav>

      <main className="db-content">
        <header className="db-header">
          <h2>Tableau de bord personnel</h2>
          <button className="btn-refresh">Actualiser les données</button>
        </header>

        {/* SECTION DATA & AI - EXIGENCES PROJET */}
        <section className="insight-grid">
          <div className="card insight-card ai-feature">
            <div className="ai-badge">Propulsé par IA Local</div>
            <h3>Analyse de profil</h3>
            <p>D'après les 500 dernières offres collectées, votre stack est en hausse de <strong>12%</strong> en demande ce mois-ci.</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '75%'}}></div>
            </div>
            <small>Pertinence du marché : Excellente</small>
          </div>

          <div className="card insight-card data-feature">
            <h3>Distribution des Salaires</h3>
            <div className="dummy-chart">
              <div className="bar" style={{height: '40%'}}></div>
              <div className="bar" style={{height: '60%'}}></div>
              <div className="bar" style={{height: '90%'}}></div>
              <div className="bar" style={{height: '50%'}}></div>
            </div>
            <p className="chart-label">Moyenne : 48k€ / an (Junior)</p>
          </div>
        </section>

        <section className="last-activity">
          <h3>Offres recommandées pour vous</h3>
          <div className="activity-table">
            <div className="table-row header">
              <span>Entreprise</span>
              <span>Poste</span>
              <span>Score IA</span>
              <span>Status</span>
            </div>
            <div className="table-row">
              <span>Google</span>
              <span>SRE Engineer</span>
              <span className="score">98%</span>
              <span className="badge-status">Ouvert</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
