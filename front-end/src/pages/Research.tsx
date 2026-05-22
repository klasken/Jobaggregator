import React, { useState, useEffect, useRef } from 'react';
import './Research.css';
import {
  Search, MapPin, DollarSign, Clock, Sparkles,
  Building2, Share2, Bookmark, Users, Star, ArrowRight, X, ArrowLeft
} from "lucide-react";

export const jobs = [
  {
    id: 1, title: "Senior Frontend Developer", company: "TechVision", logo: "TV", location: "Paris", salary: "55-70k€", type: "CDI", remote: true, new: true, postedDate: "Il y a 2 jours", description: "Nous recherchons un développeur Frontend senior passionné par React et TypeScript pour rejoindre notre équipe produit en pleine croissance.", requirements: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"], aiSummary: "Poste senior avec focus sur l'architecture frontend moderne. Stack technique alignée avec votre profil.", experience: "5+ ans", teamSize: 8, applicants: 34, rating: 4.8, benefits: ["Télétravail flexible", "Formation continue", "Mutuelle premium"], companyDescription: "TechVision est une scale-up française spécialisée dans les solutions SaaS pour l'e-commerce.",
  },
  {
    id: 2, title: "DevOps Engineer", company: "CloudStack", logo: "CS", location: "Lyon", salary: "60-75k€", type: "CDI", remote: false, new: false, postedDate: "Il y a 5 jours", description: "Rejoignez notre équipe DevOps pour gérer notre infrastructure cloud.", requirements: ["Kubernetes", "AWS", "Docker", "Terraform"], aiSummary: "Infrastructure à grande échelle. Migration AWS en cours.", experience: "3-5 ans", teamSize: 12, applicants: 28, rating: 4.6, benefits: ["RTT", "Matériel pro", "Conférences tech"], companyDescription: "CloudStack accompagne les grandes entreprises dans leur transformation cloud.",
  }
];

interface ResearchProps {
  onNavigate: (page: any) => void;
  t: any;
  savedJobs: number[];
  setSavedJobs: React.Dispatch<React.SetStateAction<number[]>>;
  userData: any;
  homeFilters: { role: string; city: string };
  setHomeFilters: (filters: { role: string; city: string }) => void;
  selectedJobId?: number | null;
}

