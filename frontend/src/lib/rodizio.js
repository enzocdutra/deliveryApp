export const RODIZIO_NAME = 'Rodízio na caixa LB';
export const REQUIRED_FLAVORS = 6;

export const rodizioFlavors = [
  { id: 'onion', name: 'Onion', description: 'Cheddar e anel de cebola empanado' },
  { id: 'bacon', name: 'Bacon', description: 'Cheddar, alface, tomate e bacon' },
  { id: 'cheese', name: 'Cheese', description: 'Cheddar cremoso e queijo cheddar' },
  { id: 'doritos', name: 'Doritos', description: 'Cheddar, Doritos e bacon' },
  { id: 'barbecue', name: 'Barbecue', description: 'Cheddar, cebola caramelizada e barbecue' },
  { id: 'american', name: 'American', description: 'Catupiry, cebola crua roxa e picles' },
  { id: 'catupiry', name: 'Catupiry', description: 'Catupiry e bacon' },
  { id: '4-queijos', name: '4 Queijos', description: 'Catupiry, cheddar, provolone e mussarela' },
  { id: 'sweet-chilli', name: 'Sweet Chilli', description: 'Cheddar, geleia de pimenta e bacon' },
  { id: 'nutella', name: 'Nutella', description: 'Nutella e morango' },
  { id: 'banoffe', name: 'Banoffe', description: 'Doce de leite e banana' },
  { id: 'romeu-julieta', name: 'Romeu e Julieta', description: 'Bife, mussarela e goiabada' },
  { id: 'parrillero', name: 'Parrillero', description: 'Bife, doce de leite e provolone' },
];

export function isRodizio(name = '') {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
    === 'rodizio na caixa lb';
}

export function hasValidRodizioFlavors(item) {
  if (!isRodizio(item.name)) return true;
  return Array.isArray(item.flavors)
    && item.flavors.length === REQUIRED_FLAVORS
    && new Set(item.flavors).size === REQUIRED_FLAVORS
    && item.flavors.every((id) => rodizioFlavors.some((flavor) => flavor.id === id));
}

export function flavorNames(ids = []) {
  return rodizioFlavors.filter((flavor) => ids.includes(flavor.id)).map((flavor) => flavor.name);
}

export function flavorKey(item) {
  return [...(item.flavors || [])].sort().join(',');
}
