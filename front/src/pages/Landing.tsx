import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  // On vérifie si l'utilisateur est déjà passé par la case "Login"
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <div className="landing-page">
      <div className="mesh-gradient"></div>

      <nav className="navbar">
        <div className="logo">JOB<span>AGGREGATOR</span></div>
        <div className="nav-btns">
          {/* Si loggé, on montre le lien vers le Dashboard, sinon Connexion */}
          {isAuth ? (
            <button className="btn-nav btn-special" onClick={() => navigate('/dashboard')}>
              Mon Dashboard
            </button>
          ) : (
            <button className="btn-nav" onClick={() => navigate('/auth')}>
              Connexion
            </button>
          )}
        </div>
      </nav>

      <main className="hero-container">
        <div className="hero-badge">Plateforme certifiée Epitech</div>
        <h1>L'avenir du job board <br/> est <span className="highlight">intelligent.</span></h1>
        <p>
          Centralisez vos recherches. Laissez notre IA scorer les meilleures 
          offres WeLoveDevs pour vous.
        </p>
        
        <div className="btn-group">
          {/* Bouton principal dynamique */}
          <button className="btn-main" onClick={() => navigate(isAuth ? '/dashboard' : '/auth')}>
            {isAuth ? 'Accéder au Dashboard' : 'Commencer gratuitement'}
          </button>
          <button className="btn-outline" onClick={() => navigate('/research')}>
            Explorer les offres
          </button>
        </div>
      </main>

      <section className="features-grid">
        <div className="card">
          <div className="card-accent"></div>
          <h3>IA Prédictive</h3>
          <p>Analyse de compatibilité en temps réel.</p>
        </div>
        <div className="card">
          <div className="card-accent"></div>
          <h3>Data Live</h3>
          <p>Statistiques du marché en direct.</p>
        </div>
        <div className="card">
          <div className="card-accent"></div>
          <h3>Rapidité</h3>
          <p>Recherche optimisée en moins de 1s.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;