import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/display.css';

export default function Display() {
  const { products, settings } = useStore();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Uniquement les produits avec une vraie image uploadée (pas les placeholders SVG auto-générés)
  const visibleProducts = products.filter(
    (p) => p.inStock !== false && p.image && !p.image.startsWith('data:image/svg+xml')
  );

  const dateLabel = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const timeLabel = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="display"
      style={{ '--accent': settings.accentColor, '--secondary': settings.secondaryColor }}
    >
      <Navbar
        storeName={settings.storeName}
        phone={settings.phone}
        dateLabel={dateLabel}
        timeLabel={timeLabel}
      />

      <main className="display__main">
        {visibleProducts.length > 0 ? (
          <Hero
            products={visibleProducts}
            storeName={settings.storeName}
            tagline={settings.tagline}
          />
        ) : (
          <div className="display__empty">
            Aucun produit à afficher. Ajoutez des produits depuis l'administration.
          </div>
        )}
      </main>

      <Footer
        storeName={settings.storeName}
        phone={settings.phone}
        address={settings.address}
        message={settings.welcomeMessage}
      />

      <Link to="/admin" className="display__admin-link" aria-label="Administration">
        ⚙
      </Link>

    </div>
  );
}
