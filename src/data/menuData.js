const image = {
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85',
  hotdog: 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=700&q=85',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=85',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85',
  sausage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=85',
  pastry: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85',
  sweet: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=85',
  soda: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=700&q=85',
  juice: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=700&q=85',
  beer: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=700&q=85'
};

export const CATEGORIES = [
  { id: 'lanches', name: 'Lanches', emoji: '🍔' },
  { id: 'porcoes', name: 'Porções', emoji: '🍟' },
  { id: 'pasteis-salgados', name: 'Pastéis salgados', emoji: '🥟' },
  { id: 'pasteis-doces', name: 'Pastéis doces', emoji: '🍫' },
  { id: 'bebidas', name: 'Bebidas', emoji: '🥤' }
];

const products = [
  ['MISTO', 18, 'Pão, queijo e presunto.', 'sandwich'],
  ['AMERICANO', 20, 'Lanche estilo americano.', 'sandwich'],
  ['HOT DOG', 22, 'Cachorro-quente tradicional.', 'hotdog'],
  ['HOT DOG DUPLO', 24, 'Cachorro-quente duplo.', 'hotdog'],
  ['X BURGUER', 28, 'Hambúrguer com queijo.', 'burger'],
  ['X BURGUER DUPLO', 30, 'Dois hambúrgueres com queijo.', 'burger'],
  ['X FRANGO', 30, 'Lanche de frango.', 'burger'],
  ['X SALADA', 30, 'Hambúrguer com salada.', 'burger'],
  ['X BACON', 32, 'Hambúrguer com bacon.', 'burger'],
  ['X CALABRESA', 32, 'Lanche com calabresa.', 'burger'],
  ['X EGG', 32, 'Hambúrguer com ovo.', 'burger'],
  ['X CABURGUER', 32, 'Combinação da casa.', 'burger'],
  ['X CAFRANGO', 32, 'Combinação de calabresa e frango.', 'burger'],
  ['X CALAFRANGO', 32, 'Combinação de calabresa e frango.', 'burger'],
  ['X CALABACON', 32, 'Calabresa com bacon.', 'burger'],
  ['X FRANBACON', 32, 'Frango com bacon.', 'burger'],
  ['X CHURRASCO', 35, 'Lanche com carne de churrasco.', 'burger'],
  ['X FRANBURGUER', 35, 'Combinação de frango e hambúrguer.', 'burger'],
  ['X TUDO', 40, 'Lanche completo da casa.', 'burger'],
  ['X TUDO DUPLO', 48, 'Lanche completo em versão dupla.', 'burger'],
].map(([name, price, description, photo], index) => ({
  id: `lan-${index + 1}`, category: 'lanches', name, price, description, image: image[photo], popular: index === 4 || index === 18
}));

const portions = [
  ['Batata Frita', 24, 'Porção de batata frita.', 'fries'],
  ['Batata Suprema', 30, 'Batata frita com bacon e cheddar.', 'fries'],
  ['Batata Mineira', 33, 'Batata frita com bacon e queijo.', 'fries'],
  ['Calabresa Acebolada', 45, 'Porção de calabresa acebolada.', 'sausage'],
  ['Contra Filé Acebolado', 55, 'Porção de contra filé acebolado.', 'sausage']
].map(([name, price, description, photo], index) => ({ id: `por-${index + 1}`, category: 'porcoes', name, price, description, image: image[photo] }));

const savoryPastelFlavors = ['Pizza', 'Queijo', 'Carne', 'Carne com Cheddar', 'Catupiry', 'Calabresa', 'Carne Seca', 'Frango com Catupiry', 'Frango com Cheddar', 'Palmito', '3 Queijos', 'Bacon', 'Brócolis', 'Especial'];
const savoryPastels = savoryPastelFlavors.map((flavor, index) => ({
  id: `ps-${index + 1}`, category: 'pasteis-salgados', name: `Pastel de ${flavor}`, price: 13,
  description: 'Preço informado para demonstração: os sabores variam de R$ 13,00 a R$ 18,00. Confirme o valor do sabor pelo WhatsApp antes de finalizar.', image: image.pastry
}));
savoryPastels.push(
  { id: 'ps-tudao', category: 'pasteis-salgados', name: 'Pastel Tudão', price: 18, description: 'Pastel especial Tudão.', image: image.pastry, popular: true },
  { id: 'ps-pastelzao', category: 'pasteis-salgados', name: 'Pastelzão', price: 24, description: 'Pastel em tamanho grande.', image: image.pastry },
  { id: 'ps-mini', category: 'pasteis-salgados', name: 'Mini Pastel (unidade)', price: 2, description: 'Sabores: carne, frango, pizza ou queijo. R$ 2,00 cada.', image: image.pastry }
);

const sweetPastelFlavors = ['Doce de Leite com Queijo', 'Doce de Leite com Banana', 'Sonho de Valsa', 'Ouro Branco', 'Doce de Leite com Queijo e Romeu e Julieta'];
const sweetPastels = sweetPastelFlavors.map((flavor, index) => ({
  id: `pd-${index + 1}`, category: 'pasteis-doces', name: `Pastel doce: ${flavor}`, price: 15,
  description: 'Pastel doce. Valor informado no cardápio: R$ 15,00.', image: image.sweet
}));

const drinks = [
  ['Coca-Cola 2L', 18, 'Refrigerante Coca-Cola, garrafa de 2 litros.', 'soda'],
  ['Coca-Cola lata', 7, 'Refrigerante Coca-Cola em lata.', 'soda'],
  ['Coca-Cola mini', 4, 'Refrigerante Coca-Cola mini.', 'soda'],
  ['Coca-Cola 600ml', 10, 'Refrigerante Coca-Cola 600ml.', 'soda'],
  ['Suco de Acerola', 10, 'Suco de polpa. O valor pode variar de R$ 10,00 a R$ 12,00 conforme o sabor. Com leite: + R$ 4,00.', 'juice'],
  ['Suco de Abacaxi', 10, 'Suco de polpa. O valor pode variar de R$ 10,00 a R$ 12,00 conforme o sabor. Com leite: + R$ 4,00.', 'juice'],
  ['Suco de Laranja', 10, 'Suco de polpa. O valor pode variar de R$ 10,00 a R$ 12,00 conforme o sabor. Com leite: + R$ 4,00.', 'juice'],
  ['Suco de Maracujá', 10, 'Suco de polpa. O valor pode variar de R$ 10,00 a R$ 12,00 conforme o sabor. Com leite: + R$ 4,00.', 'juice'],
  ['Suco de Morango', 10, 'Suco de polpa. O valor pode variar de R$ 10,00 a R$ 12,00 conforme o sabor. Com leite: + R$ 4,00.', 'juice'],
  ['Skol', 6.5, 'Cerveja Skol.', 'beer'],
  ['Brahma', 6.5, 'Cerveja Brahma.', 'beer'],
  ['Crystal', 5, 'Cerveja Crystal.', 'beer'],
  ['Império', 7, 'Cerveja Império.', 'beer'],
  ['Original', 8, 'Cerveja Original.', 'beer'],
  ['Heineken', 9, 'Cerveja Heineken.', 'beer']
].map(([name, price, description, photo], index) => ({ id: `beb-${index + 1}`, category: 'bebidas', name, price, description, image: image[photo] }));

export const MENU_ITEMS = [...products, ...portions, ...savoryPastels, ...sweetPastels, ...drinks];

// Não há adicionais de borda neste cardápio; mantido vazio para compatibilidade com a tela existente.
export const BORDERS = [{ id: 'tradicional', name: 'Sem adicional', price: 0 }];
