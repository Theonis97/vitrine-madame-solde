import { useEffect, useState } from 'react';

export default function Carousel({ products, currency, speedSeconds = 6 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, Math.max(3, speedSeconds) * 1000);
    return () => clearInterval(timer);
  }, [products.length, speedSeconds]);

  useEffect(() => {
    if (index >= products.length) setIndex(0);
  }, [products.length, index]);

  if (products.length === 0) return null;

  return (
    <div className="carousel">
      {products.map((product, i) => (
        <div key={product.id} className={`carousel__slide ${i === index ? 'is-active' : ''}`}>
          <div className="carousel__image-wrap">
            <img src={product.image} alt={product.name} className="carousel__image" />
          </div>
          <div className="carousel__overlay" />
          <div className="carousel__content">
            {product.category && <span className="carousel__tag">{product.category}</span>}
            <h2 className="carousel__name">{product.name}</h2>
            <p className="carousel__price">
              {Number(product.price).toLocaleString('fr-FR')} <span>{currency}</span>
            </p>
            <span className="carousel__cta">
              {product.inStock !== false ? 'Disponible en boutique' : 'Bientôt de retour'}
            </span>
          </div>
        </div>
      ))}

      {products.length > 1 && (
        <div className="carousel__dots">
          {products.map((product, i) => (
            <span key={product.id} className={`carousel__dot ${i === index ? 'is-active' : ''}`} />
          ))}
        </div>
      )}
    </div>
  );
}
