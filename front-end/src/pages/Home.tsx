import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import { Search, MapPin, Briefcase, Settings, Moon, Sun, LayoutDashboard, ShieldCheck, HelpCircle, Languages, X, Sparkles, Heart } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface JobOffer {
  id: number;
  titre: string;
  entreprise_nom: string;
  location: string;
  contract_type: string;
  position?: [number, number] | null;
}

interface HomeProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onDashboardClick: () => void;
  onNavigate: (page: any) => void;
  isLoggedIn: boolean;
  theme: string;
  setTheme: (t: string) => void;
  t: any;
  currentLang: string;
  setLang: (lang: string) => void;
  userData?: { nom?: string; prenom?: string };
  isNewUser?: boolean;
}

const geocodeCache: Record<string, [number, number] | null> = {};

const cleanLocationForGeocode = (raw: string): string | null => {
  const remote = /t[eé]l[eé]travail|remote|full.?remote|partiel|worldwide|international|france enti[eè]re/i;
  if (remote.test(raw)) return null;
  let s = raw.trim();
  s = s.replace(/^\d{2,5}\s*[-–]\s*/, '');
  s = s.replace(/\s*\(.*?\)/g, '');
  s = s.replace(/\s+\d+[eè]?(?:me|ème|er|ère|nd|th)?\.?\s*$/i, '');
  s = s.split(/[,/]/)[0].trim();
  return s.length > 1 ? s : null;
};

