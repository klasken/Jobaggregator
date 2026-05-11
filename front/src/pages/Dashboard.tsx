import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-root">
      <aside className="db-sidebar">
        <div className="user-profile">
          <div className="avatar">JD</div>
          <div>
            <p className="user-name">sacha bouron</p>
            <p className="user-role">Développeur Fullstack</p>
          </div>
        </div>
        <nav className="db-nav">
          <button className="active">🏠 Aperçu</button>
          <button>🔍 Alertes Job</button>
          <button>📈 Analyses Marché</button>
          <button>⚙️ Paramètres</button>
        </nav>
      </aside>

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