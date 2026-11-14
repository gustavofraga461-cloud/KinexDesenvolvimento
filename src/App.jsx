import React, { useState, useMemo } from 'react';
import {
  ShoppingBag, Plus, Minus, Trash2, CreditCard, QrCode, Banknote,
  CheckCircle2, Clock, MapPin, Search, X, ChevronRight, Copy, Check,
  Flame, Sparkles, Code2
} from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, BORDERS } from './data/menuData';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('pizzas');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [customizingItem, setCustomizingItem] = useState(null);
  const [selectedBorder, setSelectedBorder] = useState(BORDERS[0]);
  const [itemObservation, setItemObservation] = useState('');

  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [changeFor, setChangeFor] = useState('');
  const [pixCopied, setPixCopied] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const deliveryFee = deliveryType === 'delivery' ? 6.00 : 0;

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = searchQuery.trim() !== '' ? true : item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenItem = (item) => {
    if (item.category === 'pizzas' || item.category === 'doces') {
      setCustomizingItem(item);
      setSelectedBorder(BORDERS[0]);
      setItemObservation('');
    } else {
      addToCart(item, null, '');
    }
  };

  const addToCart = (item, border, observation) => {
    const borderPrice = border ? border.price : 0;
    const unitPrice = item.price + borderPrice;
    const cartItemId = `${item.id}-${border ? border.id : 'none'}-${observation}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          id: item.id,
          name: item.name,
          image: item.image,
          border: border && border.price > 0 ? border.name : null,
          observation,
          unitPrice,
          quantity: 1
        }
      ];
    });
    setCustomizingItem(null);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const total = subtotal + (cart.length > 0 ? deliveryFee : 0);
  const totalItemsCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const formatPrice = (val) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(
      '00020126580014BR.GOV.BCB.PIX0136kinex-desenvolvimento-demo-pagamento5204000053039865802BR5921KINEX DESENVOLVIMENTO6009SAO PAULO62070503***6304A1B2'
    );
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  const fillDemoCustomer = () => {
    setCustomerName('Cliente Demonstração');
    if (deliveryType === 'delivery') {
      setAddress('Av. Paulista, 1000 - Apto 42');
    }
    if (paymentMethod === 'credit') {
      setCardData({
        number: '4532 0151 1283 0366',
        name: 'CLIENTE DEMO KINEX',
        expiry: '12/29',
        cvv: '888'
      });
    }
  };

  const handleFinishOrder = () => {
    if (!customerName.trim()) {
      alert('Por favor, informe o nome do cliente (ou toque em "Preencher Demo").');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      alert('Por favor, informe o endereço de entrega.');
      return;
    }
    if (paymentMethod === 'credit' && (cardData.number.length < 12 || !cardData.name)) {
      alert('Preencha os dados do cartão corretamente.');
      return;
    }

    setCheckoutStep('processing');
    setTimeout(() => {
      setOrderNumber(Math.floor(1000 + Math.random() * 9000));
      setCheckoutStep('success');
      setCart([]);
    }, 1500);
  };

  const resetAndCloseCart = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setCheckoutStep('cart');
    }, 300);
  };

  return (
    <div className="min-h-screen pb-28 max-w-md mx-auto bg-stone-50 shadow-xl relative flex flex-col">
      <div className="bg-zinc-950 text-zinc-200 px-4 py-1.5 flex items-center justify-between text-[11px] border-b border-zinc-800">
        <div className="flex items-center gap-1.5 font-semibold tracking-wide">
          <Code2 className="w-3.5 h-3.5 text-amber-400" />
          <span>
            <strong className="text-white">KINEX</strong> DESENVOLVIMENTO
          </span>
        </div>
        <span className="bg-amber-400/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Modo Demonstração
        </span>
      </div>

      <header className="bg-red-700 text-white pt-5 pb-5 px-4 rounded-b-3xl shadow-md sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍕</span>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight leading-none">
                  Pizzaria Modelo
                </h1>
                <p className="text-[11px] text-red-200 font-medium mt-0.5">
                  App White-Label • Kinex Desenvolvimento
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-red-100 mt-2">
              <span className="flex items-center gap-1 bg-green-600/90 text-white px-2 py-0.5 rounded-full font-medium">
                ● Aberto
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 35-50 min
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-white/15 hover:bg-white/25 p-3 rounded-2xl transition"
            aria-label="Abrir Sacola"
          >
            <ShoppingBag className="w-6 h-6 text-white" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-stone-900 text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>

        <div className="relative mt-2">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar pizza, porção ou bebida..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-stone-800 placeholder-stone-400 text-sm rounded-xl pl-10 pr-8 py-2.5 focus:outline-none shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-stone-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <nav className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar sticky top-[146px] bg-stone-50/95 backdrop-blur-sm z-10">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.id && !searchQuery;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-red-700 text-white shadow-md shadow-red-700/20'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </nav>

      <main className="px-4 pt-2 space-y-3 flex-1">
        <h2 className="text-base font-bold text-stone-800 pt-1">
          {searchQuery
            ? `Resultados para "${searchQuery}"`
            : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
        </h2>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <p className="text-sm">Nenhum item encontrado no cardápio.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className="bg-white rounded-2xl p-3 shadow-sm border border-stone-100 flex gap-3 items-center active:scale-[0.99] transition cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-stone-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-bold text-stone-800 text-sm leading-tight truncate">
                    {item.name}
                  </h3>
                  {item.popular && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md flex-shrink-0">
                      <Flame className="w-3 h-3 text-amber-600" /> Top
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="font-extrabold text-red-700 text-sm">
                    {formatPrice(item.price)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenItem(item);
                    }}
                    className="bg-red-50 text-red-700 hover:bg-red-700 hover:text-white p-1.5 rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        <footer className="pt-6 pb-4 text-center">
          <p className="text-[11px] text-stone-400 font-medium">
            Versão de Demonstração • Desenvolvido por{' '}
            <strong className="text-stone-600">Kinex Desenvolvimento</strong>
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            Personalizável com a marca, cores e cardápio do seu negócio
          </p>
        </footer>
      </main>

      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4 z-20">
          <button
            onClick={() => {
              setCheckoutStep('cart');
              setIsCartOpen(true);
            }}
            className="w-full bg-red-700 hover:bg-red-800 text-white rounded-2xl py-3.5 px-5 shadow-lg shadow-red-900/30 flex items-center justify-between font-bold transition"
          >
            <div className="flex items-center gap-2.5">
              <span className="bg-red-900/60 px-2.5 py-0.5 rounded-lg text-sm">
                {totalItemsCount}
              </span>
              <span className="text-sm">Ver Sacola e Pagar</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{formatPrice(total)}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {customizingItem && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-extrabold text-stone-800">{customizingItem.name}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{customizingItem.description}</p>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="p-1.5 bg-stone-100 rounded-full text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Escolha a Borda
              </h4>
              <div className="space-y-2">
                {BORDERS.map((border) => (
                  <label
                    key={border.id}
                    onClick={() => setSelectedBorder(border)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      selectedBorder.id === border.id
                        ? 'border-red-600 bg-red-50/50'
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedBorder.id === border.id ? 'border-red-600' : 'border-stone-300'
                        }`}
                      >
                        {selectedBorder.id === border.id && (
                          <div className="w-2 h-2 rounded-full bg-red-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-stone-800">{border.name}</span>
                    </div>
                    <span className="text-xs font-bold text-stone-600">
                      {border.price === 0 ? 'Grátis' : `+ ${formatPrice(border.price)}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Observações (opcional)
              </h4>
              <input
                type="text"
                placeholder="Ex: Tirar cebola, bem assada..."
                value={itemObservation}
                onChange={(e) => setItemObservation(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <button
              onClick={() => addToCart(customizingItem, selectedBorder, itemObservation)}
              className="w-full mt-5 bg-red-700 text-white font-bold py-3.5 rounded-2xl shadow-md flex items-center justify-between px-5"
            >
              <span>Adicionar ao Pedido</span>
              <span>{formatPrice(customizingItem.price + selectedBorder.price)}</span>
            </button>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md h-[92vh] rounded-t-3xl flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-stone-800 leading-tight">
                  {checkoutStep === 'cart' && 'Sua Sacola'}
                  {checkoutStep === 'payment' && 'Pagamento pelo App'}
                  {checkoutStep === 'processing' && 'Processando Pagamento'}
                  {checkoutStep === 'success' && 'Pedido Confirmado!'}
                </h3>
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                  Kinex Desenvolvimento • Simulação
                </span>
              </div>
              <button
                onClick={resetAndCloseCart}
                className="p-1.5 bg-stone-100 rounded-full text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {checkoutStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-stone-400">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">Sua sacola está vazia</p>
                      <p className="text-xs mt-1">Escolha pizzas ou porções para testar o pedido!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="flex items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-100"
                        >
                          <div className="flex-1 pr-2">
                            <h4 className="font-bold text-sm text-stone-800">{item.name}</h4>
                            {item.border && (
                              <p className="text-xs text-amber-700 font-medium">+ {item.border}</p>
                            )}
                            {item.observation && (
                              <p className="text-xs text-stone-400 italic">"{item.observation}"</p>
                            )}
                            <p className="text-xs font-extrabold text-red-700 mt-1">
                              {formatPrice(item.unitPrice * item.quantity)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, -1)}
                              className="p-1 text-red-700"
                            >
                              {item.quantity === 1 ? (
                                <Trash2 className="w-4 h-4" />
                              ) : (
                                <Minus className="w-4 h-4" />
                              )}
                            </button>
                            <span className="text-sm font-bold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, 1)}
                              className="p-1 text-red-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="pt-3">
                        <p className="text-xs font-bold uppercase text-stone-400 mb-2">
                          Como deseja receber?
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setDeliveryType('delivery')}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                              deliveryType === 'delivery'
                                ? 'border-red-700 bg-red-50 text-red-700'
                                : 'border-stone-200 text-stone-600'
                            }`}
                          >
                            <MapPin className="w-4 h-4" /> Entrega ({formatPrice(6)})
                          </button>
                          <button
                            onClick={() => setDeliveryType('pickup')}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                              deliveryType === 'pickup'
                                ? 'border-red-700 bg-red-50 text-red-700'
                                : 'border-stone-200 text-stone-600'
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4" /> Retirar (Grátis)
                          </button>
                        </div>
                      </div>

                      <div className="bg-stone-50 p-4 rounded-2xl space-y-1.5 text-sm mt-4">
                        <div className="flex justify-between text-stone-500">
                          <span>Subtotal</span>
                          <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-stone-500">
                          <span>Taxa de Entrega</span>
                          <span>{deliveryFee === 0 ? 'Grátis' : formatPrice(deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-stone-900 text-base pt-2 border-t border-stone-200">
                          <span>Total</span>
                          <span className="text-red-700">{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-4">
                  <div className="bg-zinc-900 text-white p-3 rounded-2xl flex items-center justify-between gap-2">
                    <div className="text-xs">
                      <p className="font-bold text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Atalho de Apresentação
                      </p>
                      <p className="text-[11px] text-zinc-300">
                        Preencher campos automaticamente para teste
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fillDemoCustomer}
                      className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-extrabold text-xs px-3 py-2 rounded-xl whitespace-nowrap transition"
                    >
                      Preencher Demo
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold uppercase text-stone-400">
                      Dados do Cliente
                    </label>
                    <input
                      type="text"
                      placeholder="Nome completo"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm"
                    />
                    {deliveryType === 'delivery' && (
                      <input
                        type="text"
                        placeholder="Endereço completo (Rua, Nº, Bairro)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                      Forma de Pagamento
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition ${
                          paymentMethod === 'pix'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                            : 'border-stone-200 text-stone-600'
                        }`}
                      >
                        <QrCode className="w-5 h-5" /> PIX Instantâneo
                      </button>
                      <button
                        onClick={() => setPaymentMethod('credit')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition ${
                          paymentMethod === 'credit'
                            ? 'border-red-700 bg-red-50 text-red-700'
                            : 'border-stone-200 text-stone-600'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" /> Cartão no App
                      </button>
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition ${
                          paymentMethod === 'cash'
                            ? 'border-amber-600 bg-amber-50 text-amber-800'
                            : 'border-stone-200 text-stone-600'
                        }`}
                      >
                        <Banknote className="w-5 h-5" /> Dinheiro
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'pix' && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-center space-y-3">
                      <p className="text-xs font-semibold text-emerald-900">
                        Escaneie o QR Code ou copie a chave PIX abaixo para pagar{' '}
                        <strong>{formatPrice(total)}</strong>
                      </p>
                      <div className="bg-white p-3 rounded-xl inline-block shadow-sm border border-emerald-100">
                        <QrCode className="w-28 h-28 text-stone-800 mx-auto" />
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
                      >
                        {pixCopied ? (
                          <>
                            <Check className="w-4 h-4" /> Código PIX Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copiar Código PIX Copia e Cola
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {paymentMethod === 'credit' && (
                    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5">
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="Número do Cartão (0000 0000 0000 0000)"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Nome impresso no cartão"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="Validade (MM/AA)"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm"
                        />
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="CVV"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
                      <p className="text-xs font-medium text-amber-900">
                        Pagamento na entrega/retirada. Precisa de troco para quanto?
                      </p>
                      <input
                        type="text"
                        placeholder="Ex: Troco para R$ 100,00 (ou deixe em branco)"
                        value={changeFor}
                        onChange={(e) => setChangeFor(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {checkoutStep === 'processing' && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="font-bold text-stone-800">Validando pagamento...</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Simulando aprovação em tempo real...
                  </p>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                  <div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full">
                      Pedido #{orderNumber} • Simulação Concluída
                    </span>
                    <h4 className="text-xl font-extrabold text-stone-800 mt-3">
                      Recebemos seu pedido, {customerName}!
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                      Fluxo completo concluído com sucesso. Tempo estimado: 35 a 50 minutos.
                    </p>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-2xl text-left text-xs space-y-1.5 border border-stone-100">
                    <p>
                      <strong>Pagamento:</strong>{' '}
                      {paymentMethod === 'pix'
                        ? 'PIX Aprovado'
                        : paymentMethod === 'credit'
                        ? 'Cartão de Crédito Aprovado'
                        : `Dinheiro (${changeFor || 'Sem troco'})`}
                    </p>
                    <p>
                      <strong>Modalidade:</strong>{' '}
                      {deliveryType === 'delivery' ? `Entrega em: ${address}` : 'Retirada no Balcão'}
                    </p>
                  </div>
                  <p className="text-[11px] text-stone-400 pt-2">
                    Sistema desenvolvido por <strong className="text-stone-600">Kinex Desenvolvimento</strong>
                  </p>
                </div>
              )}
            </div>

            {cart.length > 0 && checkoutStep === 'cart' && (
              <div className="p-4 border-t border-stone-100 bg-white">
                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3.5 rounded-2xl shadow-md"
                >
                  Ir para o Pagamento • {formatPrice(total)}
                </button>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="p-4 border-t border-stone-100 bg-white flex gap-2">
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-3.5 rounded-2xl border border-stone-200 text-stone-600 font-bold text-sm"
                >
                  Voltar
                </button>
                <button
                  onClick={handleFinishOrder}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-md"
                >
                  Confirmar e Pagar {formatPrice(total)}
                </button>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="p-4 border-t border-stone-100 bg-white">
                <button
                  onClick={resetAndCloseCart}
                  className="w-full bg-stone-900 text-white font-bold py-3.5 rounded-2xl"
                >
                  Voltar ao Cardápio
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
