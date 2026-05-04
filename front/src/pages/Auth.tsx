import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(isLogin ? "Connexion réussie !" : "Inscription réussie !");
        if (isLogin && data.token) {
          localStorage.setItem('token', data.token);
        }
      } else {
        alert("Erreur : " + (data.message || "Identifiants incorrects"));
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

          <button type="submit" className="btn-login">
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;