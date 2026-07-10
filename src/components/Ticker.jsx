import ProductCard from './ProductCard';

function splitIntoRows(items, rowCount) {
  const rows = Array.from({ length: rowCount }, () => []);
  items.forEach((item, index) => {
    rows[index % rowCount].push(item);
  });
  return rows;
}

export default function Ticker({ products, currency, speedSeconds, rowCount }) {
  const rows = splitIntoRows(products, rowCount);

  return (
    <div className="ticker">
      {rows.map((rowItems, rowIndex) => {
        if (rowItems.length === 0) return null;
        const direction = rowIndex % 2 === 0 ? 'left' : 'right';
        // On duplique deux fois la liste pour garantir une boucle infinie sans coupure visible.
        const loopItems = [...rowItems, ...rowItems];
        return (
          <div className="ticker__row" key={rowIndex}>
            <div
              className={`ticker__track ticker__track--${direction}`}
              style={{ animationDuration: `${speedSeconds}s` }}
            >
              {loopItems.map((product, i) => (
                <ProductCard key={`${product.id}-${i}`} product={product} currency={currency} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
