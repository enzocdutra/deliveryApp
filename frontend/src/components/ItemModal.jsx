

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ItemModal = ({
  itemTitle,
  itemPrice,
  itemImage,
  itemDescription,
  itemCategory,
  onClose,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState('');
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [animate, setAnimate] = useState(false);

ItemModal.propTypes = {
  itemTitle: PropTypes.string.isRequired,
  itemPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  itemImage: PropTypes.string,
  itemDescription: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  itemCategory: PropTypes.string,
};



  // Inicia a animação assim que o modal é montado
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Categorias que são consideradas Hambúrguer
  const hamburgerCategories = [
    'Normais',
    'Duplos',
    'Camarao',
    'Agridoce',
    'AgridoceGeleia'
  ];

  const extrasOptions = [
    { id: 1, name: "Bife de carne bovina", price: 7.00 },
    { id: 2, name: "Bife de frango", price: 7.00 },
    { id: 3, name: "Bacon", price: 5.00 },
    { id: 4, name: "Lombo canadense", price: 3.00 },
    { id: 5, name: "Queijo mussarela", price: 3.00 },
    { id: 6, name: "Queijo cheddar", price: 3.00 },
    { id: 7, name: "Queijo provolone", price: 3.00 },
    { id: 8, name: "Cheddar cremoso", price: 3.00 },
    { id: 9, name: "Catupiry", price: 3.00 },
    { id: 10, name: "Barbecue", price: 3.00 },
    { id: 11, name: "Geleia de pimenta", price: 4.00 },
    { id: 12, name: "Geleia de abacaxi com pimenta", price: 4.00 },
    { id: 13, name: "Geleia de morango com pimenta", price: 4.00 },
    { id: 14, name: "Geleia de uva com vinho", price: 4.00 },
    { id: 15, name: "Geleia de maracujá com pimenta", price: 4.00 },
    { id: 16, name: "Pickles", price: 2.00 },
    { id: 17, name: "Cebola roxa crua", price: 3.00 },
    { id: 18, name: "Cebola roxa caramelizada", price: 3.00 },
    { id: 19, name: "Tomate", price: 2.00 },
    { id: 20, name: "Alface", price: 2.00 },
    { id: 21, name: "Pimentões", price: 2.00 },
    { id: 22, name: "Rúcula", price: 2.00 },
    { id: 23, name: "Anéis de cebola", price: 4.00 },
    { id: 24, name: "Doritos", price: 4.00 },
    { id: 25, name: "Abacaxi caramelizado", price: 4.00 },
    { id: 26, name: "Figo caramelizado", price: 4.00 },
    { id: 27, name: "Pêssego", price: 4.00 },
    { id: 28, name: "Nutella", price: 4.00 },
    { id: 29, name: "Doce de leite", price: 4.00 },
  ];
  
const numericPrice = typeof itemPrice === "string"
  ? parseFloat(itemPrice.replace(",", "."))
  : Number(itemPrice);


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
      extras: selectedExtras,
      extrasTotal,
      finalPrice,
    };

    onConfirm(itemData);
    onClose();
  };

  // Lida com a seleção de até 2 extras
  const handleExtraChange = (extra, isChecked) => {
    if (isChecked) {
      if (selectedExtras.length < 2) {
        setSelectedExtras(prev => [...prev, extra]);
      } else {
        alert('Você pode selecionar até 2 adicionais.');
      }
    } else {
      setSelectedExtras(prev => prev.filter(item => item.id !== extra.id));
    }
  };

  return (
    <div className="max-w-full fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999]">
      <div
        className={`bg-white p-6 rounded shadow-md w-full md:w-[800px] relative max-h-screen overflow-y-auto transform transition-all duration-300 ${
          animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <button onClick={onClose} className="absolute top-2 text-gray-500 p-4 text-4xl">
          &times;
        </button>

        {itemImage && (
          <img
            src={itemImage}
            alt={itemTitle}
            className="w-full h-[250px] md:h-[600px] object-cover mb-4 mt-10 rounded"
          />
        )}

        <h2 className="text-xl md:text-2xl font-bold mb-2">{itemTitle}</h2>
        {itemDescription && (
          <p className="text-md md:text-lg text-gray-700 mb-2">{itemDescription}</p>
        )}
        <p className="text-lg md:text-xl font-semibold mb-4">
          R$ {numericPrice.toFixed(2)}
        </p>

        {/* Exibe Adicionais SOMENTE se a categoria estiver na lista de hambúrguer */}
        {hamburgerCategories.includes(itemCategory) && (
          <>
            <label className="block mb-1 font-semibold text-sm md:text-base">
              Adicionais (máx 2):
            </label>
            <div className="mb-4">
              {extrasOptions.map(extra => (
                <div key={extra.id} className="items-center">
                  <input
                    type="checkbox"
                    id={`extra-${extra.id}`}
                    onChange={e => handleExtraChange(extra, e.target.checked)}
                    checked={selectedExtras.some(item => item.id === extra.id)}
                    className="rounded-full border-[#ccc]"
                  />
                  <label htmlFor={`extra-${extra.id}`} className="ml-2 text-sm md:text-base">
                    {extra.name} (R$ {extra.price.toFixed(2)})
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
  <div className='py-4 text-center bg-black'>
          <p className='text-red-500'>Não mandamos maionese a parte</p>
        </div>
        <label className="block mb-1 font-semibold text-sm md:text-base">Quantidade:</label>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="bg-gray-300 px-3 py-1 rounded-l text-sm md:text-base"
          >
            -
          </button>
          <span className="border border-[#ccc] outline-none px-4 text-sm md:text-base">
            {quantity}
          </span>
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
          onChange={e => setComments(e.target.value)}
          placeholder="Ex: sem cebola, sem tomate, etc."
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
  itemCategory: PropTypes.string,
};

ItemModal.defaultProps = {
  itemImage: '',
  itemDescription: '',
  itemCategory: '',
};

export default ItemModal;
