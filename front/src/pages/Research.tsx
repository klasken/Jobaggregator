import React, { useState } from 'react';
import './Research.css';

const Research = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="research-page">
      <div className="research-header">
        <div className="container">
          <h1>Explorer les opportunités</h1>
          <div className="search-box-wrapper">
            <input 
              type="text" 
              placeholder="Rechercher un poste (ex: React, Python, Cloud...)" 
              aria-label="Recherche"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-search">Trouver</button>
          </div>
        </div>
      </div>

      <div className="container main-layout">
        <aside className="filters-panel" role="complementary">
          <h3>Filtres avancés</h3>
          <div className="filter-group">
            <label htmlFor="contract">Type de contrat</label>
            <select id="contract">
              <option value="cdi">CDI</option>
              <option value="cdd">CDD</option>
              <option value="internship">Stage</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Salaire minimum</label>
            <input type="range" min="30" max="100" step="5" />
            <div className="range-labels"><span>30k</span><span>100k+</span></div>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input type="checkbox" /> Télétravail autorisé
            </label>
          </div>
        </aside>

        <section className="results-panel" role="main">
          <div className="results-meta">
            <strong>128 offres</strong> correspondant à votre recherche
          </div>

          <div className="offers-list">
            {[1, 2, 3, 4, 5].map((i) => (
              <article key={i} className="offer-card-large">
                <div className="offer-body">
                  <div className="company-logo-placeholder"></div>
                  <div className="offer-content">
                    <span className="offer-tag">Nouveau</span>
                    <h3>Senior Fullstack Developer (H/F)</h3>
                    <p className="company-info">🚀 TechLead AI • Paris / Remote</p>
                    <div className="offer-details-row">
                      <span>Full-time</span>
                      <span>45k - 60k €</span>
                      <span>Il y a 2h</span>
                    </div>
                  </div>
                </div>
                <div className="offer-footer">
                  <button className="btn-view-details">Voir l'offre</button>
                  <button className="btn-save">⭐</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Research;