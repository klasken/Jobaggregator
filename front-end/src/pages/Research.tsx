import React, { useState } from 'react';
import './Research.css';
import {
  Search, MapPin, DollarSign, Clock, Briefcase, Sparkles,
  Building2, Share2, Bookmark, Users, Home, User,
  Star, ArrowRight, LayoutDashboard, Bell, Settings, LogOut
} from "lucide-react";

export const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechVision",
    logo: "TV",
    location: "Paris",
    salary: "55-70k€",
    type: "CDI",
    remote: true,
    new: true,
    postedDate: "Il y a 2 jours",
    description: "Nous recherchons un développeur Frontend senior passionné par React et TypeScript pour rejoindre notre équipe produit en pleine croissance.",
    requirements: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    aiSummary: "Poste senior avec focus sur l'architecture frontend moderne. Stack technique alignée avec votre profil.",
    experience: "5+ ans",
    teamSize: 8,
    applicants: 34,
    rating: 4.8,
    benefits: ["Télétravail flexible", "Formation continue", "Mutuelle premium"],
    companyDescription: "TechVision est une scale-up française spécialisée dans les solutions SaaS pour l'e-commerce.",
  },
  {
    id: 2,
    title: "DevOps Engineer",
    company: "CloudStack",
    logo: "CS",
    location: "Lyon",
    salary: "60-75k€",
    type: "CDI",
    remote: false,
    new: false,
    postedDate: "Il y a 5 jours",
    description: "Rejoignez notre équipe DevOps pour gérer notre infrastructure cloud.",
    requirements: ["Kubernetes", "AWS", "Docker", "Terraform"],
    aiSummary: "Infrastructure à grande échelle. Migration AWS en cours.",
    experience: "3-5 ans",
    teamSize: 12,
    applicants: 28,
    rating: 4.6,
    benefits: ["RTT", "Matériel pro", "Conférences tech"],
    companyDescription: "CloudStack accompagne les grandes entreprises dans leur transformation cloud.",
  }
];

interface ResearchProps {
  onNavigate: (page: string) => void;
  t: any;
  savedJobs: number[];
  setSavedJobs: React.Dispatch<React.SetStateAction<number[]>>;
  userData: any;
  homeFilters: { role: string; city: string };
  setHomeFilters: (filters: { role: string; city: string }) => void;
}

