import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Trouvez votre prochain challenge <span className="gradient-text">Tech</span></h1>
        <p>Agrégateur d'offres d'emploi synchronisé avec WeLoveDevs.</p>
        
        <div className="search-bar">
          <input type="text" placeholder="Poste, stack, entreprise..." aria-label="Recherche de job" />
          <button className="btn-primary">Rechercher</button>
        </div>
      </section>

      <section className="jobs-grid">
        {/* Ici viendra la boucle sur tes offres API */}
        <div className="job-card">
          <div className="job-badge">Nouveau</div>
          <h3>Fullstack Developer (Node/React)</h3>
          <p className="company">WeLoveDevs - Lille</p>
          <div className="tags">
            <span>Remote</span>
            <span>45-55k€</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;