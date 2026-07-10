const LOCAL_EVENT = 'vitrine:local-update';

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Impossible de lire "${key}" depuis le stockage local`, err);
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // 'storage' ne se déclenche que sur les AUTRES onglets ; on notifie aussi l'onglet courant.
    window.dispatchEvent(new CustomEvent(LOCAL_EVENT, { detail: { key } }));
  } catch (err) {
    console.error(`Impossible d'écrire "${key}" dans le stockage local`, err);
  }
}

export function subscribeToKey(key, callback) {
  const onStorage = (e) => {
    if (e.key === key) callback();
  };
  const onLocal = (e) => {
    if (e.detail?.key === key) callback();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(LOCAL_EVENT, onLocal);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(LOCAL_EVENT, onLocal);
  };
}
