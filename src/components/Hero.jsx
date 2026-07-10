// Limite le nombre de cartes par rangée pour économiser la mémoire (Smart TV)
const MAX_PER_ROW = 8;

export default function Hero({ products, storeName }) {
  // 2 rangées au lieu de 3 — moins de nœuds DOM
  const half = Math.ceil(products.length / 2);
  const row1 = products.slice(0, half).slice(0, MAX_PER_ROW);
  const row2 = products.slice(half).slice(0, MAX_PER_ROW);

  // Duplication ×2 suffit pour l'animation en boucle
  const makeLoop = (arr) => (arr.length === 0 ? products.slice(0, MAX_PER_ROW) : [...arr, ...arr]);

  return (
    <div className="hero">
      <div className="hero__bg-solid" />

      <div className="hero__logo-bg">
        <img src="/logo-bg.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      </div>

      <div className="hero__store-label">{storeName}</div>

      <div className="hero__rows">
        <HeroRow items={makeLoop(row1)} direction="left"  speed={36} />
        <HeroRow items={makeLoop(row2)} direction="right" speed={28} />
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
        <img
          src={product.image}
          alt={product.name}
          className="hero__card-img"
          loading="lazy"
          decoding="async"
        />
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
