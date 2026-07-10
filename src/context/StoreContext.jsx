import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { sampleProducts } from '../data/sampleProducts';

const SETTINGS_KEY = 'vitrine_settings';
const ADMIN_KEY    = 'vitrine_admin_password';

export const DEFAULT_SETTINGS = {
  storeName:            'Madame Solde',
  tagline:              'Mode & Bonnes Affaires',
  currency:             'FCFA',
  scrollSpeedSeconds:   40,
  carouselSpeedSeconds: 6,
  accentColor:          '#1565C0',
  secondaryColor:       '#D32F2F',
  rows:                 2,
  welcomeMessage:       'Bienvenue chez Madame Solde — merci de patienter quelques instants...',
  phone:                '',
  address:              '',
};

// Les paramètres et le mot de passe restent en localStorage (pas sensibles pour prod)
function readSettings()  { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || DEFAULT_SETTINGS; } catch { return DEFAULT_SETTINGS; } }
function writeSettings(v){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(v)); }
export function getAdminPassword(){ return localStorage.getItem(ADMIN_KEY) || 'admin1234'; }
export function setAdminPassword(p){ localStorage.setItem(ADMIN_KEY, p); }

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [settings, setSettingsState] = useState(readSettings);

  // ── Chargement initial depuis Supabase ──────────────────────────────────
  useEffect(() => {
    fetchProducts();

    // Abonnement temps réel : la vitrine se met à jour automatiquement
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement produits :', error.message);
      setProducts(sampleProducts);
    } else if (data.length === 0) {
      await seedSampleProducts();
    } else {
      setProducts(data.map(normalize));
    }
    setLoading(false);
  }

  async function seedSampleProducts() {
    const rows = sampleProducts.map(({ id: _id, createdAt: _c, inStock, ...rest }) => ({
      ...rest,
      in_stock: inStock ?? true,
    }));
    const { data, error } = await supabase.from('products').insert(rows).select();
    if (!error && data) setProducts(data.map(normalize));
  }

  // Supabase → camelCase pour le reste de l'app
  function normalize(row) {
    return {
      ...row,
      inStock: row.in_stock ?? row.inStock ?? true,
    };
  }

  // ── CRUD ────────────────────────────────────────────────────────────────
  const addProduct = useCallback(async (product) => {
    const { image, ...rest } = product;
    const { data, error } = await supabase
      .from('products')
      .insert({ ...rest, image: image || null, in_stock: product.inStock ?? true, featured: product.featured ?? false })
      .select()
      .single();
    if (error) { console.error(error); return; }
    setProducts((prev) => [normalize(data), ...prev]);
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    const patch = { ...updates };
    // Convertit les noms camelCase → snake_case pour Supabase
    if ('inStock' in patch) { patch.in_stock = patch.inStock; delete patch.inStock; }
    const { error } = await supabase.from('products').update(patch).eq('id', id);
    if (error) { console.error(error); return; }
    setProducts((prev) => prev.map((p) => p.id === id ? normalize({ ...p, ...updates }) : p));
  }, []);

  const deleteProduct = useCallback(async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── Paramètres (localStorage) ───────────────────────────────────────────
  const updateSettings = useCallback((updates) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...updates };
      writeSettings(next);
      return next;
    });
  }, []);

  return (
    <StoreContext.Provider value={{
      products, loading, settings,
      addProduct, updateProduct, deleteProduct, updateSettings,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
