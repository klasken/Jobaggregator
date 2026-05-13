import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && step === 1) {
      setStep(2);
    } else {
      // ON SIMULE LA CONNEXION
      localStorage.setItem('isAuthenticated', 'true');
      // REDIRECTION VERS LE DASHBOARD
      navigate('/dashboard'); 
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setStep(1);
  };

  return (
    <div className="auth-container">
      <div className="auth-card-full"> 
        <header className="auth-header">
          <h1>{isLogin ? 'Connexion' : 'Création de profil'}</h1>
          <p className="subtitle">
            {isLogin ? 'Heureux de vous revoir !' : `Étape ${step} sur 2`}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="main-auth-form">
          {isLogin ? (
            <div className="form-section">
              <div className="form-field">
                <label>Email Professionnel</label>
                <input type="email" placeholder="nom@exemple.com" required />
              </div>
              <div className="form-field">
                <label>Mot de passe</label>
                <input type="password" placeholder="••••••••" required />
              </div>
            </div>
          ) : (
            <div className="form-section">
              {step === 1 ? (
                <>
                  <div className="form-row">
                    <div className="form-field"><label>Prénom</label><input type="text" required /></div>
                    <div className="form-field"><label>Nom</label><input type="text" required /></div>
                  </div>
                  <div className="form-field"><label>Email</label><input type="email" required /></div>
                  <div className="form-field"><label>Mot de passe</label><input type="password" required /></div>
                </>
              ) : (
                <>
                  <div className="form-field">
                    <label>Localisation</label>
                    <select required className="auth-select">
                      <option value="">Sélectionnez votre région</option>
                      <option value="ara">Auvergne-Rhône-Alpes</option>
                      <option value="bre">Bretagne</option>
                      <option value="hdf">Hauts-de-France</option>
                      <option value="idf">Île-de-France</option>
                      <option value="naq">Nouvelle-Aquitaine</option>
                      <option value="pac">Provence-Alpes-Côte d'Azur</option>
                      <option value="remote">🌍 Full Remote (Télétravail)</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Expertises techniques</label>
                    <div className="skills-grid">
                      {['React', 'Node', 'Python', 'SQL', 'DevOps', 'Go'].map(s => (
                        <label key={s} className="skill-chip">
                          <input type="checkbox" value={s.toLowerCase()} />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Séniorité</label>
                    <select required className="auth-select">
                      <option value="jr">Junior (0-2 ans)</option>
                      <option value="it">Intérmediaire (3-5 ans)</option>
                      <option value="sr">Senior (5+ ans)</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="button-stack">
            <button type="submit" className="btn-auth-submit">
              {isLogin ? 'Se connecter' : (step === 1 ? 'Suivant' : 'Finaliser')}
            </button>
            {!isLogin && step === 2 && (
              <button type="button" className="btn-back" onClick={() => setStep(1)}>
                Retour à l'étape précédente
              </button>
            )}
          </div>
        </form>

        <footer className="auth-footer">
          <span>{isLogin ? "Nouveau ici ?" : "Déjà inscrit ?"}</span>
          <button className="toggle-btn" onClick={toggleMode}>
            {isLogin ? "Créer un compte" : "Se connecter"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Auth;