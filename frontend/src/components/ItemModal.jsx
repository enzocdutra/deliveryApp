import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ItemModal = ({ itemTitle, itemPrice, itemImage, itemDescription, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState('');
  const [selectedExtras, setSelectedExtras] = useState([]);

  // Lista de adicionais disponíveis
  const extrasOptions = [
    { id: 1, name: "Queijo extra", price: 1.50 },
    { id: 2, name: "Bacon extra", price: 2.00 },
    { id: 3, name: "Molho extra", price: 0.75 },
  ];

  // Converte o preço base para número
  const numericPrice = parseFloat(itemPrice.replace(',', '.'));
  
  // Calcula o valor total dos adicionais selecionados
  const extrasTotal = selectedExtras.reduce((acc, extra) => acc + extra.price, 0);
  // Calcula o preço final: (preço base + adicionais) x quantidade
  const finalPrice = (numericPrice + extrasTotal) * quantity;

  const handleConfirm = () => {
    const itemData = {
      name: itemTitle,
      price: numericPrice,
      quantity,
      comments: comments.trim() === '' ? 'Nenhuma observação' : comments,
      description: itemDescription,
      itemImage,
      extras: selectedExtras, // adicionais selecionados
      extrasTotal,
      finalPrice,
    };

    onConfirm(itemData);
    onClose();
  };

  const handleExtraChange = (extra, isChecked) => {
    if (isChecked) {
      if (selectedExtras.length < 2) {
        setSelectedExtras(prev => [...prev, extra]);
      } else {
        alert("Você pode selecionar até 2 adicionais.");
      }
    } else {
      setSelectedExtras(prev => prev.filter(item => item.id !== extra.id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md md:max-w-lg relative max-h-screen overflow-y-auto">
        <button onClick={onClose} className="absolute top-2  text-gray-500 p-4 text-4xl">
          &times;
        </button>
        {itemImage && (
          <img
            src={itemImage}
            alt={itemTitle}
            className="w-full h-[250px] md:h-[400px] object-cover mb-4 mt-10 rounded"
          />
        )}
        <h2 className="text-xl md:text-2xl font-bold mb-2">{itemTitle}</h2>
        {itemDescription && <p className="text-md md:text-lg text-gray-700 mb-2">{itemDescription}</p>}
        <p className="text-lg md:text-xl font-semibold mb-4">R$ {numericPrice.toFixed(2)}</p>

        {/* Seção de Adicionais */}
        <label className="block mb-1 font-semibold text-sm md:text-base">Adicionais (máx 2):</label>
        <div className="mb-4">
          {extrasOptions.map(extra => (
            <div key={extra.id} className="flex items-center">
              <input
                type="checkbox"
                id={`extra-${extra.id}`}
                onChange={(e) => handleExtraChange(extra, e.target.checked)}
                checked={selectedExtras.some(item => item.id === extra.id)}
              />
              <label htmlFor={`extra-${extra.id}`} className="ml-2 text-sm md:text-base">
                {extra.name} (R$ {extra.price.toFixed(2)})
              </label>
            </div>
          ))}
        </div>

        <label className="block mb-1 font-semibold text-sm md:text-base">Quantidade:</label>
        <div className="flex items-center gap-2 mb-4">
          <button 
            onClick={() => setQuantity(q => Math.max(1, q - 1))} 
            className="bg-gray-300 px-3 py-1 rounded-l text-sm md:text-base"
          >
            -
          </button>
          <span className="border border-[#ccc] outline-none px-4 text-sm md:text-base">{quantity}</span>
          <button 
            onClick={() => setQuantity(q => q + 1)} 
            className="bg-gray-300 px-3 py-1 rounded-r text-sm md:text-base"
          >
            +
          </button>
        </div>

        <label className="block mb-1 font-semibold text-sm md:text-base">Observações:</label>
        <textarea 
          className="w-full p-2 border border-[#ccc] rounded mb-4 text-sm md:text-base"
          rows="3"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Ex: sem cebola, maionese à parte, etc."
        />

        <button 
          onClick={handleConfirm}
          className="bg-green-700 text-white w-full py-2 rounded font-semibold text-sm md:text-base"
        >
          Adicionar R$ {finalPrice.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

ItemModal.propTypes = {
  itemTitle: PropTypes.string.isRequired,
  itemPrice: PropTypes.string.isRequired,
  itemImage: PropTypes.string,
  itemDescription: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

ItemModal.defaultProps = {
  itemImage: '',
  itemDescription: '',
};

export default ItemModal;
