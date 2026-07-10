import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

export default function AdminLogin() {
  const { isAuthenticated, login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin', { replace: true });
    } else {
      setError('Mot de passe incorrect.');
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <h1>Administration</h1>
        <p className="admin-login__subtitle">Connectez-vous pour gérer les produits</p>
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {error && <p className="admin-login__error">{error}</p>}
        <button type="submit">Se connecter</button>
        <p className="admin-login__hint">Mot de passe par défaut : admin1234</p>
        {location.state?.from && (
          <p className="admin-login__hint">Vous devez vous connecter pour accéder à cette page.</p>
        )}
      </form>
    </div>
  );
}
