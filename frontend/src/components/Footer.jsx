import React from 'react';
import { ShoppingCart } from 'lucide-react';

const Footer = ({ onCartClick, cartCount, totalPrice = 0, isCartOpen = false, storeOpen = false }) => {
  const hasItems = cartCount > 0;

  return (
    <>
      <div className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-6 sm:left-6">
        <button
          type="button"
          onClick={onCartClick}
          className={`group flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left shadow-2xl transition active:scale-[0.98] sm:w-auto sm:min-w-72 ${
            storeOpen
              ? 'border-amber-300 bg-stone-950 text-white hover:bg-stone-900'
              : 'border-red-200 bg-white text-stone-950'
          } ${isCartOpen ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
          aria-label={`Ver carrinho com ${cartCount} itens`}
        >
          <span className={`flex h-12 w-12 items-center justify-center rounded-full ${
            storeOpen ? 'bg-amber-400 text-stone-950' : 'bg-red-100 text-red-700'
          }`}>
            <ShoppingCart size={22} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-black">
              {hasItems ? `${cartCount} item${cartCount !== 1 ? 's' : ''} no carrinho` : 'Seu carrinho'}
            </span>
            <span className={`block text-xs font-semibold ${storeOpen ? 'text-stone-300' : 'text-red-700'}`}>
              {storeOpen ? 'Toque para finalizar' : 'Pedidos das 19h às 00h'}
            </span>
          </span>

          <span className="text-right">
            <span className="block text-xs font-bold uppercase tracking-wide opacity-70">Subtotal</span>
            <span className="block text-lg font-black">R$ {totalPrice.toFixed(2)}</span>
          </span>
        </button>
      </div>

      <div className="h-24" />
    </>
  );
};

export default Footer;
