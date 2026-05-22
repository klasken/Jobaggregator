import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import {
  CheckCircle, Clock, XCircle, Send, Search, Filter, Bookmark
} from "lucide-react";

// On importe BarChart et Bar pour faire des diagrammes en bâtons
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface DashboardProps {
  onNavigate: (page: any) => void;
  t: any;
  savedJobs: number[];
  userData: any;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, t, savedJobs, userData }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Erreur chargement jobs:", err));

    if (userData?.email) {
      fetch(`http://localhost:8000/api/applications/${encodeURIComponent(userData.email)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setApplications(data);
          }
        })
        .catch(err => console.error("Erreur chargement candidatures:", err));
    }
  }, [userData?.email]);

  const favoriteJobs = jobs.filter(job => savedJobs.includes(job.id));

  const stats = {
    envoyees: applications.length,
    attente: applications.filter(app => app.status === "En attente").length,
    acceptees: applications.filter(app => app.status === "Accepté").length,
    refusees: applications.filter(app => app.status === "Refusé").length
  };

  // --- PRÉPARATION DES DONNÉES DU GRAPHIQUE ---
  // On crée un tableau avec des 0 par défaut pour faire joli
  const dataBarres = [
    { mois: 'Janv.', postulees: 0, positives: 0 },
    { mois: 'Févr.', postulees: 0, positives: 0 },
    { mois: 'Mars', postulees: 0, positives: 0 },
    { mois: 'Avril', postulees: 0, positives: 0 },
    { mois: 'Mai', postulees: 0, positives: 0 },
    { mois: 'Juin', postulees: 0, positives: 0 } // On va lier ce dernier mois à vos vraies données !
  ];

  // On remplit le mois en cours avec le VRAI total de vos candidatures
  // Si vous avez 0 candidature (applications.length === 0), ça restera à 0 !
  dataBarres[5].postulees = applications.length;
  dataBarres[5].positives = applications.filter(app => app.status === "Accepté").length;

  return (
    <div className="dash-container">
      <main className="dash-main">
        <header className="dash-header">
          <h1>Bonjour {userData?.nom || userData?.name || "Utilisateur"} 👋</h1>
          <p>{t.dashSub || "Suivez l'état de vos candidatures en temps réel."}</p>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue"><Send size={20} /></div>
            <div className="stat-info"><h3>{stats.envoyees}</h3><p>{t.statSent || "Envoyées"}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Clock size={20} /></div>
            <div className="stat-info"><h3>{stats.attente}</h3><p>{t.statPending || "En attente"}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><CheckCircle size={20} /></div>
            <div className="stat-info"><h3>{stats.acceptees}</h3><p>{t.statAccepted || "Acceptées"}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red"><XCircle size={20} /></div>
            <div className="stat-info"><h3>{stats.refusees}</h3><p>{t.statRefused || "Refusées"}</p></div>
          </div>
        </div>

        {/* --- DÉBUT DU GRAPHIQUE EN BARRES --- */}
        <section className="app-list-section" style={{ marginTop: '32px' }}>
          <div className="section-head">
            <h2>Évolution de mes candidatures</h2>
          </div>
          <div style={{ width: '100%', height: 350, backgroundColor: 'var(--card-bg, #ffffff)', padding: '20px', borderRadius: '12px', marginTop: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBarres} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="mois" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />

                {/* Barre 1 : Offres postulées */}
                <Bar
                  dataKey="postulees"
                  name="Offres postulées"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />

                {/* Barre 2 : Réponses positives */}
                <Bar
                  dataKey="positives"
                  name="Réponses positives"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        {/* --- FIN DU GRAPHIQUE --- */}

        <section className="app-list-section" style={{ marginTop: '32px' }}>
          <div className="section-head">
            <h2>{t.myApplications || "Mes candidatures"}</h2>
            <div className="head-actions">
              <div className="search-mini"><Search size={16}/><input type="text" placeholder={t.searchPlaceholderMini || "Rechercher..."}/></div>
              <button className="btn-filter-mini"><Filter size={16}/> {t.filterBtn || "Filtrer"}</button>
            </div>
          </div>

          <div className="app-table-wrapper">
            <table className="app-table">
              <thead>
                <tr>
                  <th>{t.thCompany || "Entreprise"}</th>
                  <th>{t.thPosition || "Poste"}</th>
                  <th>{t.thDate || "Date d'envoi"}</th>
                  <th>{t.thStatus || "Statut"}</th>
                  <th>{t.thAction || "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? applications.map(app => (
                  <tr key={app.id}>
                    <td className="bold">{app.company}</td>
                    <td>{app.position}</td>
                    <td className="text-muted">{app.date}</td>
                    <td>
                      <span className={`status-badge ${app.color}`}>
                        {app.status}
                      </span>
                    </td>
                    <td><button className="btn-view">{t.detailsBtn || "Détails"}</button></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>
                      Aucune candidature trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="app-list-section favorites-block" style={{marginTop: '32px'}}>
          <div className="section-head">
            <h2>{t.favoriteOffers || "Offres favorites"}</h2>
            {favoriteJobs.length > 0 && (
              <div className="head-actions">
                <span className="count-tag" style={{fontSize: '0.8rem', opacity: 0.7}}>{favoriteJobs.length} {t.pinnedOffers || "offres épinglées"}</span>
              </div>
            )}
          </div>

          <div className="app-table-wrapper">
            {favoriteJobs.length > 0 ? (
              <table className="app-table">
                <thead>
                  <tr>
                    <th>{t.thCompany || "Entreprise"}</th>
                    <th>{t.thPosition || "Poste"}</th>
                    <th>{t.thLocation || "Lieu"}</th>
                    <th>{t.thSalary || "Salaire"}</th>
                    <th>{t.thAction || "Action"}</th>
                  </tr>
                </thead>
                <tbody>
                  {favoriteJobs.map(job => (
                    <tr key={job.id}>
                      <td className="bold">
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <Bookmark size={14} style={{color: '#3b82f6'}} fill="#3b82f6"/>
                          {job.entreprise_nom}
                        </div>
                      </td>
                      <td>{job.titre}</td>
                      <td className="text-muted">{job.location}</td>
                      <td><span className="salary-tag" style={{color: '#22c55e'}}>{job.salaire_min > 0 ? `${job.salaire_min}k€` : "Non communiqué"}</span></td>
                      <td><button className="btn-view" onClick={() => onNavigate('research')}>{t.viewOfferBtn || "Voir l'offre"}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state" style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
                <Bookmark size={40} style={{marginBottom: '16px', opacity: 0.2}} />
                <p>{t.emptyFavorites || "Vous n'avez aucune offre épinglée pour le moment."}</p>
                <button
                  className="btn-view"
                  style={{marginTop: '16px'}}
                  onClick={() => onNavigate('research')}
                >
                  {t.browseOffersBtn || "Parcourir les offres"}
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
