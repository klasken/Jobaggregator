import React, { useState } from 'react';
import './Auth.css';
import { Mail, Lock, User, Rocket, ArrowRight, ArrowLeft, Moon, Sun, Briefcase, CheckCircle, Search } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (email: string, isRegister?: boolean) => void;
  theme: string;
  setTheme: (t: string) => void;
  initialStep?: 'login' | 'register';
  t?: any;
}

// Une grande liste de compétences (vous pouvez en ajouter autant que vous voulez ici)
const ALL_SKILLS = [
  // Langages
  "JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust", "Dart", "Scala", "Elixir", "Haskell", "Lua", "Perl", "R", "Objective-C", "SQL", "NoSQL", "Bash", "Shell", "PowerShell", "HTML", "CSS", "Sass", "Less",
  // Front-end
  "React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js", "Gatsby", "Ember.js", "Backbone.js", "jQuery", "Bootstrap", "Tailwind CSS", "Material-UI", "Chakra UI", "Redux", "Zustand", "Webpack", "Vite", "Babel", "Jest", "Cypress",
  // Back-end
  "Node.js", "Express.js", "NestJS", "Django", "Flask", "FastAPI", "Spring Boot", "Laravel", "Symfony", "Ruby on Rails", "ASP.NET", "GraphQL", "REST API", "gRPC", "Apollo", "Prisma", "TypeORM", "Sequelize", "Mongoose",
  // Base de données
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "MariaDB", "Oracle", "SQL Server", "DynamoDB", "Firebase", "Supabase", "Neo4j", "SQLite",
  // Cloud & DevOps
  "AWS", "Google Cloud (GCP)", "Microsoft Azure", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI", "Travis CI", "Nginx", "Apache", "Linux", "Unix", "Vagrant", "Prometheus", "Grafana", "Datadog", "Splunk",
  // Mobile & Divers
  "React Native", "Flutter", "Ionic", "Xamarin", "Android", "iOS", "Unity", "Unreal Engine", "Figma", "WordPress", "Shopify", "Magento", "Web3", "Solidity", "Smart Contracts", "Machine Learning", "TensorFlow", "PyTorch", "Pandas", "Scikit-Learn", "Data Science", "Data Engineering", "Hadoop", "Spark", "Kafka", "RabbitMQ"
].sort(); // On trie par ordre alphabétique pour s'y retrouver

const Auth: React.FC<AuthProps> = ({ onLoginSuccess, theme, setTheme, initialStep = 'login' }) => {

  const [step, setStep] = useState<'login' | 'register' | 'onboarding'>(initialStep);

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedPostTypes, setSelectedPostTypes] = useState<string[]>([]);

  // Nouvel état pour la barre de recherche des compétences
  const [skillSearch, setSkillSearch] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const postTypes = ["CDI", "Freelance", "Remote", "Stage", "Alternance", "CDD"];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const togglePostType = (type: string) => {
    setSelectedPostTypes(prev => prev.includes(type) ? prev.filter(tItem => tItem !== type) : [...prev, type]);
  };

  // On filtre la grande liste en fonction de ce que l'utilisateur tape
  const filteredSkills = ALL_SKILLS.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        onLoginSuccess(email, false);
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Erreur d'identifiants");
      }
    } catch (error) {
      alert("Impossible de contacter le serveur.");
    }
  };

  const handleRegister = async () => {
    try {
      const competencesString = selectedSkills.join(', ');

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: fullName,
          email,
          password,
          competences: competencesString
        }),
      });

      if (response.ok) {
        try {
          const loginResponse = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            localStorage.setItem('token', loginData.access_token);
            onLoginSuccess(email, true);
          } else {
            alert("Compte créé avec succès ! Connectez-vous.");
            setStep('login');
          }
        } catch (loginError) {
          setStep('login');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.detail || "Erreur lors de l'inscription");
      }
    } catch (error: any) {
      console.error("Erreur serveur", error);
      alert(error.message || "Impossible de se connecter au serveur pour l'inscription.");
    }
  };

  return (
    <div className="auth-container">
      <button className="theme-toggle-mini" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="background-dots"></div>

      <div className="auth-card">
        {step === 'login' && (
          <div className="auth-step-fade">
            <div className="auth-header">
              <div className="auth-logo"><Briefcase size={22} /></div>
              <h1 className="brand-name">JobyFind</h1>
              <p>Connectez-vous pour accéder à vos offres.</p>
            </div>
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="field-icon" size={18} />
                <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <Lock className="field-icon" size={18} />
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <button className="btn-primary" onClick={handleLogin}>
              Se connecter <Rocket size={18} />
            </button>
            <p className="footer-text">
              Pas de compte ? <a onClick={() => setStep('register')}>Créer un compte</a>
            </p>
          </div>
        )}

        {step === 'register' && (
          <div className="auth-step-fade">
            <div className="auth-header">
              <h1 className="brand-name">Rejoindre JobyFind</h1>
              <p>Créez votre profil en quelques secondes.</p>
            </div>
            <div className="input-group">
              <label>Nom complet</label>
              <div className="input-wrapper">
                <User className="field-icon" size={18} />
                <input type="text" placeholder="Sacha Bouron" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="field-icon" size={18} />
                <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <Lock className="field-icon" size={18} />
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <button className="btn-primary" onClick={() => {
              if (!fullName || !email || !password) {
                alert("Veuillez remplir tous les champs avant de continuer.");
                return;
              }
              setStep('onboarding');
            }}>
              Suivant <ArrowRight size={18} />
            </button>
            <p className="footer-text">
              Déjà inscrit ? <a onClick={() => setStep('login')}>Se connecter</a>
            </p>
          </div>
        )}

        {step === 'onboarding' && (
          <div className="auth-step-fade">
            <button className="btn-back" onClick={() => setStep('register')}>
              <ArrowLeft size={16} /> Retour
            </button>
            <div className="auth-header">
              <h1>Profil Développeur</h1>
              <p>Sélectionnez vos compétences et préférences.</p>
            </div>

            <div className="input-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Langages & Outils</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedSkills.length} sélectionnée(s)
                </span>
              </label>

              {/* Barre de recherche des compétences */}
              <div className="input-wrapper" style={{ marginBottom: '10px' }}>
                <Search className="field-icon" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher une compétence (ex: React, Python...)"
                  value={skillSearch}
                  onChange={e => setSkillSearch(e.target.value)}
                />
              </div>

              {/* Zone défilante (scrollable) pour les compétences */}
              <div className="chips-grid" style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '5px', paddingBottom: '10px' }}>
                {filteredSkills.length > 0 ? (
                  filteredSkills.map(lang => (
                    <span
                      key={lang}
                      className={`auth-chip ${selectedSkills.includes(lang) ? 'active' : ''}`}
                      onClick={() => toggleSkill(lang)}
                    >
                      {lang}
                    </span>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Aucune compétence trouvée.</p>
                )}
              </div>
            </div>

            <div className="input-group">
              <label>Type de poste recherché</label>
              <div className="chips-grid">
                {postTypes.map(type => (
                  <span
                    key={type}
                    className={`auth-chip ${selectedPostTypes.includes(type) ? 'active' : ''}`}
                    onClick={() => togglePostType(type)}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>Expérience</label>
              <select className="auth-select">
                <option>Junior (0-2 ans)</option>
                <option>Intermédiaire (2-5 ans)</option>
                <option>Sénior (5+ ans)</option>
              </select>
            </div>

            <button className="btn-primary" onClick={handleRegister}>
              Terminer l'inscription <CheckCircle size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
