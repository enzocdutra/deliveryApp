// CartModal.jsx
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../Context/CartContext';
import { toast } from 'react-toastify';

const CartModal = ({ isOpen, onClose }) => {
  const { cart, removeItemFromCart, clearCart } = useContext(CartContext);
  const [deliveryType, setDeliveryType] = useState('retirar');
  const [address, setAddress] = useState('');
  const [addressWarnVisible, setAddressWarnVisible] = useState(false);

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
      toast.error("Restaurante fechado");
      return;
    }
    if (!cart.length) return;
    if (deliveryType === 'entrega' && !address.trim()) {
      setAddressWarnVisible(true);
      return;
    }

    const cartItemsText = cart
      .map((item) => {
        let text = `Item: ${item.name}\n`;
        if (item.extras.length) {
          text += 'Adicionais:\n';
          item.extras.forEach(extra => {
            text += ` - ${extra.name} (R$ ${extra.price.toFixed(2)})\n`;
          });
        }
        text += `Quantidade: ${item.quantity}\nValor: R$${item.finalPrice.toFixed(2)}\n`;
        text += `Observações: ${item.comments}\n`;
        return text;
      })
      .join("\n");

    let finalTotal = total;
    if (deliveryType === 'entrega') finalTotal += 10;

    const endereco = deliveryType === 'entrega' ? address : "Av. Presidente Vargas 24";
    const message = encodeURIComponent(
      `${cartItemsText}\n${deliveryType === 'entrega' ? 'Taxa de entrega: R$10,00\n' : ''}Total: R$${finalTotal.toFixed(2)}\nEndereço: ${endereco}\nObrigado pela preferência =)`
    );

    const phone = "53991471322";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="bg-black/60 fixed inset-0 flex items-center justify-center overflow-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-black p-5 rounded-md w-[90%] md:w-[600px]">
        <h2 className="text-white font-bold text-center text-2xl mb-4">Seu carrinho</h2>

        {cart.map((item, index) => (
          <div key={index} className="text-white p-4 mb-4">
            <p className="font-bold text-lg">{item.name}</p>
            {item.description && (
              <p className="text-sm italic">Descrição: {item.description}</p>
            )}
            {item.extras?.length > 0 && (
              <div className="text-sm italic">
                Adicionais:
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
              className="bg-red-800 mt-1 py-1 px-2 rounded"
              onClick={() => removeItemFromCart(item.name, item.extrasTotal, item.comments)}
            >
              Remover
            </button>
          </div>
        ))}

        <p className="font-bold text-white">Total: R$ {total.toFixed(2)}</p>

        <div className="w-full flex flex-col gap-2 my-4">
          <label className="flex items-center  p-3 rounded cursor-pointer hover:bg-gray-700 transition">
            <input
              type="radio"
              className="form-radio text-green-500 mr-3 h-5 w-5"
              checked={deliveryType === 'retirar'}
              onChange={() => setDeliveryType('retirar')}
            />
            <span className="text-white font-medium">Retirar no local</span>
          </label>
          <label className="flex items-center p-3 rounded cursor-pointer hover:bg-gray-700 transition">
            <input
              type="radio"
              className="form-radio text-green-500 mr-3 h-5 w-5"
              checked={deliveryType === 'entrega'}
              onChange={() => setDeliveryType('entrega')}
            />
            <span className="text-white font-medium">Entregar</span>
          </label>
        </div>

        {deliveryType === 'entrega' && (
          <input
            className={`w-full p-2 bg-[#f1f1f1] outline-0 rounded-md ${addressWarnVisible ? 'border border-red-500' : ''}`}
            placeholder="Endereço completo"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        )}
        {addressWarnVisible && <p className="text-red-500">Informe o endereço!</p>}

        <button className="bg-green-500 py-2 px-4 rounded text-white mt-4" onClick={handleCheckout}>
          Finalizar pedido
        </button>
        <button className="bg-red-900 ml-2 py-2 px-4 rounded text-white" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default CartModal;