const Research: React.FC<ResearchProps> = ({
  onNavigate, t, savedJobs, setSavedJobs, userData, homeFilters, setHomeFilters, selectedJobId
}) => {
  const [backendJobs, setBackendJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [motivationFile, setMotivationFile] = useState<File | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  const jobCardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const listContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUrl = userData?.email
      ? `http://localhost:8000/api/recommendations/${encodeURIComponent(userData.email)}`
      : 'http://localhost:8000/api/dashboard/jobs';

    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBackendJobs(data);
          if (data.length > 0) setSelectedJob(data[0]);
        }
      })
      .catch(err => console.error("ERREUR API :", err));
  }, [userData?.email]);

  useEffect(() => {
    if (!selectedJobId || backendJobs.length === 0) return;
    const job = backendJobs.find(j => j.id === selectedJobId);
    if (job) {
      setSelectedJob(job);
      setIsMobileDetailsOpen(true);
      setTimeout(() => {
        const card = jobCardRefs.current[selectedJobId];
        if (card && listContainerRef.current) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('highlight-flash');
          setTimeout(() => card.classList.remove('highlight-flash'), 1500);
        }
      }, 100);
    }
  }, [selectedJobId, backendJobs]);

  useEffect(() => {
    if (homeFilters?.role || homeFilters?.city) {
      if (homeFilters.role) setSearchQuery(homeFilters.role);
      if (homeFilters.city) setLocationQuery(homeFilters.city);
      setHomeFilters({ role: '', city: '' });
    }
  }, [homeFilters, setHomeFilters]);

  const toggleSaveJob = (id: number) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectJob = (job: any) => {
    setSelectedJob(job);
    setIsMobileDetailsOpen(true);
  };

  const submitApplication = async () => {
    if (!userData?.email) {
      alert("Vous devez être connecté pour postuler !");
      onNavigate('login');
      return;
    }

    if (!cvFile) {
      alert("Veuillez sélectionner votre CV avant d'envoyer.");
      return;
    }

    setIsApplying(true);
    try {
      const formData = new FormData();
      formData.append("user_email", userData.email);
      formData.append("job_id", selectedJob.id);
      formData.append("company", selectedJob.entreprise_nom || selectedJob.company);
      formData.append("position", selectedJob.titre || selectedJob.title);
      formData.append("message", coverLetter);
      formData.append("cv", cvFile);
      if (motivationFile) {
        formData.append("motivation_letter", motivationFile);
      }

      const response = await fetch("http://localhost:8000/api/applications", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        alert("Candidature envoyée avec succès ! Retrouvez-la dans votre Tableau de bord.");
        setShowApplyModal(false);
        setCoverLetter("");
        setCvFile(null);
        setMotivationFile(null);
      } else {
        alert("Une erreur est survenue lors de l'envoi.");
      }
    } catch (error) {
      console.error(error);
      alert("Impossible de joindre le serveur.");
    } finally {
      setIsApplying(false);
    }
  };

  const filteredJobs = backendJobs.filter(job => {
    const titre = job.titre || "";
    const entreprise = job.entreprise_nom || "";
    const typeContrat = job.contract_type || "";
    const lieu = job.location || "";
    const matchesSearch = titre.toLowerCase().includes(searchQuery.toLowerCase()) || entreprise.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = lieu.toLowerCase().includes(locationQuery.toLowerCase());
    const matchesFilter = filterType === "all" || typeContrat.includes(filterType);
    return matchesSearch && matchesLocation && matchesFilter;
  });

  return (
    <div className="research-page">
      <section className={`jobs-list-container ${isMobileDetailsOpen ? 'mobile-hidden' : ''}`}>
        <header className="list-header">
          <div className="header-top">
            <h1>{t.jobs || "Offres"}</h1>
            <span className="count">{filteredJobs.length} {t.offersCountLabel || "offres"}</span>
          </div>

          <div className="search-bar-row-wrapper">
            <div className="search-box-wrapper">
              <Search className="s-icon" size={18} />
              <input type="text" placeholder={t.searchPlaceholderJob || "Poste, entreprise..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="search-box-wrapper">
              <MapPin className="s-icon" size={18} />
              <input type="text" placeholder={t.searchPlaceholderCity || "Ville, région..."} value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} />
            </div>
          </div>

          <div className="filter-chips">
            {["all", "CDI", "Stage", "Freelance"].map(t_chip => (
              <button key={t_chip} className={`chip ${filterType === t_chip ? 'active' : ''}`} onClick={() => setFilterType(t_chip)}>
                {t_chip === "all" ? (t.filterAll || "Tous") : t_chip}
              </button>
            ))}
          </div>
        </header>

        <div ref={listContainerRef} className="scrollable-list">
          {filteredJobs.map(job => (
            <div key={job.id} ref={el => { jobCardRefs.current[job.id] = el; }} className={`job-card-mini ${selectedJob && selectedJob.id === job.id ? 'active' : ''}`} onClick={() => handleSelectJob(job)}>
              <div className="card-head">
                <div className="c-logo">{job.logo || "DB"}</div>
                <div className="c-info">
                  <h4>{job.titre || job.title}</h4>
                  <p>{job.entreprise_nom || job.company}</p>
                </div>
                <Bookmark size={18} className={`save-icon ${savedJobs.includes(job.id) ? 'saved' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }} />
              </div>
              <div className="card-tags">
                <span><MapPin size={12} /> {job.location}</span>
                <span><DollarSign size={12} /> {job.salaire_min > 0 ? `${job.salaire_min}k€` : (job.salary || "Non communiqué")}</span>
              </div>
              <div className="ai-mini-match">
                <Sparkles size={14} />
                <span>{Math.round(job.matching_score || 85)}% {t.aiMatchLabel || "de compatibilité"}</span>
              </div>
              <div className="card-foot">
                <span className="badge-type">{job.contract_type || job.type || "Non spécifié"}</span>
                <span className="rating"><Star size={12} fill="currentColor" /> {job.rating || "5.0"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`job-details-panel ${isMobileDetailsOpen ? 'mobile-visible' : ''}`}>
        {selectedJob ? (
          <>
            <div className="mobile-back-nav">
              <button className="btn-back" onClick={() => setIsMobileDetailsOpen(false)}>
                <ArrowLeft size={20} /> Retour aux offres
              </button>
            </div>

            <div className="details-header">
              <div className="d-company-row">
                <div className="d-logo">
                  {selectedJob.logo ? <span>{selectedJob.logo}</span> : <Building2 size={24} />}
                </div>
                <div className="d-title">
                  <h2>{selectedJob.titre || selectedJob.title}</h2>
                  <p><Building2 size={16} /> {selectedJob.entreprise_nom || selectedJob.company}</p>
                </div>
                <div className="d-actions">
                  <button className="btn-circle"><Share2 size={18} /></button>
                  <button className={`btn-circle ${savedJobs.includes(selectedJob.id) ? 'saved' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSaveJob(selectedJob.id); }}>
                    <Bookmark size={18} fill={savedJobs.includes(selectedJob.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>

            <div className="details-content">
              <div className="ai-summary-box">
                <div className="ai-title"><Sparkles size={16} /> {t.aiAnalysisTitle || "Recommandation IA"}</div>
                {selectedJob.aiSummary && <p>{selectedJob.aiSummary}</p>}
                {!selectedJob.aiSummary && <p>Cette offre provient de {selectedJob.source || "WeLoveDevs"}.</p>}

                <div className="ai-match-container">
                  <div className="ai-match-header">
                    <span><Sparkles size={16} />{t.skillsMatch || "Correspondance des compétences"}</span>
                    <span>{Math.round(selectedJob.matching_score || 85)}%</span>
                  </div>
                  <div className="ai-match-bar-bg">
                    <div className="ai-match-bar-fill" style={{ width: `${Math.round(selectedJob.matching_score || 85)}%` }} />
                  </div>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item"><MapPin size={16}/> <span>{selectedJob.location}</span></div>
                <div className="info-item"><DollarSign size={16}/><span>{selectedJob.salaire_min > 0 ? `${selectedJob.salaire_min}k€ - ${selectedJob.salaire_max}k€` : (selectedJob.salary || "Non communiqué")}</span></div>
                <div className="info-item"><Clock size={16}/> <span>{selectedJob.experience || `Posté le ${selectedJob.date || "Récemment"}`}</span></div>
                {selectedJob.teamSize && (<div className="info-item"><Users size={16}/> <span>{selectedJob.teamSize} {t.teamSizeUnit || "pers."}</span></div>)}
              </div>

              <div className="desc-section">
                <h3>{t.descriptionLabel || "Description"}</h3>
                {selectedJob.description ? (<div dangerouslySetInnerHTML={{ __html: selectedJob.description }} />) : (<p>Aucune description disponible pour ce poste.</p>)}
              </div>

              {(selectedJob.competences || selectedJob.requirements) && (
                <div className="skills-section">
                  <h3>{t.languagesLabel || "Compétences"}</h3>
                  <div className="skills-wrap">
                    {selectedJob.competences && typeof selectedJob.competences === 'string'
                      ? selectedJob.competences.split(',').map((c: string) => (<span key={c} className="skill-tag">{c.trim()}</span>))
                      : selectedJob.requirements?.map((r: string) => (<span key={r} className="skill-tag">{r}</span>))
                    }
                  </div>
                </div>
              )}
            </div>

            <footer className="details-footer">
              <button className="btn-apply" onClick={() => setShowApplyModal(true)}>
                {t.applyBtn || "Postuler maintenant"} <ArrowRight size={18} />
              </button>
            </footer>

            {showApplyModal && (
              <div className="apply-modal-backdrop" onClick={() => setShowApplyModal(false)}>
                <div className="apply-modal-card" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Postuler à cette offre</h2>
                    <button onClick={() => setShowApplyModal(false)} className="btn-close-modal">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="modal-job-summary">
                    <strong>{selectedJob.titre || selectedJob.title}</strong>
                    <span>chez {selectedJob.entreprise_nom || selectedJob.company}</span>
                  </div>

                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>Curriculum Vitae (CV) *</label>
                        {/* CHANGEMENT ICI : accept="*" pour tout autoriser */}
                        <input 
                          type="file" 
                          accept="*" 
                          onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
                          style={{ fontSize: '0.85rem', padding: '6px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-light)', color: 'var(--text-dark)' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>Lettre de motivation</label>
                        {/* CHANGEMENT ICI : accept="*" pour tout autoriser */}
                        <input 
                          type="file" 
                          accept="*" 
                          onChange={(e) => setMotivationFile(e.target.files ? e.target.files[0] : null)}
                          style={{ fontSize: '0.85rem', padding: '6px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-light)', color: 'var(--text-dark)' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Message d'accompagnement (optionnel)</label>
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Expliquez brièvement pourquoi ce poste vous intéresse..."
                        style={{ height: '80px' }}
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button onClick={() => setShowApplyModal(false)} className="btn-modal-cancel">
                      Annuler
                    </button>
                    <button onClick={submitApplication} disabled={isApplying} className="btn-modal-confirm">
                      {isApplying ? "Envoi en cours..." : "Confirmer ma candidature"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-panel-prompt">
            {t.selectJobPrompt || "Sélectionnez une offre pour voir les détails"}
          </div>
        )}
      </section>
    </div>
  );
};

export default Research;