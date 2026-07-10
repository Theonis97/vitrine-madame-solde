export default function Hero({ products, storeName }) {
  // Trois rangées pour le défilement
  const half = Math.ceil(products.length / 3);
  const row1 = products.slice(0, half);
  const row2 = products.slice(half, half * 2);
  const row3 = products.slice(half * 2);

  const makeLoop = (arr) => (arr.length === 0 ? products : [...arr, ...arr, ...arr]);

  return (
    <div className="hero">
      {/* Fond dégradé sobre */}
      <div className="hero__bg-solid" />

      {/* Logo en filigrane */}
      <div className="hero__logo-bg">
        <img src="/logo-bg.png" alt="" aria-hidden="true" />
      </div>

      {/* Bandeau nom du magasin */}
      <div className="hero__store-label">{storeName}</div>

      {/* Les 3 rangées de produits visibles */}
      <div className="hero__rows">
        <HeroRow items={makeLoop(row1)} direction="left"  speed={38} />
        <HeroRow items={makeLoop(row2)} direction="right" speed={30} />
        <HeroRow items={makeLoop(row3)} direction="left"  speed={44} />
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
        <img src={product.image} alt={product.name} className="hero__card-img" />
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
