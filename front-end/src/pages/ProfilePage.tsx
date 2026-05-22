import React, { useState, useRef } from 'react';
import './ProfilePage.css';
import { Camera, Check, Plus, X, Search } from "lucide-react";

interface ProfileProps {
  onNavigate: (page: string) => void;
  userData: any;
  setUserData: (data: any) => void;
  t: any;
}

const ALL_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust", "Dart", "Scala", "Elixir", "Haskell", "Lua", "Perl", "R", "Objective-C", "SQL", "NoSQL", "Bash", "Shell", "PowerShell", "HTML", "CSS", "Sass", "Less",
  "React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js", "Gatsby", "Ember.js", "Backbone.js", "jQuery", "Bootstrap", "Tailwind CSS", "Material-UI", "Chakra UI", "Redux", "Zustand", "Webpack", "Vite", "Babel", "Jest", "Cypress",
  "Node.js", "Express.js", "NestJS", "Django", "Flask", "FastAPI", "Spring Boot", "Laravel", "Symfony", "Ruby on Rails", "ASP.NET", "GraphQL", "REST API", "gRPC", "Apollo", "Prisma", "TypeORM", "Sequelize", "Mongoose",
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "MariaDB", "Oracle", "SQL Server", "DynamoDB", "Firebase", "Supabase", "Neo4j", "SQLite",
  "AWS", "Google Cloud (GCP)", "Microsoft Azure", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI", "Travis CI", "Nginx", "Apache", "Linux", "Unix", "Vagrant", "Prometheus", "Grafana", "Datadog", "Splunk",
  "React Native", "Flutter", "Ionic", "Xamarin", "Android", "iOS", "Unity", "Unreal Engine", "Figma", "WordPress", "Shopify", "Magento", "Web3", "Solidity", "Smart Contracts", "Machine Learning", "TensorFlow", "PyTorch", "Pandas", "Scikit-Learn", "Data Science", "Data Engineering", "Hadoop", "Spark", "Kafka", "RabbitMQ"
].sort();

const ProfilePage: React.FC<ProfileProps> = ({ onNavigate, userData, setUserData, t }) => {
  const [tempData, setTempData] = useState<any>(() => {
    let compArray: string[] = [];
    if (userData?.competences) {
      compArray = typeof userData.competences === 'string'
        ? userData.competences.split(',').map((s: string) => s.trim()).filter(Boolean)
        : userData.competences;
    }
    return {
      ...userData,
      nom: userData?.nom || "Utilisateur",
      email: userData?.email || "",
      competences: compArray,
      experience: userData?.experience || "Junior (0-2 ans)"
    };
  });

  const [skillSearch, setSkillSearch] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempData({ ...tempData, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill: string) => {
    const newSkills = tempData.competences.includes(skill)
      ? tempData.competences.filter((s: string) => s !== skill)
      : [...tempData.competences, skill];
    setTempData({ ...tempData, competences: newSkills });
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    const skillsString = tempData.competences.join(', ');
    try {
      const response = await fetch(`/api/dashboard/user/${tempData.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: tempData.nom, competences: skillsString }),
      });
      if (response.ok) {
        setUserData({
          ...tempData,
          name: tempData.nom,
          prenom: tempData.nom.trim().split(' ')[0],
          competences: skillsString
        });
        setSaveStatus('ok');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  };

  const filteredSkills = ALL_SKILLS.filter(s =>
    s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className="profile-container">
      <main className="profile-main">
        <header className="profile-header">
          <h1>Mon Profil</h1>
          <p>Personnalisez votre identité de développeur.</p>
        </header>

        <div className="profile-content-grid">

          {/* ── Avatar + Nom ── */}
          <section className="profile-card hero-card">
            <div className="avatar-edit-wrapper">
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
              <div className="avatar-circle">
                {tempData.avatar
                  ? <img src={tempData.avatar} alt="Avatar" />
                  : <div className="initials">{tempData.nom.charAt(0).toUpperCase()}</div>
                }
                <button className="camera-overlay" onClick={() => fileInputRef.current?.click()}>
                  <Camera size={16} />
                </button>
              </div>
            </div>
            <div className="hero-info">
              <input
                type="text"
                className="edit-name-input"
                value={tempData.nom}
                onChange={(e) => setTempData({ ...tempData, nom: e.target.value })}
                placeholder="Votre nom"
              />
              <p className="user-email-text">{tempData.email}</p>
            </div>
          </section>

          {/* ── Compétences ── */}
          <section className="profile-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h3 style={{ margin: 0 }}>Mes Hard Skills</h3>
              <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>
                {tempData.competences.length} sélectionnée(s)
              </span>
            </div>
            <p className="card-subtitle">Cliquez pour ajouter ou retirer une compétence.</p>

            {/* Barre de recherche */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', marginBottom: '14px' }}>
              <Search size={15} style={{ color: '#64748b', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Rechercher une compétence..."
                value={skillSearch}
                onChange={e => setSkillSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'inherit', fontSize: '0.9rem' }}
              />
              {skillSearch && (
                <button onClick={() => setSkillSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0, lineHeight: 1 }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Grille scrollable */}
            <div className="interactive-skills-grid" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
              {filteredSkills.length > 0 ? filteredSkills.map(skill => (
                <button
                  key={skill}
                  className={`skill-pill ${tempData.competences.includes(skill) ? 'active' : ''}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                  {tempData.competences.includes(skill) ? <X size={13} /> : <Plus size={13} />}
                </button>
              )) : (
                <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.9rem' }}>Aucune compétence trouvée.</p>
              )}
            </div>
          </section>

          {/* ── Séniorité ── */}
          <section className="profile-card">
            <h3>Séniorité</h3>
            <div className="select-wrapper">
              <select
                className="modern-select"
                value={tempData.experience}
                onChange={(e) => setTempData({ ...tempData, experience: e.target.value })}
              >
                <option>Junior (0-2 ans)</option>
                <option>Intermédiaire (2-5 ans)</option>
                <option>Sénior (5+ ans)</option>
              </select>
            </div>
          </section>
        </div>

        <div className="profile-actions-footer">
          {saveStatus === 'ok' && (
            <span style={{ color: '#22c55e', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={15} /> Profil sauvegardé !
            </span>
          )}
          {saveStatus === 'error' && (
            <span style={{ color: '#ef4444', fontSize: '0.9rem' }}>Erreur lors de la sauvegarde.</span>
          )}
          <button className="save-profile-btn" onClick={handleSave} disabled={saveStatus === 'saving'}>
            <Check size={20} />
            {saveStatus === 'saving' ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
