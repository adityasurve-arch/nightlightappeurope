export const MENU = [
  {
    category: 'Vodka',
    emoji: '🥃',
    items: [
      { id: 'v1', name: 'Grey Goose', description: 'French premium vodka', price: 16, brand: 'Grey Goose' },
      { id: 'v2', name: 'Belvedere', description: 'Polish rye vodka', price: 18, brand: 'Belvedere' },
      { id: 'v3', name: 'Absolut', description: 'Swedish classic', price: 12, brand: 'Absolut' },
      { id: 'v4', name: 'House Vodka', description: 'Bar selection', price: 8, brand: 'House' },
    ],
  },
  {
    category: 'Gin',
    emoji: '🍸',
    items: [
      { id: 'g1', name: "Hendrick's", description: 'Scottish gin, cucumber & rose', price: 15, brand: 'Hendricks' },
      { id: 'g2', name: 'Tanqueray', description: 'Classic London Dry', price: 13, brand: 'Tanqueray' },
      { id: 'g3', name: 'Bombay Sapphire', description: 'Aromatic & light', price: 12, brand: 'Bombay' },
    ],
  },
  {
    category: 'Cocktails',
    emoji: '🍹',
    items: [
      { id: 'c1', name: 'Aperol Spritz', description: 'Aperol, prosecco, soda', price: 14, brand: 'Aperol' },
      { id: 'c2', name: 'Negroni', description: 'Gin, Campari, vermouth', price: 16, brand: 'Mixed' },
      { id: 'c3', name: 'Moscow Mule', description: 'Vodka, ginger beer, lime', price: 13, brand: 'Mixed' },
      { id: 'c4', name: 'Espresso Martini', description: 'Vodka, espresso, Kahlúa', price: 15, brand: 'Mixed' },
    ],
  },
  {
    category: 'Beer',
    emoji: '🍺',
    items: [
      { id: 'b1', name: 'Heineken', description: 'Dutch lager', price: 7, brand: 'Heineken' },
      { id: 'b2', name: 'Kronenbourg 1664', description: 'French lager', price: 7, brand: 'Kronenbourg' },
      { id: 'b3', name: 'Corona', description: 'Mexican lager', price: 8, brand: 'Corona' },
    ],
  },
  {
    category: 'Soft',
    emoji: '🥤',
    items: [
      { id: 's1', name: 'San Pellegrino', description: 'Sparkling water', price: 4, brand: 'San Pellegrino' },
      { id: 's2', name: 'Fever-Tree Tonic', description: 'Premium tonic', price: 5, brand: 'Fever-Tree' },
      { id: 's3', name: 'Coca-Cola', description: 'Classic', price: 4, brand: 'Coca-Cola' },
    ],
  },
]

export function getItemById(id) {
  for (const cat of MENU) {
    const item = cat.items.find(i => i.id === id)
    if (item) return item
  }
  return null
}
