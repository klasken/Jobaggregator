import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const navigate = useNavigate();

  const availableSkills = ["React", "Python", "Docker", "SQL", "FastAPI", "TypeScript", "NodeJS", "AWS"];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';

    const skillsString = selectedSkills.join(', ');

    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          competences: isLogin ? undefined : skillsString
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(isLogin ? "Connexion réussie !" : "Inscription réussie !");

        if (isLogin && data.access_token) {
          localStorage.setItem('token', data.access_token);
          navigate('/');
        } else if (!isLogin) {
          setIsLogin(true);
        }
      } else {
        alert("Erreur : " + (data.detail || "Identifiants incorrects"));
      }
    } catch (err) {
      console.error("Erreur back-end:", err);
      alert("Impossible de contacter le serveur.");
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="glass-card auth-card">

        <div className="auth-tabs">
          <button
            type="button"
            className={isLogin ? "tab-btn active" : "tab-btn"}
            onClick={() => setIsLogin(true)}
          >
            Connexion
          </button>
          <button
            type="button"
            className={!isLogin ? "tab-btn active" : "tab-btn"}
            onClick={() => setIsLogin(false)}
          >
            Inscription
          </button>
        </div>

        <div className="brand-header">
          <span className="brand-badge">M</span>
          <h1>{isLogin ? "Content de vous revoir" : "Créer un compte"}</h1>
          <p>{isLogin ? "Entrez vos accès pour continuer" : "Rejoignez-nous en quelques secondes"}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="skills-selection">
              <label>Mes compétences :</label>
              <div className="badges-container">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={`skill-badge ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="btn-login">
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
