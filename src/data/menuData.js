export const CATEGORIES = [
  { id: 'pizzas', name: 'Pizzas Tradicionais', emoji: '🍕' },
  { id: 'doces', name: 'Pizzas Doces', emoji: '🍫' },
  { id: 'porcoes', name: 'Porções & Entradas', emoji: '🍟' },
  { id: 'bebidas', name: 'Bebidas', emoji: '🥤' }
];

export const MENU_ITEMS = [
  {
    id: 'pz-1',
    category: 'pizzas',
    name: 'Calabresa Acebolada',
    description: 'Molho de tomate artesanal, muçarela derretida, calabresa fatiada defumada, cebola roxa e orégano.',
    price: 49.90,
    popular: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'pz-2',
    category: 'pizzas',
    name: 'Margherita Especial',
    description: 'Molho de tomate pelati, muçarela fresca, rodelas de tomate italiano, folhas de manjericão fresco e azeite extra virgem.',
    price: 47.90,
    popular: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'pz-3',
    category: 'pizzas',
    name: 'Portuguesa Clássica',
    description: 'Muçarela, presunto cozido, ovos cozidos, cebola, ervilha fresca, azeitonas pretas e orégano.',
    price: 54.90,
    popular: false,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'pz-4',
    category: 'pizzas',
    name: 'Frango com Catupiry Original',
    description: 'Peito de frango desfiado e temperado na casa coberto com legítimo Catupiry cremoso e milho.',
    price: 55.90,
    popular: true,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'pz-5',
    category: 'pizzas',
    name: 'Quatro Queijos',
    description: 'Combinação cremosa de muçarela, provolone defumado, parmesão curado e gorgonzola.',
    price: 56.90,
    popular: false,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'dc-1',
    category: 'doces',
    name: 'Chocolate com Morango',
    description: 'Ganache de chocolate meio amargo cremoso, morangos frescos fatiados e raspas de chocolate.',
    price: 44.90,
    popular: true,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'dc-2',
    category: 'doces',
    name: 'Banana Nevada',
    description: 'Banana nanica caramelizada, canela em pó, leite condensado e cobertura de chocolate branco.',
    price: 42.90,
    popular: false,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'pr-1',
    category: 'porcoes',
    name: 'Batata Frita com Cheddar e Bacon',
    description: 'Porção generosa (500g) de batatas crocantes cobertas com cheddar cremoso e cubos de bacon frito.',
    price: 32.90,
    popular: true,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'pr-2',
    category: 'porcoes',
    name: 'Calabresa Acebolada na Chapa',
    description: '400g de calabresa fatiada acebolada, acompanha cesta de pães fatiados e vinagrete.',
    price: 36.90,
    popular: false,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'pr-3',
    category: 'porcoes',
    name: 'Cornicione de Alho e Parmesão',
    description: 'Tiras de massa de pizza assadas no forno a lenha com manteiga de alho, parmesão e ervas finas.',
    price: 22.90,
    popular: false,
    image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'bb-1',
    category: 'bebidas',
    name: 'Coca-Cola 2 Litros',
    description: 'Garrafa 2L bem gelada.',
    price: 14.00,
    popular: true,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'bb-2',
    category: 'bebidas',
    name: 'Guaraná Antarctica 2 Litros',
    description: 'Garrafa 2L bem gelada.',
    price: 13.00,
    popular: false,
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'bb-3',
    category: 'bebidas',
    name: 'Suco Natural de Laranja 500ml',
    description: 'Espremido na hora, 100% fruta sem adição de açúcar.',
    price: 11.50,
    popular: false,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'bb-4',
    category: 'bebidas',
    name: 'Heineken Long Neck 330ml',
    description: 'Cerveja puro malte estupidamente gelada.',
    price: 9.50,
    popular: true,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=500&q=80'
  }
];

export const BORDERS = [
  { id: 'tradicional', name: 'Borda Tradicional', price: 0 },
  { id: 'catupiry', name: 'Borda Recheada Catupiry', price: 8.00 },
  { id: 'cheddar', name: 'Borda Recheada Cheddar', price: 8.00 },
  { id: 'chocolate', name: 'Borda Doce Chocolate', price: 10.00 }
];
