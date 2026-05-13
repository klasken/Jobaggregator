import React, { useState } from 'react';
import './Auth.css';
import { Mail, Lock, User, Rocket, ArrowRight, ArrowLeft, Moon, Sun, Briefcase, CheckCircle } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
  theme: string;
  setTheme: (t: string) => void;
  initialStep?: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess, theme, setTheme, initialStep = 'login' }) => {
  const [step, setStep] = useState<'login' | 'register' | 'onboarding'>(initialStep);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedPostTypes, setSelectedPostTypes] = useState<string[]>([]);
  const languages = ["React", "TypeScript", "Node.js", "Python", "Java", "C++", "PHP", "Vue.js", "Angular", "Swift"];
  const postTypes = ["CDI", "Freelance", "Remote", "Stage", "Alternance"];
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const togglePostType = (type: string) => {
    setSelectedPostTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  return (
    <div className="auth-container">
      {/* Bouton Dark Mode  */}
      <button className="theme-toggle-mini" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="background-dots"></div>

      <div className="auth-card">
        {/* LOGIN */}
        {step === 'login' && (
          <div className="auth-step-fade">
            <div className="auth-header">
              <div className="auth-logo"><Briefcase size={22} /></div>
              <h1 className="brand-name">EpiDevs</h1>
              <p>Connectez-vous pour accéder à vos offres.</p>
            </div>
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="field-icon" size={18} />
                <input type="email" placeholder="votre@email.com" />
              </div>
            </div>
            <div className="input-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <Lock className="field-icon" size={18} />
                <input type="password" placeholder="••••••••" />
              </div>
            </div>
            <button className="btn-primary" onClick={onLoginSuccess}>
              Se connecter <Rocket size={18} />
            </button>
            <p className="footer-text">
              Pas de compte ? <a onClick={() => setStep('register')}>Créer un compte</a>
            </p>
          </div>
        )}

        {/* REGISTER */}
        {step === 'register' && (
          <div className="auth-step-fade">
            <div className="auth-header">
              <h1 className="brand-name">Rejoindre EpiDevs</h1>
              <p>Créez votre profil en quelques secondes.</p>
            </div>
            <div className="input-group">
              <label>Nom complet</label>
              <div className="input-wrapper">
                <User className="field-icon" size={18} />
                <input type="text" placeholder="Sacha Bouron" />
              </div>
            </div>
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="field-icon" size={18} />
                <input type="email" placeholder="votre@email.com" />
              </div>
            </div>
            <div className="input-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <Lock className="field-icon" size={18} />
                <input type="password" placeholder="••••••••" />
              </div>
            </div>
            <button className="btn-primary" onClick={() => setStep('onboarding')}>
              Suivant <ArrowRight size={18} />
            </button>
            <p className="footer-text">
              Déjà inscrit ? <a onClick={() => setStep('login')}>Se connecter</a>
            </p>
          </div>
        )}

        {/*  ONBOARDING */}
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
              <label>Langages & Frameworks</label>
              <div className="chips-grid">
                {languages.map(lang => (
                  <span 
                    key={lang} 
                    className={`auth-chip ${selectedSkills.includes(lang) ? 'active' : ''}`}
                    onClick={() => toggleSkill(lang)}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>Type de poste recherché</label>
              <div className="chips-container">
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

            <button className="btn-primary" onClick={onLoginSuccess}>
              Terminer l'inscription <CheckCircle size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;