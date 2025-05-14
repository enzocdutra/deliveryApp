import React from 'react';
import { FaCartPlus } from 'react-icons/fa';

const Footer = ({ onCartClick, cartCount }) => (
  <footer
    className="w-full fixed bottom-0 z-40 px-4 h-12 bg-transparent md:bg-green-700 flex text-center items-center justify-between"
    onClick={onCartClick}
  >
    {/* Mobile (apenas ícone redondo no canto direito com contador) */}
    <div className="md:hidden fixed bottom-4 right-4 z-50">
      <button className="relative bg-green-700 p-4 rounded-full shadow-lg text-white">
        <FaCartPlus className="text-2xl" />
        <span
          id="cart-count"
          className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {cartCount}
        </span>
      </button>
    </div>
    <button className="hidden w-full md:flex hover:scale-110 transition ease-in-out delay-200 duration-200 text-white text-center items-center">
      (<span className="text-md font-extrabold text-white" id="cart-count">{cartCount}</span>)
      <span className="font-bold text-white text-center text-sm ml-1">Ver meu carrinho</span>
      <FaCartPlus className="text-lg text-white ml-1" />
    </button>
    {/* Desktop (texto completo com carrinho) */}
    <div>

    </div>
  
  </footer>
);

export default Footer;
