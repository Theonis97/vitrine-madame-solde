# Vitrine — Madame Solde

Application d'affichage pour écran de magasin : les produits en stock défilent en continu
(effet "tapis roulant") pendant que les clients patientent. Une interface d'administration
permet de gérer les produits sans toucher au code.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez ensuite `http://localhost:5173/` :

- **`/`** → la vitrine à afficher sur l'écran du magasin (à mettre en plein écran, F11).
- **`/admin`** → l'espace d'administration (mot de passe par défaut : `admin1234`, à changer
  dans Paramètres après la première connexion).

## Fonctionnalités

- Défilement continu des produits sur 1 à 4 lignes (façon tapis roulant), sens alterné.
- Ajout / modification / suppression de produits (nom, prix, catégorie, stock, image).
- Import d'image par fichier (converti automatiquement) ou par URL.
- Image de remplacement générée automatiquement si aucune photo n'est fournie.
- Personnalisation : nom du magasin, devise, couleurs (jaune/rouge par défaut), vitesse de
  défilement, nombre de lignes, message de bienvenue.
- Horloge et date en direct sur l'écran vitrine.
- Les produits marqués "hors stock" disparaissent automatiquement de la vitrine.

## Fonctionnement des données

Les produits et les paramètres sont enregistrés dans le stockage local du navigateur
(`localStorage`). Cela signifie :

- Si l'écran vitrine et l'administration sont ouverts dans le **même navigateur** (deux
  onglets, ou un PC + un second écran/TV branché sur le même PC), les mises à jour
  apparaissent automatiquement, en direct.
- Si vous gérez les produits depuis un **autre appareil** (téléphone, autre PC), les données
  ne se synchronisent pas automatiquement : il faudra prévoir une solution serveur pour ce
  cas d'usage (peut être ajoutée plus tard si besoin).

## Utilisation en boutique (écran de patientation)

1. Ouvrez `http://localhost:5173/` (ou l'adresse du site une fois déployé) sur l'écran/TV.
2. Passez en plein écran (touche F11 sur la plupart des navigateurs).
3. Gérez vos produits depuis `/admin` sur le même PC (autre onglet) — les changements
   s'affichent instantanément sur l'écran vitrine.

## Build de production

```bash
npm run build
npm run preview
```

Le résultat est généré dans le dossier `dist/`, à héberger sur un serveur web classique ou à
ouvrir directement sur l'ordinateur relié à l'écran du magasin.
