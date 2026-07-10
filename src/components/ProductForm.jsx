import { useEffect, useState } from 'react';
import { generatePlaceholder } from '../utils/placeholder';

const EMPTY_PRODUCT = {
  name: '',
  price: '',
  category: '',
  description: '',
  image: '',
  inStock: true,
  featured: false,
};

export default function ProductForm({ initialProduct, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_PRODUCT);

  useEffect(() => {
    setForm(initialProduct ? { ...EMPTY_PRODUCT, ...initialProduct } : EMPTY_PRODUCT);
  }, [initialProduct]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleChange('image', reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const image = form.image || generatePlaceholder(form.name);
    onSubmit({
      ...form,
      name: form.name.trim(),
      price: Number(form.price) || 0,
      image,
    });
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="product-form__grid">
        <div className="product-form__field">
          <label>Nom du produit *</label>
          <input
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ex : Riz Parfumé 5kg"
            required
          />
        </div>

        <div className="product-form__field">
          <label>Prix</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="product-form__field">
          <label>Catégorie</label>
          <input
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Ex : Épicerie"
          />
        </div>

        <div className="product-form__field product-form__field--checkbox">
          <label>
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => handleChange('inStock', e.target.checked)}
            />
            En stock
          </label>
        </div>

        <div className="product-form__field product-form__field--checkbox">
          <label>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
            />
            Mettre en avant (carrousel)
          </label>
        </div>
      </div>

      <div className="product-form__field">
        <label>Image (fichier)</label>
        <input type="file" accept="image/*" onChange={handleImageFile} />
      </div>

      <div className="product-form__field">
        <label>ou URL de l'image</label>
        <input
          value={form.image?.startsWith('data:') ? '' : form.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="https://..."
        />
      </div>

      {form.image && (
        <div className="product-form__preview">
          <img src={form.image} alt="Aperçu" />
        </div>
      )}

      <div className="product-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="btn btn--primary">
          Enregistrer
        </button>
      </div>
    </form>
  );
}
