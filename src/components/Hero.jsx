import { useEffect, useState } from 'react';

const BACKGROUNDS = [
  '/bg-paysage.jpg',                                                                                       // Plage tropicale (votre image)
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&fit=crop',   // Lac de montagne
  'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=1920&q=80&fit=crop',   // Forêt mystique
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80&fit=crop',   // Vue nature aérienne
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80&fit=crop',   // Cascade
  'https://images.unsplash.com/photo-1510784722466-f2aa240c0e18?w=1920&q=80&fit=crop',   // Coucher de soleil mer
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80&fit=crop',   // Montagne dorée
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1920&q=80&fit=crop',   // Forêt automne
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1920&q=80&fit=crop',   // Coucher soleil champs
  'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80&fit=crop',   // Plage tropicale 2
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80&fit=crop',   // Lac brume montagne
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80&fit=crop',   // Plaine verte lever soleil
];

const BG_INTERVAL = 1.5 * 60 * 1000;

// Fond rotatif en position FIXED → couvre toute la page (navbar + hero)
export function PageBackground() {
  const [bgIndex, setBgIndex] = useState(0);
  const [fadeIn,  setFadeIn]  = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setBgIndex((i) => (i + 1) % BACKGROUNDS.length);
        setFadeIn(true);
      }, 1000);
    }, BG_INTERVAL);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div
        className="page-bg"
        style={{ backgroundImage: `url('${BACKGROUNDS[bgIndex]}')`, opacity: fadeIn ? 1 : 0 }}
      />
      <div className="page-bg-overlay" />
    </>
  );
}

export default function Hero({ products, storeName }) {
  const count = products.length;
  if (count === 0) return null;
  if (count <= 10) return <CarouselSingle products={products} storeName={storeName} perSlide={1} />;
  if (count <= 20) return <CarouselSingle products={products} storeName={storeName} perSlide={2} />;
  return <ScrollingRows products={products} storeName={storeName} />;
}

/* ── Carrousel (1 ou 2 produits) ── */
function CarouselSingle({ products, storeName, perSlide }) {
  const [index,   setIndex]   = useState(0);
  const [visible, setVisible] = useState(true);
  const total = Math.ceil(products.length / perSlide);

  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIndex((i) => (i + 1) % total); setVisible(true); }, 500);
    }, 5000);
    return () => clearInterval(t);
  }, [total]);

  const current = products.slice(index * perSlide, index * perSlide + perSlide);

  return (
    <div className="hero">
      <div className="hero__store-label">{storeName}</div>
      <div className={`hero__slide-wrap${visible ? ' hero__slide--in' : ' hero__slide--out'}`}>
        {current.map((p) => <SlideCard key={p.id} product={p} wide={perSlide === 1} />)}
      </div>
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
        {/* object-fit: contain → image entière visible, pas rognée */}
        <img src={product.image} alt={product.name} className="hero__slide-img" decoding="async" />
        {product.category && <span className="hero__slide-cat">{product.category}</span>}
      </div>
      <div className="hero__slide-body">
        <p className="hero__slide-name">{product.name}</p>
        <p className="hero__slide-price">
          {Number(product.price).toLocaleString('fr-FR')}<span> FCFA</span>
        </p>
        <p className="hero__slide-stock">
          {product.inStock !== false ? 'Disponible en boutique' : 'Bientôt de retour'}
        </p>
      </div>
    </div>
  );
}

/* ── 3 rangées défilantes (21+) ── */
const MAX_PER_ROW = 10;

function ScrollingRows({ products, storeName }) {
  const third = Math.ceil(products.length / 3);
  const loop  = (arr) => [...arr, ...arr];
  const r1 = loop(products.slice(0, third).slice(0, MAX_PER_ROW));
  const r2 = loop(products.slice(third, third * 2).slice(0, MAX_PER_ROW));
  const r3 = loop(products.slice(third * 2).slice(0, MAX_PER_ROW));

  return (
    <div className="hero">
      <div className="hero__store-label">{storeName}</div>
      <div className="hero__rows">
        <HeroRow items={r1} direction="left"  speed={36} />
        <HeroRow items={r2} direction="right" speed={28} />
        <HeroRow items={r3} direction="left"  speed={44} />
      </div>
    </div>
  );
}

function HeroRow({ items, direction, speed }) {
  return (
    <div className="hero__row-wrap">
      <div className={`hero__row hero__row--${direction}`} style={{ animationDuration: `${speed}s` }}>
        {items.map((p, i) => <HeroCard key={`${p.id}-${i}`} product={p} />)}
      </div>
    </div>
  );
}

function HeroCard({ product }) {
  return (
    <div className="hero__card">
      <div className="hero__card-img-wrap">
        <img src={product.image} alt={product.name} className="hero__card-img" decoding="async" />
        {product.category && <span className="hero__card-cat">{product.category}</span>}
      </div>
      <div className="hero__card-body">
        <p className="hero__card-name">{product.name}</p>
        <p className="hero__card-price">{Number(product.price).toLocaleString('fr-FR')}<span> FCFA</span></p>
      </div>
    </div>
  );
}
