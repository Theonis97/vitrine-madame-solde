import { useEffect, useState } from 'react';

/**
 * Affichage adaptatif selon le nombre de produits :
 *  ≤ 10  → carrousel 1 produit à la fois
 *  11-20 → carrousel 2 produits côte à côte
 *  21+   → 3 rangées défilantes
 */
export default function Hero({ products, storeName }) {
  const count = products.length;

  if (count === 0) return null;

  if (count <= 10)  return <CarouselSingle  products={products} storeName={storeName} perSlide={1} />;
  if (count <= 20)  return <CarouselSingle  products={products} storeName={storeName} perSlide={2} />;
  return                   <ScrollingRows   products={products} storeName={storeName} />;
}

/* ─────────────────────────────────────────────────────────
   MODE 1 & 2 : carrousel (1 ou 2 produits par diapo)
───────────────────────────────────────────────────────── */
function CarouselSingle({ products, storeName, perSlide }) {
  const [index, setIndex]   = useState(0);
  const [visible, setVisible] = useState(true);

  const total = Math.ceil(products.length / perSlide);

  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % total);
        setVisible(true);
      }, 500);
    }, 5000);
    return () => clearInterval(t);
  }, [total]);

  const start   = index * perSlide;
  const current = products.slice(start, start + perSlide);

  return (
    <div className="hero">
      <div className="hero__bg-solid" />
      <div className="hero__logo-bg">
        <img src="/logo-bg.png" alt="" aria-hidden="true" loading="lazy" />
      </div>
      <div className="hero__store-label">{storeName}</div>

      <div className={`hero__slide-wrap${visible ? ' hero__slide--in' : ' hero__slide--out'}`}>
        {current.map((p) => (
          <SlideCard key={p.id} product={p} wide={perSlide === 1} />
        ))}
      </div>

      {/* Points indicateurs */}
      <div className="hero__dots">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={`hero__dot${i === index ? ' hero__dot--active' : ''}`} />
        ))}
      </div>
    </div>
  );
}

function SlideCard({ product, wide }) {
  return (
    <div className={`hero__slide-card${wide ? ' hero__slide-card--wide' : ''}`}>
      <div className="hero__slide-img-wrap">
        <img src={product.image} alt={product.name} className="hero__slide-img" decoding="async" />
        {product.category && (
          <span className="hero__slide-cat">{product.category}</span>
        )}
      </div>
      <div className="hero__slide-body">
        <p className="hero__slide-name">{product.name}</p>
        <p className="hero__slide-price">
          {Number(product.price).toLocaleString('fr-FR')}
          <span> FCFA</span>
        </p>
        <p className="hero__slide-stock">
          {product.inStock !== false ? 'Disponible en boutique' : 'Bientôt de retour'}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MODE 3 : 3 rangées défilantes (21 produits et plus)
───────────────────────────────────────────────────────── */
const MAX_PER_ROW = 10;

function ScrollingRows({ products, storeName }) {
  const third = Math.ceil(products.length / 3);
  const row1  = [...products.slice(0, third).slice(0, MAX_PER_ROW)];
  const row2  = [...products.slice(third, third * 2).slice(0, MAX_PER_ROW)];
  const row3  = [...products.slice(third * 2).slice(0, MAX_PER_ROW)];

  const loop = (arr) => [...arr, ...arr];

  return (
    <div className="hero">
      <div className="hero__bg-solid" />
      <div className="hero__logo-bg">
        <img src="/logo-bg.png" alt="" aria-hidden="true" loading="lazy" />
      </div>
      <div className="hero__store-label">{storeName}</div>

      <div className="hero__rows">
        <HeroRow items={loop(row1)} direction="left"  speed={36} />
        <HeroRow items={loop(row2)} direction="right" speed={28} />
        <HeroRow items={loop(row3)} direction="left"  speed={44} />
      </div>
    </div>
  );
}

function HeroRow({ items, direction, speed }) {
  return (
    <div className="hero__row-wrap">
      <div
        className={`hero__row hero__row--${direction}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((p, i) => (
          <HeroCard key={`${p.id}-${i}`} product={p} />
        ))}
      </div>
    </div>
  );
}

function HeroCard({ product }) {
  return (
    <div className="hero__card">
      <div className="hero__card-img-wrap">
        <img src={product.image} alt={product.name} className="hero__card-img" decoding="async" />
        {product.category && (
          <span className="hero__card-cat">{product.category}</span>
        )}
      </div>
      <div className="hero__card-body">
        <p className="hero__card-name">{product.name}</p>
        <p className="hero__card-price">
          {Number(product.price).toLocaleString('fr-FR')}
          <span> FCFA</span>
        </p>
      </div>
    </div>
  );
}
