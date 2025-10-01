import React from 'react';
import { FaCartPlus } from 'react-icons/fa';

const Footer = ({ onCartClick, cartCount, totalPrice = 0, isCartOpen = false }) => {
  const hasItems = cartCount > 0;
  
  return (
    <>
      {/* Botão Flutuante Único - Funciona em Mobile e Desktop */}
      <div className="fixed bottom-6 left-6 z-50 ">
        <button 
          className={`
            relative bg-gradient-to-br from-green-500 to-green-600 
            p-5 rounded-full shadow-2xl text-white 
            transition-all duration-300 transform
            hover:from-green-600 hover:to-green-700 
            hover:scale-110 hover:shadow-2xl
            active:scale-95 active:shadow-inner
            ${hasItems ? 'animate-pulse-slow' : ''}
            border-2 border-white border-opacity-20
            group
          `}
          onClick={onCartClick}
          aria-label={`Ver carrinho com ${cartCount} itens`}
        >
          <FaCartPlus className="text-2xl transition-transform duration-300 group-hover:scale-110" />
          
          {/* Badge de contador único */}
          {hasItems && (
            <span
              className={`
                absolute -top-1 -right-1 
                bg-gradient-to-r from-red-500 to-red-600 
                text-white text-xs font-bold rounded-full 
                w-6 h-6 flex items-center justify-center 
                border-2 border-white shadow-lg
                transition-all duration-300
                ${cartCount > 9 ? 'w-7 h-7 -top-2 -right-2 text-xs' : ''}
                ${cartCount > 99 ? 'w-8 h-8 -top-2 -right-2 text-xs' : ''}
                ${isCartOpen ? 'scale-0' : 'scale-100'}
                group-hover:scale-110
              `}
            >
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
          
          {/* Efeito de onda sutil */}
          <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
        </button>
        
        {/* Tooltip informativo */}
        {hasItems && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="font-semibold">{cartCount} item{cartCount !== 1 ? 's' : ''}</div>
            <div className="text-green-300">R$ {totalPrice.toFixed(2)}</div>
            <div className="text-xs text-gray-300 mt-1">Clique para ver o carrinho</div>
            
            {/* Seta do tooltip */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-black bg-opacity-80 rotate-45"></div>
          </div>
        )}
      </div>

      {/* Safe Area Spacer */}
      <div className="h-20" />
      
      {/* Efeitos de animação customizados */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }
      `}</style>
    </>
  );
};

export default Footer;