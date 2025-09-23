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
  const total = cart.reduce((sum, item) => sum + item.finalPrice, 0);

  useEffect(() => {
    if (address.trim()) setAddressWarnVisible(false);
  }, [address]);

  const checkRestaurantOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 19 && hours < 24;
  };

  const handleCheckout = () => {
    if (!checkRestaurantOpen()) {
      toast.error("Ops! O restaurante está fechado no momento. Volte mais tarde!");
      return;
    }
    if (!cart.length) return;
  
    if (!clientName.trim()) {
      toast.error("Por favor, preencha o nome do cliente.");
      return;
    }
  
    if (deliveryType === 'entrega') {
      if (!address.trim() || !neighborhood.trim()) {
        toast.error("Por favor, preencha endereço e bairro.");
        setAddressWarnVisible(true);
        return;
      }
      if (paymentMethod === 'dinheiro' && !changeFor.trim()) {
        toast.error("Por favor, informe para quanto precisa de troco.");
        return;
      }
    }
  
    const cartItemsText = cart
    .map((item) => {
      let text = `*🍔 Item:* *${item.name}*\n`;
      if (item.extras.length) {
        text += `*➕ Adicionais:*\n`;
        item.extras.forEach(extra => {
          text += `  - ${extra.name} (_R$ ${extra.price.toFixed(2)}_)\n`;
        });
      }
      text += `*📦 Quantidade:* _${item.quantity}_\n`;
      text += `*💰 Valor:* _R$ ${item.finalPrice.toFixed(2)}_\n`;
      text += `*📝 Observações:* *${item.comments}*\n`;
      return text;
    })
    .join("\n");
  
    const endereco =
      deliveryType === 'entrega'
        ? `${address}, Bairro: ${neighborhood}${complement ? `, Complemento: ${complement}` : ''}`
        : "Av. Presidente Vargas 24";
  
    let paymentInfo = "";
    if (deliveryType === 'entrega') {
      if (paymentMethod === 'pix') {
        paymentInfo = `Método de pagamento: Pix\n`;
      } else if (paymentMethod === 'cartoes') {
        paymentInfo = `Método de pagamento: Cartões (${cardType === 'debito' ? 'Débito' : 'Crédito'})\n`;
        paymentInfo += `Bandeira do cartão: ${cardBrand}\n`; // Adicione esta linha
      }  else {
        paymentInfo = `Método de pagamento: Dinheiro\nTroco para: ${changeFor}\n`;
      }
    }
  
  const message = encodeURIComponent(
  `${cartItemsText}\n${paymentInfo}*💵 Total:* _R$ ${total.toFixed(2)}_\n*👤 Nome:* ${clientName}\n${deliveryType === 'retirar' ? '*📍 Endereço da Hamburgueria:*' : '*📍 Endereço:*'} ${endereco}\n\nMuito obrigado pela preferência!`
);

  
    const phone = "5397082320";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  
    clearCart();
    onClose();
  };
  

  if (!isOpen) return null;

  return (
    <div
      className="bg-black/60 fixed inset-0 z-[9999] flex items-center justify-center overflow-auto p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#202020] p-5 rounded-md w-[90%] md:w-[700px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-center text-2xl mb-4">Seu Carrinho</h2>

        {cart.map((item, index) => (
          <div key={index} className="text-white p-4 mb-4 border-b border-gray-700">
            <p className="font-bold text-lg">{item.name}</p>
            {item.description && (
              <p className="text-sm italic">Descrição: {item.description}</p>
            )}
            {item.extras?.length > 0 && (
              <div className="text-sm italic">
                <p>Adicionais:</p>
                <ul>
                  {item.extras.map(extra => (
                    <li key={extra.id}>
                      {extra.name} (R$ {extra.price.toFixed(2)})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm italic">Observações: {item.comments}</p>
            <p>Quantidade: {item.quantity}</p>
            <p>R$ {item.finalPrice.toFixed(2)}</p>
            <button
              className="bg-red-800 mt-1 py-1 px-2 rounded hover:bg-red-700 transition"
              onClick={() => removeItemFromCart(item.name, item.extrasTotal, item.comments)}
            >
              Remover
            </button>
          </div>
        ))}

        <p className="font-bold text-white text-xl mt-4">Total: R$ {total.toFixed(2)}</p>

        {/* Nome do cliente (sempre visível) */}
        <input
          className="w-full p-2 mt-4 mb-2 bg-[#f1f1f1] outline-0 rounded-md"
          placeholder="Nome do cliente"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        <div className="w-full flex flex-col gap-2 my-4">
          <label className="flex items-center p-3 rounded cursor-pointer hover:bg-gray-700 transition">
            <input
              type="radio"
              name="deliveryType"
              className="form-radio text-green-500 mr-3 h-5 w-5"
              checked={deliveryType === 'retirar'}
              onChange={() => setDeliveryType('retirar')}
            />
            <span className="text-white font-medium">Retirar no local (Venha nos visitar!)</span>
          </label>
          <label className="flex items-center p-3 rounded cursor-pointer hover:bg-gray-700 transition">
            <input
              type="radio"
              name="deliveryType"
              className="form-radio text-green-500 mr-3 h-5 w-5"
              checked={deliveryType === 'entrega'}
              onChange={() => setDeliveryType('entrega')}
            />
            <span className="text-white font-medium">Entregar (Nós vamos até você!)</span>
          </label>
        </div>

        {deliveryType === 'entrega' && (
          <>
            <input
              className={`w-full p-2 mb-2 bg-[#f1f1f1] outline-0 rounded-md ${addressWarnVisible ? 'border border-red-500' : ''}`}
              placeholder="Digite seu endereço completo"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="w-full p-2 mb-2 bg-[#f1f1f1] outline-0 rounded-md"
              placeholder="Bairro"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            />
            <input
              className="w-full p-2 mb-2 bg-[#f1f1f1] outline-0 rounded-md"
              placeholder="Complemento (Ex: apartamento, condomínio, bloco...)"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />

            <div className="w-full flex flex-col gap-2 my-4">
              <p className="text-white font-medium">Método de pagamento:</p>
              <label className="flex items-center p-2 rounded cursor-pointer hover:bg-gray-700 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="form-radio text-green-500 mr-3 h-5 w-5"
                  checked={paymentMethod === 'pix'}
                  onChange={() => setPaymentMethod('pix')}
                />
                <span className="text-white">Pix</span>
              </label>
              <label className="flex items-center p-2 rounded cursor-pointer hover:bg-gray-700 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="form-radio text-green-500 mr-3 h-5 w-5"
                  checked={paymentMethod === 'cartoes'}
                  onChange={() => setPaymentMethod('cartoes')}
                />
                <span className="text-white">Cartões</span>
              </label>
              {paymentMethod === 'cartoes' && (
  <div className="flex flex-col gap-1 ml-8">
    <p className="text-white text-sm">Selecione o tipo:</p>
    <label className="flex items-center p-1 cursor-pointer hover:bg-gray-700 transition">
      <input
        type="radio"
        name="cardType"
        className="form-radio text-green-500 mr-2 h-4 w-4"
        checked={cardType === 'debito'}
        onChange={() => setCardType('debito')}
      />
      <span className="text-white text-sm">Débito</span>
    </label>
    <label className="flex items-center p-1 cursor-pointer hover:bg-gray-700 transition">
      <input
        type="radio"
        name="cardType"
        className="form-radio text-green-500 mr-2 h-4 w-4"
        checked={cardType === 'credito'}
        onChange={() => setCardType('credito')}
      />
      <span className="text-white text-sm">Crédito</span>
    </label>
    
    {/* Adicione este novo campo para a bandeira */}
    <input
  className="w-full p-2 mt-2 bg-[#f1f1f1] outline-0 rounded-md"
  placeholder="Informe a bandeira do cartão (Ex: Visa, Mastercard)"
  value={cardBrand}
  onChange={(e) => setCardBrand(e.target.value)}
/>
  </div>
)}
              <label className="flex items-center p-2 rounded cursor-pointer hover:bg-gray-700 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="form-radio text-green-500 mr-3 h-5 w-5"
                  checked={paymentMethod === 'dinheiro'}
                  onChange={() => setPaymentMethod('dinheiro')}
                />
                <span className="text-white">Dinheiro</span>
              </label>
              {paymentMethod === 'dinheiro' && (
                <input
                  className="w-full p-2 bg-[#f1f1f1] outline-0 rounded-md"
                  placeholder="Troco para: Ex: 100"
                  value={changeFor}
                  onChange={(e) => setChangeFor(e.target.value)}
                />
              )}
            </div>
          </>
        )}

        <p className="bg-black p-4 text-red-500 text-xl rounded-md mb-5 italic">
          Observação:
          <p>
             Não servimos Maionese Caseira.
          </p>
          <p>
              Tele Á consultar no whatssapp.
          </p>
        </p>
        <div className="flex justify-center mt-4 gap-4">
          <button className="bg-green-500 py-2 px-4 rounded font-bold text-white hover:bg-green-600 transition" onClick={handleCheckout}>
            Finalizar Pedido
          </button>
          <button className="bg-red-900 py-2 px-4 rounded text-white hover:bg-red-800 transition" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
