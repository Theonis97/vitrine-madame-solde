import { Link } from 'react-router-dom';

export default function Navbar({ storeName, phone, dateLabel, timeLabel }) {
  return (
    <header className="navbar">
      <div className="navbar__main">
        {/* Logo + nom */}
        <div className="navbar__brand">
          <div className="navbar__logo-block">
            <span className="navbar__logo-letter">{storeName?.[0]?.toUpperCase() || 'M'}</span>
          </div>
          <span className="navbar__store-name">{storeName}</span>
        </div>

        {/* Horloge */}
        <div className="navbar__clock">
          <span className="navbar__clock-date">{dateLabel}</span>
          <span className="navbar__clock-time">{timeLabel}</span>
        </div>

        {/* Bouton connexion admin */}
        <Link to="/admin" className="navbar__admin-btn">
          🔐 Administration
        </Link>
      </div>
    </header>
  );
}