const geocodeLocation = async (locationStr: string): Promise<[number, number] | null> => {
  if (!locationStr || locationStr === "Lieu non renseigné") return null;
  const cleaned = cleanLocationForGeocode(locationStr);
  if (!cleaned) return null;
  if (geocodeCache[cleaned] !== undefined) return geocodeCache[cleaned];
  try {
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(cleaned)}&type=municipality&limit=1`
    );
    const data = await res.json();
    if (data.features?.length > 0) {
      const [lon, lat] = data.features[0].geometry.coordinates;
      const coords: [number, number] = [lat, lon];
      geocodeCache[cleaned] = coords;
      return coords;
    }
    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleaned + ', France')}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'fr' } }
    );
    const nominatimData = await nominatimRes.json();
    if (nominatimData?.length > 0) {
      const coords: [number, number] = [parseFloat(nominatimData[0].lat), parseFloat(nominatimData[0].lon)];
      geocodeCache[cleaned] = coords;
      return coords;
    }
    geocodeCache[cleaned] = null;
    return null;
  } catch {
    geocodeCache[cleaned] = null;
    return null;
  }
};

const HomePage: React.FC<HomeProps> = ({
  onLoginClick,
  onRegisterClick,
  onDashboardClick,
  onNavigate,
  isLoggedIn,
  theme,
  setTheme,
  t,
  currentLang,
  setLang,
  userData,
  isNewUser = false
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [searchPlace, setSearchPlace] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom, setMapZoom] = useState(6);
  const [mapOffers, setMapOffers] = useState<JobOffer[]>([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Ref pour ne déclencher la popup qu'une seule fois par session de connexion
  const welcomeShownRef = useRef(false);

  // Calcule le prénom à afficher — utilisé au rendu, pas dans un useEffect
  const prenom = (() => {
    if (userData?.prenom && userData.prenom.trim() !== "" && userData.prenom !== "Utilisateur") {
      return userData.prenom.trim();
    }
    const n = userData?.nom?.trim() || "";
    if (n && n !== "Utilisateur") return n.split(' ')[0];
    return "vous";
  })();

  // Déclenche la popup dès qu'on est connecté ET que le prénom est chargé (pas "vous")
  useEffect(() => {
    if (!isLoggedIn) {
      // Reset quand on se déconnecte
      welcomeShownRef.current = false;
      setShowWelcome(false);
      return;
    }

    // Attend que le vrai prénom soit disponible
    if (prenom === "vous") return;

    // Ne montre la popup qu'une seule fois
    if (welcomeShownRef.current) return;

    welcomeShownRef.current = true;
    setShowWelcome(true);
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, [isLoggedIn, prenom]);

  useEffect(() => {
    const loadOffersOnMap = async () => {
      setMapLoading(true);
      try {
        const res = await fetch('/api/dashboard/jobs');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const jobs: JobOffer[] = await res.json();
        const slice = jobs
          .filter(j => j.location && j.location !== "Lieu non renseigné")
          .slice(0, 100);
        const batchSize = 5;
        const results: JobOffer[] = [];
        for (let i = 0; i < slice.length; i += batchSize) {
          const batch = slice.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(async (job) => ({ ...job, position: await geocodeLocation(job.location) }))
          );
          results.push(...batchResults);
          if (i + batchSize < slice.length) await new Promise(r => setTimeout(r, 300));
        }
        setMapOffers(results.filter(j => j.position != null));
      } catch (e) {
        console.error("Erreur chargement offres carte :", e);
        setMapOffers([]);
      } finally {
        setMapLoading(false);
      }
    };
    loadOffersOnMap();
  }, []);

  const handleSearch = async () => {
    if (!searchPlace.trim()) return;
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(searchPlace)}&type=municipality&limit=1`
      );
      const data = await response.json();
      if (data.features?.length > 0) {
        const [lon, lat] = data.features[0].geometry.coordinates;
        setMapCenter([lat, lon]);
        setMapZoom(12);
      } else {
        alert("Ville non trouvée. Réessayez avec une autre orthographe !");
      }
    } catch (error) {
      console.error("Erreur API Adresse :", error);
    }
  };

  return (
    <div className={theme === "dark" ? "home-dark-theme" : "home-light-theme"}>
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="Logo JobyFind" className="custom-home-logo" />
          </div>
          <div className="nav-links">
            <div className="custom-tooltip-wrapper">
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('research'); }}>
                {t.viewOffers}
              </a>
              <span className="custom-tooltip-text">Consultez nos offres ! 🚀</span>
            </div>
          </div>
        </div>

        <div className="nav-right" style={{ position: 'relative' }}>
          <button className="nav-icon-btn" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={20} />
          </button>

          {showSettings && (
            <div className="settings-dropdown">
              <div className="dropdown-item" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                <span>{theme === 'dark' ? t.modeLight : t.modeDark}</span>
              </div>
              <div className="dropdown-item language-select-container">
                <Languages size={18} />
                <select value={currentLang} onChange={(e) => setLang(e.target.value)} className="language-switcher">
                  <option value="fr">Français 🇫🇷</option>
                  <option value="en">English 🇬🇧</option>
                  <option value="es">Español 🇪🇸</option>
                  <option value="de">Deutsch 🇩🇪</option>
                  <option value="ar">العربية 🇸🇦</option>
                  <option value="zh">中文 🇨🇳</option>
                </select>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item" onClick={() => onNavigate('settings')}>
                <Settings size={18} />
                <span>{t.allSettings}</span>
              </div>
            </div>
          )}

          {isLoggedIn ? (
            <div className="custom-tooltip-wrapper">
              <button className="nav-dashboard-btn" onClick={onDashboardClick}>
                <LayoutDashboard size={18} />
                {t.dashboard}
              </button>
              <span className="custom-tooltip-text">Accédez à votre espace ! 📊</span>
            </div>
          ) : (
            <>
              <button className="nav-login-btn" onClick={onLoginClick}>{t.btnConnect}</button>
              <button className="nav-signup-btn" onClick={onRegisterClick}>{t.btnRegister}</button>
            </>
          )}
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-tag"><span>{t.brandSub}</span></div>
        <h1>
          {t.heroTitleStart}
          <span className="text-blue">{t.heroTitleEnd}</span>
        </h1>
        <p>{t.heroSub}</p>

        <div className="search-container">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder={t.searchPlaceholderJob} />
          </div>
          <div className="search-box">
            <MapPin className="search-icon" size={20} />
            <input
              type="text"
              placeholder={t.searchPlaceholderPlace}
              value={searchPlace}
              onChange={(e) => setSearchPlace(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="main-search-btn" onClick={handleSearch}>{t.searchBtn}</button>
        </div>

        <div className="map-wrapper" style={{ position: 'relative' }}>
          {mapLoading && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.6)', borderRadius: '12px',
              fontSize: '14px', color: '#555', pointerEvents: 'none'
            }}>
              Chargement des offres…
            </div>
          )}
          <MapContainer
            center={mapCenter} zoom={mapZoom} minZoom={5}
            maxBounds={[[41.0, -5.0], [51.5, 10.0]]} maxBoundsViscosity={1.0}
            scrollWheelZoom={false} className="interactive-map"
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={theme === 'dark'
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
            />
            {mapOffers.map((offer) => (
              <Marker key={offer.id} position={offer.position!}>
                <Popup>
                  <div className="map-popup-content">
                    <h4>{offer.titre}</h4>
                    <p><strong>{offer.entreprise_nom}</strong>{offer.location ? ` — ${offer.location}` : ''}</p>
                    {offer.contract_type && (
                      <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 6px' }}>{offer.contract_type}</p>
                    )}
                    <button className="map-popup-btn" onClick={() => onNavigate({ page: 'research', jobId: offer.id })}>
                      {t.viewOfferBtn || "Voir l'offre"}
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="hero-footer-info">
          <div className="info-card">
            <HelpCircle size={20} className="info-icon" />
            <div className="info-text"><h3>{t.whatIsBrand}</h3><p>{t.brandDescription}</p></div>
          </div>
          <div className="info-card">
            <ShieldCheck size={20} className="info-icon security" />
            <div className="info-text"><h3>{t.secureDataTitle}</h3><p>{t.secureDataSub}</p></div>
          </div>
        </div>
      </header>

      {showWelcome && (
        <div className="home-welcome-backdrop" onClick={() => setShowWelcome(false)}>
          <div className="home-welcome-card" onClick={(e) => e.stopPropagation()}>
            <button className="home-welcome-close" onClick={() => setShowWelcome(false)}>
              <X size={18} />
            </button>
            <div className="home-welcome-icon-wrapper">
              {isNewUser ? (
                <Sparkles size={30} className="home-icon-welcome-primary" />
              ) : (
                <Heart size={30} className="home-icon-welcome-heart" />
              )}
            </div>
            <div className="home-welcome-content">
              {isNewUser ? (
                <>
                  <h3>Compte créé avec succès ! 🎉</h3>
                  <h2>Bienvenue, {prenom} !</h2>
                  <p>Votre aventure sur JobyFind commence dès maintenant.</p>
                </>
              ) : (
                <>
                  <h3>Bon retour parmi nous 👋</h3>
                  <h2>Ravi de vous revoir, {prenom} !</h2>
                  <p>Découvrez les dernières offres mises à jour pour vous.</p>
                </>
              )}
            </div>
            <button className="home-welcome-btn" onClick={() => setShowWelcome(false)}>
              C'est parti !
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