const Research: React.FC<ResearchProps> = ({
  onNavigate,
  t,
  savedJobs,
  setSavedJobs,
  userData,
  homeFilters,
  setHomeFilters
}) => {
  const [backendJobs, setBackendJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // 1. Charger les offres (avec IA si l'utilisateur a un email)
  useEffect(() => {
    // Si on a l'email, on tape dans la route IA, sinon on prend la liste classique
    const fetchUrl = userData?.email
      ? `/api/recommendations/${userData.email}`
      : '/api/dashboard/jobs';

    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBackendJobs(data);
          if (data.length > 0) {
            setSelectedJob(data[0]);
          }
        }
      })
      .catch(err => console.error("Erreur lors de la récupération des jobs :", err));
  }, [userData]);

  // 2. Intercepter les filtres en provenance de la page d'accueil
  useEffect(() => {
    if (homeFilters?.role || homeFilters?.city) {
      if (homeFilters.role) setSearchQuery(homeFilters.role);
      if (homeFilters.city) setLocationQuery(homeFilters.city);

      // On réinitialise l'état de App.tsx pour éviter de bloquer les futures recherches
      setHomeFilters({ role: '', city: '' });
    }
  }, [homeFilters, setHomeFilters]);

  const toggleSaveJob = (id: number) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // 3. Logique de filtrage multi-critères synchronisée (Métier + Ville + Contrat)
  const filteredJobs = backendJobs.filter(job => {
    const titre = job.titre || "";
    const entreprise = job.entreprise_nom || "";
    const typeContrat = job.contract_type || "";
    const lieu = job.location || "";

    const matchesSearch = titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entreprise.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtrage par ville
    const matchesLocation = lieu.toLowerCase().includes(locationQuery.toLowerCase());

    const matchesFilter = filterType === "all" || typeContrat.includes(filterType);

    return matchesSearch && matchesLocation && matchesFilter;
  });

  return (
    <div className="research-page">
      <aside className="research-sidebar">
        <div className="sidebar-brand" onClick={() => onNavigate('home')} style={{cursor: 'pointer'}}>
          <div className="brand-icon"><Briefcase size={20} /></div>
          <span>EpiDevs</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => onNavigate('home')}><Home size={18} /> Accueil</div>
          <div className="nav-item" onClick={() => onNavigate('dashboard')}><LayoutDashboard size={18} /> {t.dashboard}</div>
          <div className="nav-item active"><Briefcase size={18} /> {t.jobs}</div>
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
            <p className="u-name">{userData?.name || "Utilisateur"}</p>
            <button className="u-logout" onClick={() => onNavigate('logout')}><LogOut size={14} /> {t.logout}</button>
          </div>
        </div>
      </aside>

      <section className="jobs-list-container">
        <header className="list-header">
          <div className="header-top">
            <h1>{t.jobs}</h1>
            <span className="count">{filteredJobs.length} offres</span>
          </div>

          {/* Double barre de recherche alignée (Métier + Ville) */}
          <div className="search-bar-row-wrapper" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div className="search-box-wrapper" style={{ flex: 1, marginBottom: 0 }}>
              <Search className="s-icon" size={18} />
              <input
                type="text"
                placeholder="Poste, entreprise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="search-box-wrapper" style={{ flex: 1, marginBottom: 0 }}>
              <MapPin className="s-icon" size={18} style={{ color: '#64748b' }} />
              <input
                type="text"
                placeholder="Ville, région..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-chips">
            {["all", "CDI", "Stage", "Freelance"].map(t_chip => (
              <button
                key={t_chip}
                className={`chip ${filterType === t_chip ? 'active' : ''}`}
                onClick={() => setFilterType(t_chip)}
              >
                {t_chip === "all" ? "Tous" : t_chip}
              </button>
            ))}
          </div>
        </header>

        <div className="scrollable-list" style={{ flexGrow: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 220px)', paddingBottom: '40px' }}>
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className={`job-card-mini ${selectedJob.id === job.id ? 'active' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              <div className="card-head">
                <div className="c-logo">{job.logo}</div>
                <div className="c-info">
                  <h4>{job.titre}</h4>
                  <p>{job.entreprise_nom}</p>
                </div>
                <Bookmark
                  size={18}
                  className={`save-icon ${savedJobs.includes(job.id) ? 'saved' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }}
                />
              </div>
              <div className="card-tags">
                <span><MapPin size={12} /> {job.location}</span>
                <span><DollarSign size={12} /> {job.salary}</span>
              </div>

              {/* --- Score IA dans la mini carte --- */}
              <div className="ai-mini-match" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
                <Sparkles size={14} color="#ec4899" />
                <span style={{ color: '#ec4899', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {job.matching_score || 85}% de compatibilité
                </span>
              </div>

              <div className="card-foot" style={{ marginTop: '12px' }}>
                <span className="badge-type">{job.contract_type || "Non spécifié"}</span>
                <span className="rating"><Star size={12} fill="currentColor" /> 5.0</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Panneau de droite contenant les détails de l'offre sélectionnée */}
      <section className="job-details-panel" style={{ overflowY: 'auto', height: '100vh', paddingBottom: '80px' }}>
        {selectedJob ? (
          <>
            <div className="details-header">
              <div className="d-company-row">
                <div className="d-logo" style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={24} />
                </div>
                <div className="d-title">
                  <h2>{selectedJob.titre}</h2>
                  <p><Building2 size={16} /> {selectedJob.entreprise_nom}</p>
                </div>
                <div className="d-actions">
                  <button className="btn-circle"><Share2 size={18} /></button>
                  <button
                    className={`btn-circle ${savedJobs.includes(selectedJob.id) ? 'saved' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleSaveJob(selectedJob.id); }}
                  >
                    <Bookmark size={18} fill={savedJobs.includes(selectedJob.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>

            <div className="details-content">
              <div className="ai-summary-box">
                <div className="ai-title"><Sparkles size={16} /> Recommandation IA</div>
                <p>Cette offre provient de {selectedJob.source || "WeLoveDevs"}.</p>

                {/* --- NOUVEAU : Barre de progression IA (Rose) --- */}
                <div className="ai-match-container">
                  <div className="ai-match-header">
                    <span>Correspondance des compétences</span>
                    <span>{selectedJob.matching_score || 85}%</span>
                  </div>
                  <div className="ai-match-bar-bg">
                    <div
                      className="ai-match-bar-fill"
                      style={{ width: `${selectedJob.matching_score || 85}%` }}
                    ></div>
                  </div>
                </div>
                {/* ------------------------------------------------ */}
              </div>

              <div className="info-grid">
                <div className="info-item"><MapPin size={16}/> <span>{selectedJob.location}</span></div>
                <div className="info-item"><DollarSign size={16}/> <span>{selectedJob.salaire_min > 0 ? `${selectedJob.salaire_min}€ - ${selectedJob.salaire_max}€` : "Non renseigné"}</span></div>
                <div className="info-item"><Clock size={16}/> <span>Posté le {selectedJob.date || "Récemment"}</span></div>
              </div>

              <div className="desc-section">
                <h3>Description</h3>
                <div dangerouslySetInnerHTML={{ __html: selectedJob.description }} />
              </div>

              {selectedJob.competences && (
                <div className="skills-section">
                  <h3>Compétences</h3>
                  <div className="skills-wrap">
                    {selectedJob.competences.split(',').map((c: string) => (
                      <span key={c} className="skill-tag">{c.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <footer className="details-footer">
              <button
                className="btn-apply"
                onClick={() => {
                  const directUrl = selectedJob.url || selectedJob.url_directe || `https://welovedevs.com/app/jobs/${selectedJob.id}`;
                  if (directUrl) {
                    window.open(directUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    alert("Lien de postulation non disponible pour cette offre.");
                  }
                }}
              >
                <Bookmark size={18} fill={savedJobs.includes(selectedJob.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>

        <div className="details-content">
          <div className="ai-summary-box">
            <div className="ai-title"><Sparkles size={16} /> Analyse IA</div>
            <p>{selectedJob.aiSummary}</p>
          </div>

          <div className="info-grid">
            <div className="info-item"><MapPin size={16}/> <span>{selectedJob.location}</span></div>
            <div className="info-item"><DollarSign size={16}/> <span>{selectedJob.salary}</span></div>
            <div className="info-item"><Clock size={16}/> <span>{selectedJob.experience}</span></div>
            <div className="info-item"><Users size={16}/> <span>{selectedJob.teamSize} pers.</span></div>
          </div>

          <div className="desc-section">
            <h3>Description</h3>
            <p>{selectedJob.description}</p>
          </div>

          <div className="skills-section">
            <h3>Compétences</h3>
            <div className="skills-wrap">
              {selectedJob.requirements.map(r => <span key={r} className="skill-tag">{r}</span>)}
            </div>
          </div>
        </div>

        <footer className="details-footer">
          <button className="btn-apply">Postuler maintenant <ArrowRight size={18} /></button>
        </footer>
      </section>
    </div>
  );
};

export default Research;
