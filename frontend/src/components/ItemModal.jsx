import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, Check, Minus, Plus, X } from 'lucide-react';
import { getClosedStoreMessage } from '../lib/store-hours';

const extrasOptions = {
  Proteinas: [
    { id: 1, name: 'Bife de carne bovina', price: 12 },
    { id: 2, name: 'Bife de frango', price: 10 },
    { id: 3, name: 'Bacon', price: 8 },
    { id: 4, name: 'Lombo canadense', price: 4 },
  ],
  Queijos: [
    { id: 5, name: 'Queijo mussarela', price: 4 },
    { id: 6, name: 'Queijo cheddar', price: 4 },
    { id: 7, name: 'Queijo provolone', price: 4 },
    { id: 8, name: 'Cheddar cremoso', price: 4 },
    { id: 9, name: 'Catupiry', price: 4 },
  ],
  Molhos: [
    { id: 10, name: 'Barbecue', price: 4 },
    { id: 11, name: 'Geleia de pimenta', price: 6 },
    { id: 12, name: 'Geleia de abacaxi com pimenta', price: 6 },
    { id: 13, name: 'Geleia de morango com pimenta', price: 6 },
    { id: 14, name: 'Geleia de uva com vinho', price: 6 },
    { id: 15, name: 'Geleia de maracuja com pimenta', price: 6 },
  ],
  Vegetais: [
    { id: 16, name: 'Pickles', price: 3 },
    { id: 17, name: 'Cebola roxa crua', price: 3 },
    { id: 18, name: 'Cebola roxa caramelizada', price: 4 },
    { id: 19, name: 'Tomate', price: 3 },
    { id: 20, name: 'Alface', price: 3 },
    { id: 21, name: 'Pimentoes', price: 3 },
    { id: 22, name: 'Rucula', price: 3 },
  ],
  'Extras especiais': [
    { id: 23, name: 'Aneis de cebola', price: 5 },
    { id: 24, name: 'Doritos', price: 5 },
    { id: 25, name: 'Abacaxi caramelizado', price: 5 },
    { id: 26, name: 'Figo caramelizado', price: 5 },
    { id: 27, name: 'Pessego', price: 4 },
    { id: 28, name: 'Nutella', price: 3 },
    { id: 29, name: 'Doce de leite', price: 3 },
  ],
};

const hamburgerCategories = ['Normais', 'Duplos', 'Camarao', 'Agridoce', 'AgridoceGeleia'];

