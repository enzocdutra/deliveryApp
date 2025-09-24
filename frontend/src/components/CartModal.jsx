// CartModal.jsx
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../Context/CartContext';
import { toast } from 'react-toastify';

const CartModal = ({ isOpen, onClose }) => {
  const { cart, removeItemFromCart, clearCart } = useContext(CartContext);
  const [deliveryType, setDeliveryType] = useState('retirar');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [clientName, setClientName] = useState('');
  const [addressWarnVisible, setAddressWarnVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [cardType, setCardType] = useState('debito');
  const [changeFor, setChangeFor] = useState('');
  const [cardBrand, setCardBrand] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const total = cart.reduce((sum, item) => sum + item.finalPrice, 0);

  useEffect(() => {
    if (address.trim()) setAddressWarnVisible(false);
  }, [address]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setClientName('');
      setAddress('');
      setNeighborhood('');
      setComplement('');
      setChangeFor('');
      setCardBrand('');
    }
  }, [isOpen]);

  const checkRestaurantOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 19 && hours < 24;
  };

  const handleCheckout = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      if (!checkRestaurantOpen()) {
        toast.error("⏰ Ops! Estamos fechado no momento. Horário de funcionamento: 12:00 às 14:00 & 19h às 00h");
        return;
      }
      
      if (!cart.length) {
        toast.warning("🛒 Seu carrinho está vazio!");
        return;
      }

      if (!clientName.trim()) {
        toast.error("👤 Por favor, informe seu nome");
        return;
      }

      if (deliveryType === 'entrega') {
        if (!address.trim() || !neighborhood.trim()) {
          toast.error("📍 Preencha endereço e bairro para entrega");
          setAddressWarnVisible(true);
          return;
        }
        if (paymentMethod === 'dinheiro' && !changeFor.trim()) {
          toast.error("💵 Informe para quanto precisa de troco");
          return;
        }
        if (paymentMethod === 'cartoes' && !cardBrand.trim()) {
          toast.error("💳 Informe a bandeira do cartão");
          return;
        }
      }

      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      const cartItemsText = cart
        .map((item) => {
          let text = `*🍔 ${item.name}*\n`;
          text += `*📦 Quantidade:* ${item.quantity}\n`;
          text += `*💰 Valor:* R$ ${item.finalPrice.toFixed(2)}\n`;
          
          if (item.extras?.length) {
            text += `*➕ Adicionais:*\n`;
            item.extras.forEach(extra => {
              text += `   • ${extra.name} (R$ ${extra.price.toFixed(2)})\n`;
            });
          }
          
          if (item.comments) {
            text += `*📝 Observações:* ${item.comments}\n`;
          }
          
          text += `\n`;
          return text;
        })
        .join("");

      const endereco = deliveryType === 'entrega' 
        ? `${address}, ${neighborhood}${complement ? ` - ${complement}` : ''}`
        : "Retirada no local - Av. Presidente Vargas 24";

      let paymentInfo = "";
      if (deliveryType === 'entrega') {
        switch (paymentMethod) {
          case 'pix':
            paymentInfo = `*💳 Pagamento:* PIX\n`;
            break;
          case 'cartoes':
            paymentInfo = `*💳 Pagamento:* Cartão ${cardType === 'debito' ? 'Débito' : 'Crédito'}\n`;
            paymentInfo += `*🏷️ Bandeira:* ${cardBrand}\n`;
            break;
          case 'dinheiro':
            paymentInfo = `*💵 Pagamento:* Dinheiro\n`;
            paymentInfo += `*🪙 Troco para:* R$ ${changeFor}\n`;
            break;
        }
      } else {
        paymentInfo = `*💳 Pagamento:* PIX/Dinheiro/Cartão (no local)\n`;
      }

      const message = encodeURIComponent(
        `*🛒 NOVO PEDIDO - ${new Date().toLocaleDateString('pt-BR')}*\n\n` +
        `*👤 Cliente:* ${clientName}\n` +
        `*📍 ${deliveryType === 'retirar' ? 'Retirada' : 'Entrega'}:* ${endereco}\n\n` +
        `*📋 ITENS DO PEDIDO:*\n${cartItemsText}\n` +
        `*${paymentInfo}*` +
        `*💎 TOTAL: R$ ${total.toFixed(2)}*\n\n` +
        `_Pedido gerado via sistema_`
      );

      const phone = "5397082320";
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

      toast.success("🎉 Pedido enviado! Verifique o WhatsApp");
      
      // Delay before clearing to show success feedback
      setTimeout(() => {
        clearCart();
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Erro no checkout:', error);
      toast.error("❌ Erro ao processar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              🛒 Seu Carrinho
              {cart.length > 0 && (
                <span className="bg-white text-red-600 text-sm px-2 py-1 rounded-full">
                  {cart.length} {cart.length === 1 ? 'item' : 'itens'}
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-white hover:text-gray-200 text-2xl transition-transform hover:scale-110 disabled:opacity-50"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <p className="text-gray-400 text-lg">Seu carrinho está vazio</p>
              <p className="text-gray-500 text-sm">Adicione itens deliciosos para continuar</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                      )}
                    </div>
                    <span className="text-red-400 font-bold text-lg">
                      R$ {item.finalPrice.toFixed(2)}
                    </span>
                  </div>

                  {item.extras?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-gray-300 text-sm font-medium">Adicionais:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.extras.map(extra => (
                          <span key={extra.id} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                            {extra.name} (+R$ {extra.price.toFixed(2)})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.comments && (
                    <p className="text-gray-400 text-sm mb-2">
                      <span className="font-medium">Observações:</span> {item.comments}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">
                      Quantidade: {item.quantity}
                    </span>
                    <button
                      onClick={() => removeItemFromCart(item.name, item.extrasTotal, item.comments)}
                      disabled={isSubmitting}
                      className="bg-red-600/20 text-red-400 hover:bg-red-600/30 px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      🗑️ Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          {cart.length > 0 && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 mb-6 border border-gray-600">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-white">Total do Pedido</span>
                <span className="text-green-400">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Client Info */}
          {cart.length > 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-3 text-lg">👤 Seus Dados</label>
                <input
                  className="w-full p-4 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="Digite seu nome completo"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Delivery Type */}
              <div>
                <label className="block text-white font-medium mb-3 text-lg">🚚 Tipo de Entrega</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeliveryType('retirar')}
                    disabled={isSubmitting}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      deliveryType === 'retirar' 
                        ? 'border-red-500 bg-red-500/20 text-white' 
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                    } disabled:opacity-50`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🏪</div>
                      <span className="font-medium">Retirar</span>
                      <p className="text-xs mt-1">Venha nos visitar!</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setDeliveryType('entrega')}
                    disabled={isSubmitting}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      deliveryType === 'entrega' 
                        ? 'border-red-500 bg-red-500/20 text-white' 
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                    } disabled:opacity-50`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🚗</div>
                      <span className="font-medium">Entrega</span>
                      <p className="text-xs mt-1">Levamos até você!</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              {deliveryType === 'entrega' && (
                <div className="space-y-3">
                  <label className="block text-white font-medium text-lg">📍 Endereço de Entrega</label>
                  <input
                    className={`w-full p-4 bg-gray-700 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                      addressWarnVisible ? 'border-red-500' : 'border-gray-600 focus:border-red-500'
                    }`}
                    placeholder="Rua, número, apartamento..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="p-4 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="Bairro"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <input
                      className="p-4 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="Complemento"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {/* Payment Method */}
              {deliveryType === 'entrega' && (
                <div>
                  <label className="block text-white font-medium mb-3 text-lg">💳 Pagamento</label>
                  <div className="space-y-2">
                    {['pix', 'cartoes', 'dinheiro'].map(method => (
                      <label key={method} className="flex items-center p-3 rounded-xl bg-gray-700/50 border-2 border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          className="form-radio text-red-500 mr-3 h-5 w-5"
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          disabled={isSubmitting}
                        />
                        <span className="text-white capitalize">
                          {method === 'pix' ? 'PIX' : method === 'cartoes' ? 'Cartões' : 'Dinheiro'}
                        </span>
                      </label>
                    ))}

                    {/* Card Details */}
                    {paymentMethod === 'cartoes' && (
                      <div className="ml-8 space-y-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex gap-4">
                          {['debito', 'credito'].map(type => (
                            <label key={type} className="flex items-center">
                              <input
                                type="radio"
                                name="cardType"
                                className="form-radio text-red-500 mr-2 h-4 w-4"
                                checked={cardType === type}
                                onChange={() => setCardType(type)}
                                disabled={isSubmitting}
                              />
                              <span className="text-white text-sm capitalize">
                                {type === 'debito' ? 'Débito' : 'Crédito'}
                              </span>
                            </label>
                          ))}
                        </div>
                        <input
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:border-red-500 focus:outline-none"
                          placeholder="Bandeira do cartão (Visa, Mastercard...)"
                          value={cardBrand}
                          onChange={(e) => setCardBrand(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                    )}

                    {/* Change for */}
                    {paymentMethod === 'dinheiro' && (
                      <div className="ml-8">
                        <input
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:border-red-500 focus:outline-none"
                          placeholder="Troco para quanto? Ex: 100,00"
                          value={changeFor}
                          onChange={(e) => setChangeFor(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Important Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-300 text-sm font-medium">📢 Importante</p>
                <ul className="text-yellow-200/80 text-xs mt-2 space-y-1">
                  <li>• Não servimos Maionese Caseira</li>
                  <li>• Taxa de entrega: Consultar no WhatsApp</li>
                  <li>• Horário de funcionamento: 12:00 às 14:00 & 19h às 00h</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-700 bg-gray-900/50">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-gray-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-500 transition-colors disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={handleCheckout}
                disabled={isSubmitting || cart.length === 0}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    📱 Finalizar Pedido
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;