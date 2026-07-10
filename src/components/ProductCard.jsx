export default function ProductCard({ product, currency }) {
  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.image} alt={product.name} className="product-card__image" />
        {!product.inStock && <span className="product-card__badge">Rupture</span>}
        {product.category && (
          <span className="product-card__ribbon">{product.category}</span>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__row">
          <h3 className="product-card__name">{product.name}</h3>
        </div>
        <div className="product-card__row product-card__row--price">
          <span className="product-card__stock">
            {product.inStock !== false ? 'Disponible en boutique' : 'Bientôt de retour'}
          </span>
          <div className="product-card__price-block">
            <span className="product-card__price-label">Prix</span>
            <p className="product-card__price">
              {Number(product.price).toLocaleString('fr-FR')} <span>{currency}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
