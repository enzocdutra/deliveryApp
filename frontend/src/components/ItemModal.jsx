import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { X, Plus, Minus, AlertCircle, Check } from 'lucide-react';

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
  const [showExtrasWarning, setShowExtrasWarning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Inicia a animação assim que o modal é montado
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Categorias que são consideradas Hambúrguer
  const hamburgerCategories = useMemo(() => [
    'Normais', 'Duplos', 'Camarao', 'Agridoce', 'AgridoceGeleia'
  ], []);

  // Organização dos extras por categorias
  const extrasOptions = useMemo(() => ({
    'Proteínas': [
      { id: 1, name: "Bife de carne bovina", price: 10.00, emoji: "🥩" },
      { id: 2, name: "Bife de frango", price: 9.00, emoji: "🍗" },
      { id: 3, name: "Bacon", price: 7.00, emoji: "🥓" },
      { id: 4, name: "Lombo canadense", price: 3.00, emoji: "🐖" },
    ],
    'Queijos': [
      { id: 5, name: "Queijo mussarela", price: 4.00, emoji: "🧀" },
      { id: 6, name: "Queijo cheddar", price: 4.00, emoji: "🧀" },
      { id: 7, name: "Queijo provolone", price: 4.00, emoji: "🧀" },
      { id: 8, name: "Cheddar cremoso", price: 4.00, emoji: "🧀" },
      { id: 9, name: "Catupiry", price: 4.00, emoji: "🧀" },
    ],
    'Molhos': [
      { id: 10, name: "Barbecue", price: 3.00, emoji: "🍯" },
      { id: 11, name: "Geleia de pimenta", price: 6.00, emoji: "🌶️" },
      { id: 12, name: "Geleia de abacaxi com pimenta", price: 6.00, emoji: "🍍" },
      { id: 13, name: "Geleia de morango com pimenta", price: 6.00, emoji: "🍓" },
      { id: 14, name: "Geleia de uva com vinho", price: 6.00, emoji: "🍇" },
      { id: 15, name: "Geleia de maracujá com pimenta", price: 6.00, emoji: "🥭" },
    ],
    'Vegetais': [
      { id: 16, name: "Pickles", price: 2.00, emoji: "🥒" },
      { id: 17, name: "Cebola roxa crua", price: 3.00, emoji: "🧅" },
      { id: 18, name: "Cebola roxa caramelizada", price: 3.00, emoji: "🧅" },
      { id: 19, name: "Tomate", price: 3.00, emoji: "🍅" },
      { id: 20, name: "Alface", price: 3.00, emoji: "🥬" },
      { id: 21, name: "Pimentões", price: 2.00, emoji: "🫑" },
      { id: 22, name: "Rúcula", price: 2.00, emoji: "🌱" },
    ],
    'Extras Especiais': [
      { id: 23, name: "Anéis de cebola", price: 5.00, emoji: "⭕" },
      { id: 24, name: "Doritos", price: 5.00, emoji: "🌮" },
      { id: 25, name: "Abacaxi caramelizado", price: 4.00, emoji: "🍍" },
      { id: 26, name: "Figo caramelizado", price: 4.00, emoji: "🍈" },
      { id: 27, name: "Pêssego", price: 4.00, emoji: "🍑" },
      { id: 28, name: "Nutella", price: 4.00, emoji: "🍫" },
      { id: 29, name: "Doce de leite", price: 4.00, emoji: "🥛" },
    ]
  }), []);

  const numericPrice = useMemo(() => 
    typeof itemPrice === "string" 
      ? parseFloat(itemPrice.replace(",", ".")) 
      : Number(itemPrice)
  , [itemPrice]);

  // Calcula o valor total dos adicionais selecionados
  const extrasTotal = useMemo(() => 
    selectedExtras.reduce((acc, extra) => acc + extra.price, 0)
  , [selectedExtras]);

  // Calcula o preço final: (preço base + adicionais) x quantidade
  const finalPrice = useMemo(() => 
    (numericPrice + extrasTotal) * quantity
  , [numericPrice, extrasTotal, quantity]);

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
      finalPrice: parseFloat(finalPrice.toFixed(2)),
    };

    onConfirm(itemData);
  };

  // Lida com a seleção de até 2 extras
  const handleExtraChange = (extra, isChecked) => {
    if (isChecked) {
      if (selectedExtras.length < 2) {
        setSelectedExtras(prev => [...prev, extra]);
        setShowExtrasWarning(false);
      } else {
        setShowExtrasWarning(true);
        setTimeout(() => setShowExtrasWarning(false), 3000);
      }
    } else {
      setSelectedExtras(prev => prev.filter(item => item.id !== extra.id));
    }
  };

  const isHamburger = hamburgerCategories.includes(itemCategory);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-[9999] backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden transform transition-all duration-300 ${
          animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          // Garante que o modal não fique muito alto em dispositivos pequenos
          maxHeight: 'calc(100vh - 2rem)',
        }}
      >
        {/* Header */}
        <div className="relative">
          {itemImage && (
            <img
              src={itemImage}
              alt={itemTitle}
              className="w-full h-32 sm:h-48 object-cover"
            />
          )}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 hover:bg-white rounded-full p-1 sm:p-2 transition-all duration-200 shadow-lg hover:scale-110"
          >
            <X size={isMobile ? 16 : 20} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 sm:p-4">
            <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 line-clamp-2">{itemTitle}</h2>
            <p className="text-base sm:text-lg font-semibold text-green-300">
              R$ {numericPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div 
          className="p-4 sm:p-6 overflow-y-auto"
          style={{
            maxHeight: isMobile ? 'calc(60vh - 80px)' : '60vh',
            paddingBottom: isMobile ? '80px' : 'auto' // Espaço para o botão flutuante
          }}
        >
          {itemDescription && (
            <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              {itemDescription}
            </p>
          )}

          {/* Adicionais para hambúrgueres */}
          {isHamburger && (
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold">Adicionais (máx. 2)</h3>
                <span className="text-xs sm:text-sm text-gray-500">
                  {selectedExtras.length}/2 selecionados
                </span>
              </div>

              {showExtrasWarning && (
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                  <AlertCircle size={14} className="text-yellow-600" />
                  <span className="text-xs sm:text-sm text-yellow-700">
                    Você pode selecionar apenas 2 adicionais
                  </span>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                {Object.entries(extrasOptions).map(([category, extras]) => (
                  <div key={category}>
                    <h4 className="font-medium text-gray-700 mb-2 text-xs sm:text-sm uppercase tracking-wide">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {extras.map(extra => {
                        const isSelected = selectedExtras.some(item => item.id === extra.id);
                        const isDisabled = selectedExtras.length >= 2 && !isSelected;
                        
                        return (
                          <label
                            key={extra.id}
                            className={`flex items-center p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'bg-green-50 border-green-500'
                                : isDisabled
                                ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                                : 'bg-white border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              onChange={e => handleExtraChange(extra, e.target.checked)}
                              checked={isSelected}
                              disabled={isDisabled && !isSelected}
                              className="hidden"
                            />
                            <div className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded flex items-center justify-center mr-2 sm:mr-3 ${
                              isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check size={isMobile ? 10 : 12} className="text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-xs sm:text-sm truncate">
                                  {extra.emoji} {extra.name}
                                </span>
                                <span className="text-green-600 font-semibold text-xs sm:text-sm whitespace-nowrap ml-2">
                                  +R$ {extra.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aviso sobre maionese */}
          {isHamburger && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500" />
                <span className="text-red-700 text-xs sm:text-sm font-medium">
                  Não enviamos maionese à parte
                </span>
              </div>
            </div>
          )}

          {/* Quantidade */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-base sm:text-lg font-semibold mb-2 sm:mb-3">Quantidade</label>
            <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-xs mx-auto">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 sm:p-3 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                <Minus size={isMobile ? 16 : 20} />
              </button>
              <span className="text-xl sm:text-2xl font-bold min-w-[40px] sm:min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 sm:p-3 transition-colors duration-200"
              >
                <Plus size={isMobile ? 16 : 20} />
              </button>
            </div>
          </div>

          {/* Observações */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-base sm:text-lg font-semibold mb-2 sm:mb-3">Observações</label>
            <textarea
              className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl resize-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-sm sm:text-base"
              rows={isMobile ? 2 : 3}
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Ex: sem cebola, sem tomate, ponto da carne, etc."
            />
          </div>
        </div>

        {/* Footer - BOTÃO FIXO NO MOBILE */}
        <div className={`
          border-t border-gray-200 p-4 sm:p-6 bg-gray-50
          ${isMobile ? 'sticky bottom-0 left-0 right-0 shadow-lg' : ''}
        `}>
          <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : 'gap-4'}`}>
            <div className={`text-center ${isMobile ? 'w-full' : ''}`}>
              <div className="text-xs sm:text-sm text-gray-600">Total</div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                R$ {finalPrice.toFixed(2)}
              </div>
              {extrasTotal > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Inclui R$ {extrasTotal.toFixed(2)} em adicionais
                </div>
              )}
            </div>
            
            <button
              onClick={handleConfirm}
              className={`
                bg-gradient-to-r from-green-600 to-green-500 
                hover:from-green-700 hover:to-green-600 
                text-white rounded-xl font-semibold 
                transition-all duration-200 transform hover:scale-105 
                shadow-lg hover:shadow-xl
                ${isMobile 
                  ? 'w-full py-3 px-6 text-base' 
                  : 'px-8 py-4 text-lg'
                }
              `}
            >
              {isMobile ? '➕ Adicionar' : 'Adicionar ao Pedido'}
            </button>
          </div>
        </div>

        {/* Botão flutuante alternativo para mobile muito pequeno */}
        {isMobile && (
          <div 
            className="md:hidden"
            style={{
              height: 'env(safe-area-inset-bottom, 0px)',
              minHeight: '20px'
            }}
          />
        )}
      </div>
    </div>
  );
};

ItemModal.propTypes = {
  itemTitle: PropTypes.string.isRequired,
  itemPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  itemImage: PropTypes.string,
  itemDescription: PropTypes.string,
  itemCategory: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

ItemModal.defaultProps = {
  itemImage: '',
  itemDescription: '',
  itemCategory: '',
};

export default ItemModal;