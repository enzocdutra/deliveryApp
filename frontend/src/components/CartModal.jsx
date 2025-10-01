// CartModal.jsx - VERSÃO CORRIGIDA WHATSAPP IPHONE/ANDROID
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../Context/CartContext';

const CartModal = ({ isOpen, onClose }) => {
  const { cart, removeItemFromCart, clearCart } = useContext(CartContext);
  const [deliveryType, setDeliveryType] = useState('retirar');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [clientName, setClientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [cardType, setCardType] = useState('debito');
  const [changeFor, setChangeFor] = useState('');
  const [cardBrand, setCardBrand] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  
  const total = cart.reduce((sum, item) => sum + item.finalPrice, 0);

  // Mostrar alerta temporário
  const showAlert = (message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 4000);
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setClientName('');
      setAddress('');
      setNeighborhood('');
      setComplement('');
      setChangeFor('');
      setCardBrand('');
      setAlertMessage('');
      setShowCopyMessage(false);
      setWhatsappMessage('');
    }
  }, [isOpen]);

  const formatCurrency = (value) => {
    return value.toFixed(2).replace('.', ',');
  };

  // FUNÇÃO UNIVERSAL PARA WHATSAPP - CORRIGIDA
  const openWhatsAppUniversal = (message) => {
    const phoneNumber = "555397082320";
    const encodedMessage = encodeURIComponent(message);
    
    // URL universal que funciona em todos os dispositivos
    const universalURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Para iOS - tenta abrir o app primeiro
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const appURL = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
      
      // Tenta abrir o app
      window.location.href = appURL;
      
      // Fallback após 1 segundo
      setTimeout(() => {
        if (!document.hidden) {
          window.open(universalURL, '_blank');
        }
      }, 1000);
    } 
    // Para Android
    else if (/Android/.test(navigator.userAgent)) {
      window.open(universalURL, '_blank');
    } 
    // Para desktop e outros
    else {
      window.open(universalURL, '_blank');
    }
  };

  // FUNÇÃO ALTERNATIVA MAIS CONFIÁVEL
  const openWhatsAppReliable = (message) => {
    const phoneNumber = "555397082320";
    const encodedMessage = encodeURIComponent(message);
    
    // URL principal
    const mainURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    // Cria um link temporário e clica nele (funciona melhor no mobile)
    const link = document.createElement('a');
    link.href = mainURL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FUNÇÃO DE COPIA PARA ÁREA DE TRANSFERÊNCIA
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showAlert('📋 Mensagem copiada! Cole no WhatsApp', 'success');
    }).catch(() => {
      // Fallback para métodos antigos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showAlert('📋 Mensagem copiada! Cole no WhatsApp', 'success');
    });
  };

  // PREPARAR MENSAGEM DO PEDIDO
  const prepareOrderMessage = () => {
    const cartItemsText = cart
      .map((item) => {
        let text = `🍔 *${item.name}*`;
        text += `\n📦 Quantidade: *${item.quantity}*`;
        text += `\n💰 Valor: *R$ ${formatCurrency(item.finalPrice)}*`;
        
        if (item.extras?.length > 0) {
          text += `\n*➕ Adicionais:*`;
          item.extras.forEach(extra => {
            text += `\n*• ${extra.name} (+R$ ${formatCurrency(extra.price)})*`;
          });
        }

        if (item.comments) {
          text += `\n📝 *Observações: ${item.comments}*`;
        }
        
        text += `\n────────────────────`;
        return text;
      })
      .join("\n\n");

    const enderecoText = deliveryType === 'entrega' 
      ? `📍 Entrega: ${address}, ${neighborhood}${complement ? ` - ${complement}` : ''}`
      : "🏠 Retirada no local - Av. Presidente Vargas 24";

    // Informações de pagamento para ambos os tipos
    let pagamentoText = "";
    if (paymentMethod === 'pix') {
      pagamentoText = "💳 Pagamento: PIX";
    } else if (paymentMethod === 'cartoes') {
      pagamentoText = `💳 Pagamento: Cartão ${cardType === 'debito' ? 'Débito' : 'Crédito'}${cardBrand ? ` (${cardBrand})` : ''}`;
    } else if (paymentMethod === 'dinheiro') {
      pagamentoText = `💵 Pagamento: Dinheiro${changeFor ? ` - Troco para R$ ${changeFor}` : ''}`;
    }

    return `📢 *NOVO PEDIDO - ${new Date().toLocaleDateString('pt-BR')}* 📢

🍽️ Pedido:
${cartItemsText}

*🧾 Total: R$ ${formatCurrency(total)}*

🙍‍♂️ Cliente: ${clientName}

${enderecoText}

${pagamentoText}

_Pedido via cardapiolaburguer.netlify.app_`;
  };

  const handleCheckout = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setAlertMessage('');

    try {
      // Verificações básicas (lógica de horário removida)
      if (!cart.length) {
        showAlert("🛒 Seu carrinho está vazio!", 'warning');
        setIsSubmitting(false);
        return;
      }

      if (!clientName.trim()) {
        showAlert("👤 Por favor, informe seu nome", 'error');
        setIsSubmitting(false);
        return;
      }

      // Validações para entrega
      if (deliveryType === 'entrega') {
        if (!address.trim()) {
          showAlert("📍 Informe o endereço para entrega", 'error');
          setIsSubmitting(false);
          return;
        }
      }

      // Validações de pagamento (agora aplicam-se para ambos os tipos)
      if (paymentMethod === 'dinheiro' && !changeFor.trim()) {
        showAlert("💵 Informe para quanto precisa de troco", 'error');
        setIsSubmitting(false);
        return;
      }
      
      if (paymentMethod === 'cartoes' && !cardBrand.trim()) {
        showAlert("💳 Informe a bandeira do cartão", 'error');
        setIsSubmitting(false);
        return;
      }

      // Prepara a mensagem
      const message = prepareOrderMessage();
      setWhatsappMessage(message);

      // Simula processamento
      await new Promise(resolve => setTimeout(resolve, 500));

      // Tenta abrir o WhatsApp
      openWhatsAppReliable(message);

      showAlert("✅ Pedido preparado! Verifique o WhatsApp", 'success');
      
      // Mostra opção de copiar após 2 segundos
      setTimeout(() => {
        setShowCopyMessage(true);
      }, 2000);

      // Limpa o carrinho após 5 segundos
      setTimeout(() => {
        clearCart();
        onClose();
      }, 5000);

    } catch (error) {
      console.error('Erro no checkout:', error);
      showAlert("❌ Erro ao processar pedido. Tente novamente.", 'error');
      setIsSubmitting(false);
    }
  };

  // Função específica para copiar mensagem
  const handleCopyMessage = () => {
    if (whatsappMessage) {
      copyToClipboard(whatsappMessage);
    } else {
      const message = prepareOrderMessage();
      copyToClipboard(message);
    }
  };

  // Função para abrir WhatsApp manualmente
  const handleOpenWhatsAppManual = () => {
    const message = whatsappMessage || prepareOrderMessage();
    openWhatsAppReliable(message);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Alert Message */}
        {alertMessage && (
          <div className={`p-4 text-white font-semibold ${
            alertType === 'success' ? 'bg-green-500' : 
            alertType === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            <div className="flex items-center justify-between">
              <span>{alertMessage}</span>
              <button 
                onClick={() => setAlertMessage('')}
                className="text-white hover:text-gray-200 text-lg"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-red-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              🛒 Seu Pedido
              {cart.length > 0 && (
                <span className="ml-2 bg-white text-red-600 text-sm px-2 py-1 rounded-full">
                  {cart.length} {cart.length === 1 ? 'item' : 'itens'}
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-2xl hover:scale-110 transition-transform disabled:opacity-50"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">😔</div>
              <p className="text-gray-600">Seu carrinho está vazio</p>
              <p className="text-gray-500 text-sm mt-1">Adicione itens deliciosos para continuar</p>
            </div>
          ) : (
            <>
              {/* Itens do carrinho */}
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Quantidade: {item.quantity}</p>
                        {item.extras?.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-500">Adicionais:</p>
                            {item.extras.map(extra => (
                              <span key={extra.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mr-1">
                                {extra.name}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.comments && (
                          <p className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">Obs:</span> {item.comments}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-red-600 font-bold">R$ {formatCurrency(item.finalPrice)}</p>
                        <button
                          onClick={() => removeItemFromCart(item.name, item.extrasTotal, item.comments)}
                          className="text-red-500 hover:text-red-700 text-sm mt-2 disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Total do Pedido:</span>
                  <span className="text-green-600">R$ {formatCurrency(total)}</span>
                </div>
              </div>

              {/* Formulário */}
              <div className="space-y-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-800">👤 Seu Nome *</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors"
                    placeholder="Digite seu nome completo"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Tipo de entrega */}
                <div>
                  <label className="block font-semibold mb-2 text-gray-800">🚚 Tipo de Entrega</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('retirar')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        deliveryType === 'retirar' 
                          ? 'border-red-500 bg-red-50 text-red-700' 
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      } disabled:opacity-50`}
                      disabled={isSubmitting}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">🏪</div>
                        <span className="font-medium">Retirar</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('entrega')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        deliveryType === 'entrega' 
                          ? 'border-red-500 bg-red-50 text-red-700' 
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      } disabled:opacity-50`}
                      disabled={isSubmitting}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">🚗</div>
                        <span className="font-medium">Entrega</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Endereço para entrega */}
                {deliveryType === 'entrega' && (
                  <div className="space-y-3">
                    <label className="block font-semibold text-gray-800">📍 Endereço de Entrega *</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                      placeholder="Rua, número, apartamento..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        className="p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                        placeholder="Bairro"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        disabled={isSubmitting}
                      />
                      <input
                        type="text"
                        className="p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                        placeholder="Complemento (opcional)"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}

                {/* Pagamento - AGORA DISPONÍVEL PARA AMBOS OS TIPOS */}
                <div>
                  <label className="block font-semibold mb-2 text-gray-800">💳 Forma de Pagamento</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="pix">PIX</option>
                    <option value="cartoes">Cartão</option>
                    <option value="dinheiro">Dinheiro</option>
                  </select>

                  {paymentMethod === 'cartoes' && (
                    <div className="mt-3 space-y-3">
                      <select 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                        value={cardType}
                        onChange={(e) => setCardType(e.target.value)}
                        disabled={isSubmitting}
                      >
                        <option value="debito">Débito</option>
                        <option value="credito">Crédito</option>
                      </select>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                        placeholder="Bandeira do cartão (Ex: Visa, Mastercard)"
                        value={cardBrand}
                        onChange={(e) => setCardBrand(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                  {paymentMethod === 'dinheiro' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                        placeholder={deliveryType === 'entrega' ? "Troco para quanto? Ex: 50,00" : "Valor em dinheiro para pagamento"}
                        value={changeFor}
                        onChange={(e) => setChangeFor(e.target.value)}
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {deliveryType === 'entrega' 
                          ? "Informe para quanto precisa de troco" 
                          : "Informe o valor em dinheiro que irá pagar"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Informações importantes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-blue-800 text-sm">📱 Como funciona no celular:</p>
                  <ul className="text-blue-700 text-xs mt-2 space-y-1">
                    <li>• <strong>iPhone:</strong> Pode abrir automaticamente ou pedir para copiar</li>
                    <li>• <strong>Android:</strong> Geralmente abre direto no WhatsApp</li>
                    <li>• <strong>Número:</strong> (53) 9708-2320</li>
                    <li>• Se não funcionar, use a opção "Copiar Mensagem" abaixo</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
            {/* Botão principal */}
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Preparando Pedido...
                </>
              ) : (
                <>
                  📱 Enviar via WhatsApp
                </>
              )}
            </button>

            {/* Botões alternativos */}
            {showCopyMessage && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopyMessage}
                  className="bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  📋 Copiar Mensagem
                </button>
                <button
                  onClick={handleOpenWhatsAppManual}
                  className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  🔄 Tentar Novamente
                </button>
              </div>
            )}

            {/* Instruções */}
            <div className="text-center">
              <p className="text-xs text-gray-600">
                Problemas? <strong>Copie a mensagem e cole no WhatsApp</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;