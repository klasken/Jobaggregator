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
  onNavigate: (page: any) => void;
  t: any;
  savedJobs: number[];
  setSavedJobs: React.Dispatch<React.SetStateAction<number[]>>;
  userData: any;
}

const Research: React.FC<ResearchProps> = ({ onNavigate, t, savedJobs, setSavedJobs, userData }) => {
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const toggleSaveJob = (id: number) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || job.type === filterType;
    return matchesSearch && matchesFilter;
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
            <p className="u-name">{userData.name}</p>
            <button className="u-logout" onClick={() => onNavigate('home')}><LogOut size={14} /> {t.logout}</button>
          </div>
        </div>
      </aside>

      <section className="jobs-list-container">
        <header className="list-header">
          <div className="header-top">
            <h1>{t.jobs}</h1>
            <span className="count">{filteredJobs.length} offres</span>
          </div>
          <div className="search-box-wrapper">
            <Search className="s-icon" size={18} />
            <input 
              type="text" 
              placeholder="Poste, entreprise..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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

        <div className="scrollable-list">
          {filteredJobs.map(job => (
            <div 
              key={job.id} 
              className={`job-card-mini ${selectedJob.id === job.id ? 'active' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              <div className="card-head">
                <div className="c-logo">{job.logo}</div>
                <div className="c-info">
                  <h4>{job.title}</h4>
                  <p>{job.company}</p>
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
              <div className="card-foot">
                <span className="badge-type">{job.type}</span>
                <span className="rating"><Star size={12} fill="currentColor" /> {job.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="job-details-panel">
        <div className="details-header">
          <div className="d-company-row">
            <div className="d-logo">{selectedJob.logo}</div>
            <div className="d-title">
              <h2>{selectedJob.title}</h2>
              <p><Building2 size={16} /> {selectedJob.company}</p>
            </div>
            <div className="d-actions">
              <button className="btn-circle"><Share2 size={18} /></button>
              <button 
                className={`btn-circle ${savedJobs.includes(selectedJob.id) ? 'saved' : ''}`}
                onClick={() => toggleSaveJob(selectedJob.id)}
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