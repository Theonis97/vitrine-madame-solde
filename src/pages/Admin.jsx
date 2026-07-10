import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, setAdminPassword, getAdminPassword } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import '../styles/admin.css';

export default function Admin() {
  const { products, settings, addProduct, updateProduct, deleteProduct, updateSettings } =
    useStore();
  const { logout } = useAuth();
  const [tab, setTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function handleCreate(data) {
    addProduct(data);
    setShowForm(false);
  }

  function handleUpdate(data) {
    updateProduct(editingProduct.id, data);
    setEditingProduct(null);
    setShowForm(false);
  }

  function handleDelete(id) {
    if (confirm('Supprimer ce produit ?')) deleteProduct(id);
  }

  function openCreate() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function openEdit(product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  return (
    <div className="admin">
      <header className="admin__header">
        <h1>
          Administration — <span>{settings.storeName}</span>
        </h1>
        <div className="admin__header-actions">
          <Link to="/" className="btn btn--ghost" target="_blank" rel="noreferrer">
            Voir la vitrine ↗
          </Link>
          <button className="btn btn--ghost" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </header>

      <nav className="admin__tabs">
        <button
          className={tab === 'products' ? 'active' : ''}
          onClick={() => setTab('products')}
        >
          Produits ({products.length})
        </button>
        <button
          className={tab === 'preview' ? 'active' : ''}
          onClick={() => setTab('preview')}
        >
          Aperçu (carrousel)
        </button>
        <button
          className={tab === 'settings' ? 'active' : ''}
          onClick={() => setTab('settings')}
        >
          Paramètres
        </button>
      </nav>

      {tab === 'products' && (
        <section className="admin__section">
          <div className="admin__section-head">
            <h2>Liste des produits</h2>
            <button className="btn btn--primary" onClick={openCreate}>
              + Ajouter un produit
            </button>
          </div>

          {showForm && (
            <div className="admin__form-panel">
              <h3>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h3>
              <ProductForm
                initialProduct={editingProduct}
                onSubmit={editingProduct ? handleUpdate : handleCreate}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
              />
            </div>
          )}

          <div className="admin__table-wrap">
            <table className="admin__table">
              <thead>
                <tr>
                  <th></th>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Carrousel</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="admin__empty">
                      Aucun produit. Ajoutez-en un pour commencer.
                    </td>
                  </tr>
                )}
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.image} alt={product.name} className="admin__thumb" />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category || '—'}</td>
                    <td>
                      {Number(product.price).toLocaleString('fr-FR')} {settings.currency}
                    </td>
                    <td>
                      <label className="admin__stock-toggle">
                        <input
                          type="checkbox"
                          checked={product.inStock !== false}
                          onChange={(e) =>
                            updateProduct(product.id, { inStock: e.target.checked })
                          }
                        />
                        {product.inStock !== false ? 'En stock' : 'Rupture'}
                      </label>
                    </td>
                    <td>
                      <button
                        className={`admin__star ${product.featured ? 'is-active' : ''}`}
                        onClick={() => updateProduct(product.id, { featured: !product.featured })}
                        title="Mettre en avant dans le carrousel"
                      >
                        ★
                      </button>
                    </td>
                    <td className="admin__row-actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(product)}>
                        Modifier
                      </button>
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'preview' && <PreviewPanel />}

      {tab === 'settings' && <SettingsPanel settings={settings} updateSettings={updateSettings} />}
    </div>
  );
}

function PreviewPanel() {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <section className="admin__section">
      <div className="admin__section-head">
        <h2>Aperçu en direct de l'écran vitrine</h2>
        <button className="btn btn--ghost" onClick={() => setReloadKey((k) => k + 1)}>
          ↻ Rafraîchir
        </button>
      </div>
      <p className="admin__preview-hint">
        Ceci est un aperçu en temps réel de ce qui s'affiche sur l'écran du magasin, carrousel
        inclus. Les changements de produits ou de paramètres s'y reflètent automatiquement.
      </p>
      <div className="admin__preview-frame">
        <iframe key={reloadKey} src="/" title="Aperçu de la vitrine" />
      </div>
    </section>
  );
}

