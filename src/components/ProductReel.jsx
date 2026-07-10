import { useEffect, useRef } from 'react';

const ROWS = 3;

function splitIntoRows(items, n) {
  const rows = Array.from({ length: n }, () => []);
  items.forEach((item, i) => rows[i % n].push(item));
  return rows;
}

function ReelRow({ items, currency, direction, speed }) {
  // Triple la liste pour garantir une boucle parfaite quelle que soit la largeur
  const loop = [...items, ...items, ...items];

  return (
    <div className="reel__row-wrap">
      <div
        className={`reel__row reel__row--${direction}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {loop.map((p, i) => (
          <div key={`${p.id}-${i}`} className="reel__card">
            <div className="reel__card-img-wrap">
              <img src={p.image} alt={p.name} className="reel__card-img" />
            </div>
            <div className="reel__card-body">
              {p.category && <span className="reel__card-cat">{p.category}</span>}
              <p className="reel__card-name">{p.name}</p>
              <p className="reel__card-price">
                {Number(p.price).toLocaleString('fr-FR')} <span>{currency}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductReel({ products, currency, onClose }) {
  const rows = splitIntoRows(products, ROWS);
  const backdropRef = useRef(null);

  // fermeture avec Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // empêche le scroll de la page sous la modal
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleBackdrop(e) {
    if (e.target === backdropRef.current) onClose();
  }

  const speeds = [38, 28, 44]; // vitesses différentes pour chaque ligne
  const directions = ['left', 'right', 'left'];

  return (
    <div className="reel-modal" ref={backdropRef} onClick={handleBackdrop}>
      <div className="reel-modal__panel">

        {/* en-tête */}
        <div className="reel-modal__header">
          <div className="reel-modal__header-text">
            <h2>Nos Produits</h2>
            <p>{products.length} articles disponibles en boutique</p>
          </div>
          <button className="reel-modal__close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        {/* les 3 pistes */}
        <div className="reel-modal__stage">
          {rows.map((row, i) =>
            row.length > 0 ? (
              <ReelRow
                key={i}
                items={row}
                currency={currency}
                direction={directions[i]}
                speed={speeds[i]}
              />
            ) : null
          )}
        </div>

      </div>
    </div>
  );
}
