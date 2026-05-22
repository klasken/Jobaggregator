import { useState, useEffect } from 'react';
import { Users, Radio, Briefcase, Trash2, Shield, ArrowLeft } from 'lucide-react';
import './AdminPage.css';

interface AdminPageProps {
  onNavigate: (page: any) => void;
  t: any;
  userData: any;
}

export default function AdminPage({ onNavigate, t, userData }: AdminPageProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [usersRes, jobsRes] = await Promise.all([
          fetch('/api/admin/users', { headers }),
          fetch('/api/admin/jobs', { headers })
        ]);

        if (usersRes.ok && jobsRes.ok) {
          const usersData = await usersRes.json();
          const jobsData = await jobsRes.json();

          const usersWithStatus = usersData.map((user: any) => ({
            ...user,
            status: user.email === userData?.email ? 'online' : 'offline'
          }));

          setUsers(usersWithStatus);
          setOffers(jobsData);
        } else {
          console.error("Erreur serveur lors de la récupération des données d'administration");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [userData]);

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Supprimer cet utilisateur définitivement ?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setUsers(users.filter(user => user.id !== id));
        } else {
          alert("Erreur lors de la suppression de l'utilisateur.");
        }
      } catch (error) {
        console.error("Erreur suppression utilisateur :", error);
      }
    }
  };

  const handleDeleteOffer = async (id: number) => {
    if (window.confirm("Supprimer cette offre d'emploi définitivement ?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/jobs/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setOffers(offers.filter(offer => offer.id !== id));
        } else {
          alert("Erreur lors de la suppression de l'offre.");
        }
      } catch (error) {
        console.error("Erreur suppression offre :", error);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '15px' }}>
        <Shield size={40} style={{ color: '#4f46e5' }} />
        <h3 style={{ fontFamily: 'sans-serif', color: '#4b5563' }}>Chargement des données du Panel Administration...</h3>
      </div>
    );
  }

  return (
    <div className="admin-layout-container">
      {/* LA SIDEBAR LOCALE A ÉTÉ RETIRÉE D'ICI */}

      <main className="admin-main-content">
        <header className="admin-header">
          <div className="admin-title-block">
            <Shield size={28} className="admin-shield-icon" />
            <div>
              <h1>Panel Administration</h1>
              <p className="admin-subtitle">Gérez la plateforme, les utilisateurs et les annonces.</p>
            </div>
          </div>
          <button onClick={() => onNavigate('home')} className="admin-back-btn">
            <ArrowLeft size={16} /> {t.backHome || "Retour"}
          </button>
        </header>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper users-total"><Users size={24} /></div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Utilisateurs Totaux</p>
              <h3 className="admin-stat-value">{users.length}</h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-wrapper users-online"><Radio size={24} /></div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Utilisateurs Connectés</p>
              <h3 className="admin-stat-value">{users.filter(u => u.status === 'online').length}</h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-wrapper offers-total"><Briefcase size={24} /></div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Offres en Ligne</p>
              <h3 className="admin-stat-value">{offers.length}</h3>
            </div>
          </div>
        </div>

        <div className="admin-management-grid">
          <div className="admin-table-section">
            <h2>Gestion des Utilisateurs ({users.length})</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="font-semibold">{user.name}</td>
                      <td className="text-muted-cell">{user.email}</td>
                      <td style={{ textTransform: 'capitalize', fontSize: '0.9em', color: '#4f46e5' }}>{user.role}</td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          <span className="status-dot"></span>
                          {user.status === 'online' ? 'En ligne' : 'Hors ligne'}
                        </span>
                      </td>
                      <td className="text-center">
                        <button onClick={() => handleDeleteUser(user.id)} className="admin-delete-btn" title="Supprimer l'utilisateur">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-table-section">
            <h2>Gestion des Offres d'Emploi ({offers.length})</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Intitulé du poste</th>
                    <th>Entreprise</th>
                    <th>Ville</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(offer => (
                    <tr key={offer.id}>
                      <td className="font-semibold">{offer.title}</td>
                      <td className="text-muted-cell">{offer.company}</td>
                      <td>{offer.city || "Non spécifié"}</td>
                      <td className="text-center">
                        <button onClick={() => handleDeleteOffer(offer.id)} className="admin-delete-btn" title="Supprimer l'offre">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}