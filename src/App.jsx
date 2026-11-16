import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingBag, Plus, Minus, Trash2, CreditCard, QrCode, Banknote,
  CheckCircle2, Clock, MapPin, Search, X, ChevronRight, Copy, Check,
  Flame, Sparkles, Code2, Settings, ClipboardList, Package, LogOut, Phone,
  Pencil, Trash, CheckCircle, CircleDollarSign,
} from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, BORDERS } from './data/menuData';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('lanches');
  const [menuItems, setMenuItems] = useState(() => { try { return JSON.parse(localStorage.getItem('morumba_menu_v1')) || MENU_ITEMS; } catch { return MENU_ITEMS; } });
  const [orders, setOrders] = useState(() => { try { return JSON.parse(localStorage.getItem('morumba_orders_v1')) || []; } catch { return []; } });
  const [adminMode, setAdminMode] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminTab, setAdminTab] = useState('orders');
  const [adminPassword, setAdminPassword] = useState('');
  const [productDraft, setProductDraft] = useState({ name: '', price: '', description: '', category: 'lanches', image: '' });
  const [editingProductId, setEditingProductId] = useState(null);
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
  const [changeFor, setChangeFor] = useState('');
  const [pixCopied, setPixCopied] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const deliveryFee = 0; // Taxa de entrega ainda não informada pela lanchonete.

  useEffect(() => { localStorage.setItem('morumba_menu_v1', JSON.stringify(menuItems)); }, [menuItems]);
  useEffect(() => { localStorage.setItem('morumba_orders_v1', JSON.stringify(orders)); }, [orders]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => item.active !== false).filter((item) => {
      const matchesCategory = searchQuery.trim() !== '' ? true : item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleOpenItem = (item) => {
    addToCart(item, null, '');
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

    const number = Date.now().toString().slice(-6);
    const order = {
      id: `M${number}`, number, createdAt: new Date().toISOString(),
      customerName: customerName.trim(), address: deliveryType === 'delivery' ? address.trim() : 'Retirada no balcão',
      deliveryType, paymentMethod, changeFor, items: cart.map(item => ({ ...item })),
      subtotal, deliveryFee, total, status: 'Novo', paymentStatus: 'Pendente (demonstração)'
    };
    const nextOrders = [order, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('morumba_orders_v1', JSON.stringify(nextOrders));
    setOrderNumber(number);
    setCheckoutStep('success');
    setCart([]);
  };

  const resetAndCloseCart = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setCheckoutStep('cart');
    }, 300);
  };

  const openAdmin = () => { setAdminPassword(''); setAdminMode(true); setAdminAuthed(false); };
  const saveProduct = () => {
    if (!productDraft.name.trim() || !Number(productDraft.price)) { alert('Informe nome e preço válido.'); return; }
    const product = { ...productDraft, id: editingProductId || `custom-${Date.now()}`, price: Number(productDraft.price), image: productDraft.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85', active: true };
    setMenuItems(prev => editingProductId ? prev.map(item => item.id === editingProductId ? product : item) : [...prev, product]);
    setProductDraft({ name: '', price: '', description: '', category: 'lanches', image: '' }); setEditingProductId(null);
    alert('Produto salvo neste aparelho.');
  };
  const editProduct = (item) => { setEditingProductId(item.id); setProductDraft({ name: item.name, price: String(item.price), description: item.description, category: item.category, image: item.image }); window.scrollTo(0,0); };
  const updateOrderStatus = (id, status) => setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
  const deleteProduct = (id) => { if (confirm('Excluir este produto?')) setMenuItems(prev => prev.filter(item => item.id !== id)); };
  const whatsappOrder = (order) => {
    const lines = [`*Pedido ${order.id} - MORUMBA LANCHES*`, `Cliente: ${order.customerName}`, `Recebimento: ${order.deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}`, `Endereço: ${order.address}`, '', ...order.items.map(i => `${i.quantity}x ${i.name} - ${formatPrice(i.unitPrice * i.quantity)}${i.observation ? ` (${i.observation})` : ''}`), '', `Pagamento: ${order.paymentMethod === 'pix' ? 'PIX (demonstrativo)' : order.paymentMethod === 'credit' ? 'Cartão (demonstrativo)' : 'Dinheiro'}`, `TOTAL: ${formatPrice(order.total)}`];
    window.open(`https://wa.me/5519992625518?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  };

  if (adminMode) return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 pb-10 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6"><div><p className="text-red-400 text-xs font-bold tracking-widest">MORUMBA LANCHES</p><h1 className="text-2xl font-black">Painel administrativo</h1></div><button onClick={() => { setAdminMode(false); setAdminAuthed(false); }} className="p-2 rounded-xl bg-zinc-800"><X/></button></div>
      {!adminAuthed ? <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mt-10"><Settings className="text-red-500 w-10 h-10 mb-3"/><h2 className="font-bold text-lg">Acesso do proprietário</h2><p className="text-zinc-400 text-xs my-2">Senha inicial de demonstração: 1234. Altere no código antes de entregar ao cliente.</p><input type="password" value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} placeholder="Senha administrativa" className="w-full rounded-xl p-3 text-zinc-900 my-3"/><button onClick={()=>adminPassword === '1234' ? setAdminAuthed(true) : alert('Senha incorreta.')} className="w-full bg-red-700 rounded-xl p-3 font-bold">Entrar no painel</button></div> : <>
        <div className="grid grid-cols-2 gap-2 mb-4"><div className="bg-zinc-900 p-3 rounded-xl"><p className="text-zinc-400 text-xs">Pedidos</p><strong className="text-2xl">{orders.length}</strong></div><div className="bg-zinc-900 p-3 rounded-xl"><p className="text-zinc-400 text-xs">Produtos ativos</p><strong className="text-2xl">{menuItems.filter(x=>x.active!==false).length}</strong></div></div>
        <div className="flex gap-2 mb-4"><button onClick={()=>setAdminTab('orders')} className={`flex-1 p-3 rounded-xl font-bold text-sm ${adminTab==='orders'?'bg-red-700':'bg-zinc-800'}`}><ClipboardList className="inline w-4 h-4 mr-1"/> Pedidos</button><button onClick={()=>setAdminTab('products')} className={`flex-1 p-3 rounded-xl font-bold text-sm ${adminTab==='products'?'bg-red-700':'bg-zinc-800'}`}><Package className="inline w-4 h-4 mr-1"/> Produtos</button></div>
        {adminTab==='orders' ? <div className="space-y-3">{orders.length===0 ? <div className="text-center text-zinc-400 py-12 bg-zinc-900 rounded-2xl">Nenhum pedido ainda. Faça um pedido na área do cliente para testar.</div> : orders.map(order=><div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"><div className="flex justify-between gap-2"><div><p className="text-red-400 font-black">{order.id}</p><h3 className="font-bold">{order.customerName}</h3><p className="text-xs text-zinc-400">{new Date(order.createdAt).toLocaleString('pt-BR')}</p></div><strong>{formatPrice(order.total)}</strong></div><div className="text-sm text-zinc-300 my-3">{order.items.map((i,idx)=><p key={idx}>{i.quantity}x {i.name}</p>)}</div><p className="text-xs text-zinc-400 mb-2">{order.address} • {order.paymentMethod==='pix'?'PIX demonstrativo':order.paymentMethod==='credit'?'Cartão demonstrativo':'Dinheiro'}</p><select value={order.status} onChange={e=>updateOrderStatus(order.id,e.target.value)} className="w-full bg-zinc-800 rounded-lg p-2 text-sm mb-2">{['Novo','Aceito','Em preparo','Saiu para entrega','Pronto para retirada','Concluído','Cancelado'].map(s=><option key={s}>{s}</option>)}</select><button onClick={()=>whatsappOrder(order)} className="w-full bg-green-700 rounded-lg p-2 text-sm font-bold"><Phone className="inline w-4 h-4 mr-1"/> Enviar pedido pelo WhatsApp</button></div>)}</div> : <div className="space-y-3"><div className="bg-zinc-900 rounded-2xl p-4 space-y-2"><h3 className="font-bold">{editingProductId?'Editar produto':'Novo produto'}</h3><input value={productDraft.name} onChange={e=>setProductDraft({...productDraft,name:e.target.value})} placeholder="Nome do produto" className="w-full p-3 rounded-lg text-zinc-900"/><input value={productDraft.price} onChange={e=>setProductDraft({...productDraft,price:e.target.value})} type="number" step="0.01" placeholder="Preço (ex.: 25.90)" className="w-full p-3 rounded-lg text-zinc-900"/><input value={productDraft.description} onChange={e=>setProductDraft({...productDraft,description:e.target.value})} placeholder="Descrição" className="w-full p-3 rounded-lg text-zinc-900"/><select value={productDraft.category} onChange={e=>setProductDraft({...productDraft,category:e.target.value})} className="w-full p-3 rounded-lg text-zinc-900">{CATEGORIES.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select><input value={productDraft.image} onChange={e=>setProductDraft({...productDraft,image:e.target.value})} placeholder="URL da imagem (opcional)" className="w-full p-3 rounded-lg text-zinc-900"/><button onClick={saveProduct} className="w-full bg-red-700 p-3 rounded-xl font-bold">Salvar produto</button>{editingProductId&&<button onClick={()=>{setEditingProductId(null);setProductDraft({name:'',price:'',description:'',category:'lanches',image:''});}} className="w-full bg-zinc-700 p-2 rounded-xl">Cancelar edição</button>}</div><div className="space-y-2">{menuItems.map(item=><div key={item.id} className="bg-zinc-900 rounded-xl p-3 flex gap-3 items-center"><img src={item.image} className="w-14 h-14 rounded-lg object-cover"/><div className="flex-1 min-w-0"><p className="font-bold text-sm">{item.name}</p><p className="text-red-400 text-xs">{formatPrice(item.price)}</p></div><button onClick={()=>editProduct(item)} className="p-2 bg-zinc-800 rounded-lg"><Pencil size={16}/></button><button onClick={()=>deleteProduct(item.id)} className="p-2 bg-zinc-800 rounded-lg text-red-400"><Trash size={16}/></button></div>)}</div></div>}
        <button onClick={()=>setAdminAuthed(false)} className="w-full mt-5 p-3 bg-zinc-800 rounded-xl text-sm"><LogOut className="inline w-4 h-4 mr-1"/> Sair do painel</button>
      </>}
      <p className="text-center text-[10px] text-zinc-500 mt-8">Dados salvos somente neste aparelho • Kinex Desenvolvimento</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-28 max-w-md mx-auto bg-stone-50 shadow-xl relative flex flex-col">
      <div className="bg-zinc-950 text-zinc-200 px-4 py-1.5 flex items-center justify-between text-[11px] border-b border-zinc-800">
        <div className="flex items-center gap-1.5 font-semibold tracking-wide">
          <Code2 className="w-3.5 h-3.5 text-amber-400" />
          <span>
            <strong className="text-white">KINEX</strong> DESENVOLVIMENTO
          </span>
        </div>
        <button onClick={openAdmin} className="text-[10px] font-bold text-white/80 underline underline-offset-2 mr-2">Painel</button>
        <span className="bg-amber-400/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Modo Demonstração
        </span>
      </div>

      <header className="bg-zinc-950 text-white pt-5 pb-5 px-4 rounded-b-3xl shadow-md sticky top-0 z-20 border-b-4 border-red-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍔</span>
              <div>
                <h1 className="morumba-logo text-2xl font-black tracking-tight leading-none">
                  MORUMBA LANCHES
                </h1>
                <p className="text-[11px] text-zinc-300 font-semibold mt-1">
                  O Melhor Lanche está Aqui 👊
                </p>
                <a href="https://wa.me/5519992625518" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-green-300 font-bold mt-1">
                  WhatsApp: (19) 9 9262-5518
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-200 mt-2">
              <span className="flex items-center gap-1 bg-green-600/90 text-white px-2 py-0.5 rounded-full font-medium">
                ● Consulte
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Consulte o prazo
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
            placeholder="Buscar lanche, pastel, porção ou bebida..."
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
                    {item.id.startsWith('ps-') && !['ps-tudao', 'ps-pastelzao', 'ps-mini'].includes(item.id)
                      ? 'R$ 13,00–18,00'
                      : item.name.startsWith('Suco de ')
                      ? 'R$ 10,00–12,00'
                      : formatPrice(item.price)}
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
                  {checkoutStep === 'processing' && 'Registrando Pedido'}
                  {checkoutStep === 'success' && 'Pedido Confirmado!'}
                </h3>
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                  Morumba Lanches • Demonstração
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
                      <p className="text-xs mt-1">Escolha lanches, porções, pastéis ou bebidas para testar o pedido!</p>
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
                            <MapPin className="w-4 h-4" /> Entrega (a combinar)
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
                          <span>{deliveryType === 'delivery' ? 'A combinar' : 'Grátis'}</span>
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
                        <QrCode className="w-5 h-5" /> PIX (teste)
                      </button>
                      <button
                        onClick={() => setPaymentMethod('credit')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition ${
                          paymentMethod === 'credit'
                            ? 'border-red-700 bg-red-50 text-red-700'
                            : 'border-stone-200 text-stone-600'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" /> Cartão (demonstração)
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
                        PIX de demonstração: não é possível pagar por este código. O pedido será salvo localmente. Valor simulado:{' '}
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
                            <Copy className="w-4 h-4" /> Copiar código PIX fictício
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {paymentMethod === 'credit' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900">
                      Esta é uma demonstração. Não informe dados reais de cartão: nenhuma transação será processada.
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
                  <p className="font-bold text-stone-800">Registrando pedido no aparelho...</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Nenhuma cobrança real será realizada.
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
                      Pedido de demonstração, {customerName}!
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                      Pedido salvo neste aparelho. Para encaminhar à lanchonete, toque no botão de WhatsApp abaixo. O pagamento continua sendo demonstrativo.
                    </p>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-2xl text-left text-xs space-y-1.5 border border-stone-100">
                    <p>
                      <strong>Pagamento:</strong>{' '}
                      {paymentMethod === 'pix'
                        ? 'PIX demonstrativo (não pago)'
                        : paymentMethod === 'credit'
                        ? 'Cartão demonstrativo (não processado)'
                        : `Dinheiro (${changeFor || 'Sem troco'})`}
                    </p>
                    <p>
                      <strong>Modalidade:</strong>{' '}
                      {deliveryType === 'delivery' ? `Entrega em: ${address}` : 'Retirada no Balcão'}
                    </p>
                  </div>
                  <button onClick={() => { const saved = orders.find(o => o.number === orderNumber); if (saved) whatsappOrder(saved); }} className="w-full bg-green-600 text-white font-bold rounded-xl py-3">Enviar pedido pelo WhatsApp</button>
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
                  Registrar pedido {formatPrice(total)}
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