const ItemModal = ({
  itemTitle,
  itemPrice,
  itemImage,
  itemDescription,
  itemCategory,
  onClose,
  onConfirm,
  storeOpen,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState('');
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showExtrasWarning, setShowExtrasWarning] = useState(false);

  const numericPrice = useMemo(() => {
    if (typeof itemPrice === 'string') {
      return Number(itemPrice.replace(',', '.')) || 0;
    }

    return Number(itemPrice) || 0;
  }, [itemPrice]);

  const extrasTotal = useMemo(
    () => selectedExtras.reduce((acc, extra) => acc + extra.price, 0),
    [selectedExtras],
  );

  const finalPrice = useMemo(
    () => (numericPrice + extrasTotal) * quantity,
    [numericPrice, extrasTotal, quantity],
  );

  const isHamburger = hamburgerCategories.includes(itemCategory);

  const handleExtraChange = (extra, isChecked) => {
    if (isChecked) {
      if (selectedExtras.length >= 2) {
        setShowExtrasWarning(true);
        setTimeout(() => setShowExtrasWarning(false), 3000);
        return;
      }

      setSelectedExtras((prev) => [...prev, extra]);
      setShowExtrasWarning(false);
      return;
    }

    setSelectedExtras((prev) => prev.filter((item) => item.id !== extra.id));
  };

  const handleConfirm = () => {
    if (!storeOpen) return;

    onConfirm({
      name: itemTitle,
      price: numericPrice,
      quantity,
      comments: comments.trim() === '' ? 'Nenhuma observacao' : comments,
      description: itemDescription,
      itemImage,
      extras: selectedExtras,
      extrasTotal,
      finalPrice: Number(finalPrice.toFixed(2)),
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="relative min-h-44 bg-stone-950 sm:min-h-56">
          {itemImage && (
            <img
              src={itemImage}
              alt={itemTitle}
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-stone-950 shadow-lg transition hover:bg-amber-100"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <h2 className="line-clamp-2 text-2xl font-black text-white sm:text-3xl">{itemTitle}</h2>
            <p className="mt-1 text-2xl font-black text-amber-300">R$ {finalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {itemDescription && (
            <p className="mb-5 text-sm leading-6 text-stone-600 sm:text-base">{itemDescription}</p>
          )}

          {!storeOpen && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              <AlertCircle size={17} />
              <span>{getClosedStoreMessage()}</span>
            </div>
          )}

          {isHamburger && (
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-stone-950">Adicionais</h3>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
                  {selectedExtras.length}/2 selecionados
                </span>
              </div>

              {showExtrasWarning && (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
                  <AlertCircle size={16} />
                  Voce pode selecionar apenas 2 adicionais.
                </div>
              )}

              <div className="space-y-4">
                {Object.entries(extrasOptions).map(([category, extras]) => (
                  <div key={category}>
                    <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-stone-500">{category}</h4>
                    <div className="grid gap-2">
                      {extras.map((extra) => {
                        const isSelected = selectedExtras.some((item) => item.id === extra.id);
                        const isDisabled = selectedExtras.length >= 2 && !isSelected;

                        return (
                          <label
                            key={extra.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50'
                                : isDisabled
                                  ? 'cursor-not-allowed border-stone-200 bg-stone-50 opacity-60'
                                  : 'border-stone-200 bg-white hover:border-amber-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={isSelected}
                              disabled={isDisabled && !isSelected}
                              onChange={(event) => handleExtraChange(extra, event.target.checked)}
                            />
                            <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                              isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-stone-300'
                            }`}>
                              {isSelected && <Check size={13} />}
                            </span>
                            <span className="flex-1 text-sm font-semibold text-stone-800">{extra.name}</span>
                            <span className="text-sm font-black text-red-600">+R$ {extra.price.toFixed(2)}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isHamburger && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              Nao enviamos maionese a parte.
            </div>
          )}

          <div className="mb-6">
            <label className="mb-3 block text-lg font-black text-stone-950">Quantidade</label>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1}
                className="rounded-full bg-stone-100 p-3 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Diminuir quantidade"
              >
                <Minus size={18} />
              </button>
              <span className="min-w-12 text-center text-2xl font-black text-stone-950">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="rounded-full bg-stone-100 p-3 transition hover:bg-stone-200"
                aria-label="Aumentar quantidade"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-lg font-black text-stone-950">Observacoes</label>
            <textarea
              className="w-full resize-none rounded-xl border border-stone-200 p-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              rows={3}
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              placeholder="Ex: sem cebola, sem tomate, ponto da carne..."
            />
          </div>
        </div>

        <div className="border-t border-stone-200 bg-stone-50 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Total</p>
              <p className="text-2xl font-black text-stone-950">R$ {finalPrice.toFixed(2)}</p>
              {extrasTotal > 0 && (
                <p className="text-xs font-semibold text-stone-500">Inclui R$ {extrasTotal.toFixed(2)} em adicionais</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!storeOpen}
              className={`min-h-12 rounded-full px-6 py-3 text-base font-black transition sm:min-w-56 ${
                storeOpen
                  ? 'bg-red-600 text-white shadow-lg hover:bg-red-700 active:scale-95'
                  : 'cursor-not-allowed bg-stone-200 text-stone-500'
              }`}
            >
              {storeOpen ? 'Adicionar ao pedido' : 'Fora do horario'}
            </button>
          </div>
        </div>
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
  storeOpen: PropTypes.bool,
};

ItemModal.defaultProps = {
  itemImage: '',
  itemDescription: '',
  itemCategory: '',
  storeOpen: true,
};

export default ItemModal;
