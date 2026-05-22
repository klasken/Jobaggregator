import React, { useState } from 'react';
import './NotificationsPage.css';
import { Info, CheckCircle, AlertTriangle, Trash2, BellOff } from 'lucide-react';

interface NotificationsPageProps {
  onNavigate: (page: any) => void;
  t?: any; 
  userData?: {
    name?: string;
    avatar?: string | null;
    [key: string]: any;
  };
}

const initialNotifications = [
  { id: 1, type: 'success', title: 'Candidature retenue', message: 'Votre profil a été retenu par CloudStack pour un premier entretien.', time: 'Il y a 2 heures', unread: true },
  { id: 2, type: 'info', title: 'Nouvelle offre assortie', message: 'Une nouvelle offre "Frontend Developer" correspond à vos compétences recherchées.', time: 'Il y a 5 heures', unread: true },
  { id: 3, type: 'warning', title: 'Complétez votre profil', message: 'Ajoutez vos compétences en base de données pour attirer 3x plus de recruteurs.', time: 'Hier', unread: false },
];

const NotificationsPage: React.FC<NotificationsPageProps> = ({
  onNavigate,
  t = {}, 
  userData = {} 
}) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notif-container">
      {/* LA SIDEBAR LOCALE A ÉTÉ RETIRÉE D'ICI */}

      <main className="notif-main">
        <header className="notif-header">
          <div>
            <h1>{t.notifs || 'Notifications'}</h1>
            <p>Suivez l'évolution de vos candidatures et alertes en temps réel</p>
          </div>
          {notifications.length > 0 && (
            <button className="btn-clear-all" onClick={handleClearAll}>
              Tout effacer
            </button>
          )}
        </header>

        {notifications.length > 0 ? (
          <div className="notif-list">
            {notifications.map((notif) => (
              <div key={notif.id} className={`notif-card ${notif.unread ? 'unread' : ''}`}>
                <div className={`notif-icon-wrapper ${notif.type}`}>
                  {notif.type === 'success' && <CheckCircle size={20} />}
                  {notif.type === 'info' && <Info size={20} />}
                  {notif.type === 'warning' && <AlertTriangle size={20} />}
                </div>

                <div className="notif-content">
                  <h3>{notif.title}</h3>
                  <p>{notif.message}</p>
                  <span className="notif-time">{notif.time}</span>
                </div>

                <button
                  className="btn-delete-notif"
                  onClick={() => handleDelete(notif.id)}
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-notifications">
            <BellOff size={48} className="empty-icon" />
            <p>Vous n'avez pas de notifications pour le moment.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;