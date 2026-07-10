import { generatePlaceholder } from '../utils/placeholder';

const items = [
  { name: 'Robe d\'été fleurie', category: 'Femme' },
  { name: 'Jean slim homme', category: 'Homme' },
  { name: 'Chemise à carreaux', category: 'Homme' },
  { name: 'Ensemble enfant 2 pièces', category: 'Enfant' },
  { name: 'Veste en jean', category: 'Femme' },
  { name: 'Baskets running', category: 'Chaussures' },
  { name: 'Sac à main tendance', category: 'Accessoires' },
  { name: 'T-shirt coton bio', category: 'Homme' },
  { name: 'Pull col rond', category: 'Femme' },
  { name: 'Ceinture cuir', category: 'Accessoires' },
  { name: 'Pyjama enfant', category: 'Enfant' },
  { name: 'Doudoune hiver', category: 'Femme' },
];

// Recalculé à chaque import — les images ne contiennent plus de texte
export const sampleProducts = items.map(({ name, category }, index) => ({
  id: `sample-${index + 1}`,
  name,
  price: Math.round((Math.random() * 3500 + 500) * 100) / 100,
  category,
  description: '',
  image: generatePlaceholder(name),
  inStock: true,
  featured: index < 5,
  createdAt: Date.now() - index * 1000,
}));