function SettingsPanel({ settings, updateSettings }) {
  const [form, setForm] = useState(settings);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [passwordMessage, setPasswordMessage] = useState('');

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    updateSettings({
      ...form,
      scrollSpeedSeconds: Number(form.scrollSpeedSeconds) || 40,
      carouselSpeedSeconds: Number(form.carouselSpeedSeconds) || 6,
      rows: Number(form.rows) || 1,
    });
  }

  function handlePasswordChange(e) {
    e.preventDefault();
    if (passwords.current !== getAdminPassword()) {
      setPasswordMessage('Mot de passe actuel incorrect.');
      return;
    }
    if (passwords.next.length < 4) {
      setPasswordMessage('Le nouveau mot de passe doit contenir au moins 4 caractères.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordMessage('La confirmation ne correspond pas.');
      return;
    }
    setAdminPassword(passwords.next);
    setPasswords({ current: '', next: '', confirm: '' });
    setPasswordMessage('Mot de passe mis à jour avec succès.');
  }

  return (
    <section className="admin__section">
      <h2>Paramètres de la vitrine</h2>
      <form className="settings-form" onSubmit={handleSave}>
        <div className="product-form__grid">
          <div className="product-form__field">
            <label>Nom du magasin</label>
            <input value={form.storeName} onChange={(e) => handleChange('storeName', e.target.value)} />
          </div>
          <div className="product-form__field">
            <label>Slogan (sous le nom)</label>
            <input value={form.tagline} onChange={(e) => handleChange('tagline', e.target.value)} />
          </div>
          <div className="product-form__field">
            <label>Devise</label>
            <input value={form.currency} onChange={(e) => handleChange('currency', e.target.value)} />
          </div>
          <div className="product-form__field">
            <label>Téléphone (pied de page)</label>
            <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          </div>
          <div className="product-form__field">
            <label>Adresse (pied de page)</label>
            <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
          </div>
          <div className="product-form__field">
            <label>Couleur principale (jaune)</label>
            <input
              type="color"
              value={form.accentColor}
              onChange={(e) => handleChange('accentColor', e.target.value)}
            />
          </div>
          <div className="product-form__field">
            <label>Couleur secondaire (rouge)</label>
            <input
              type="color"
              value={form.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
            />
          </div>
          <div className="product-form__field">
            <label>Vitesse du tapis roulant (secondes)</label>
            <input
              type="number"
              min="10"
              max="120"
              value={form.scrollSpeedSeconds}
              onChange={(e) => handleChange('scrollSpeedSeconds', e.target.value)}
            />
          </div>
          <div className="product-form__field">
            <label>Vitesse du carrousel (secondes)</label>
            <input
              type="number"
              min="3"
              max="30"
              value={form.carouselSpeedSeconds}
              onChange={(e) => handleChange('carouselSpeedSeconds', e.target.value)}
            />
          </div>
          <div className="product-form__field">
            <label>Nombre de lignes</label>
            <input
              type="number"
              min="1"
              max="4"
              value={form.rows}
              onChange={(e) => handleChange('rows', e.target.value)}
            />
          </div>
        </div>
        <div className="product-form__field">
          <label>Message défilant (bandeau du pied de page)</label>
          <input
            value={form.welcomeMessage}
            onChange={(e) => handleChange('welcomeMessage', e.target.value)}
          />
        </div>
        <div className="product-form__actions">
          <button type="submit" className="btn btn--primary">
            Enregistrer les paramètres
          </button>
        </div>
      </form>

      <h2 className="settings-form__section-title">Changer le mot de passe admin</h2>
      <form className="settings-form" onSubmit={handlePasswordChange}>
        <div className="product-form__grid">
          <div className="product-form__field">
            <label>Mot de passe actuel</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            />
          </div>
          <div className="product-form__field">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={passwords.next}
              onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
            />
          </div>
          <div className="product-form__field">
            <label>Confirmer</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            />
          </div>
        </div>
        {passwordMessage && <p className="admin__password-message">{passwordMessage}</p>}
        <div className="product-form__actions">
          <button type="submit" className="btn btn--primary">
            Mettre à jour le mot de passe
          </button>
        </div>
      </form>
    </section>
  );
}
