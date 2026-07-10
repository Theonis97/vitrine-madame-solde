import { useEffect, useState } from 'react';

// Carrousel TV léger : 1 produit affiché à la fois, transition en fondu
export default function Hero({ products, storeName }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      // Fondu sortant
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % products.length);
        setVisible(true);
      }, 500);
    }, 5000); // change toutes les 5 secondes
    return () => clearInterval(timer);
  }, [products.length]);

  if (products.length === 0) return null;
  const product = products[index];

  return (
    <div className="hero">
      <div className="hero__bg-solid" />

      <div className="hero__logo-bg">
        <img src="/logo-bg.png" alt="" aria-hidden="true" />
      </div>

      <div className="hero__store-label">{storeName}</div>

      {/* Carte produit centrale */}
      <div className={`hero__spotlight${visible ? ' hero__spotlight--in' : ' hero__spotlight--out'}`}>
        <div className="hero__spotlight-img-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="hero__spotlight-img"
          />
          {product.category && (
            <span className="hero__spotlight-cat">{product.category}</span>
          )}
        </div>
        <div className="hero__spotlight-body">
          <p className="hero__spotlight-name">{product.name}</p>
          <p className="hero__spotlight-price">
            {Number(product.price).toLocaleString('fr-FR')}
            <span> FCFA</span>
          </p>
          <p className="hero__spotlight-stock">
            {product.inStock !== false ? 'Disponible en boutique' : 'Bientôt de retour'}
          </p>
        </div>
      </div>

      {/* Indicateur de position */}
      <div className="hero__dots">
        {products.map((_, i) => (
          <span key={i} className={`hero__dot${i === index ? ' hero__dot--active' : ''}`} />
        ))}
      </div>
    </div>
  );
}
