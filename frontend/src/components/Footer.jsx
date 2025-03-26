import React from 'react';
import { FaCartPlus } from 'react-icons/fa';

const Footer = ({ onCartClick, cartCount }) => (
  <footer className="w-full fixed bottom-0 z-40 flex items-center justify-center h-12 bg-green-700"    onClick={onCartClick}>
    <button
      className="hover:scale-110 transition ease-in-out delay-200 duration-200 text-white flex items-center"
   
    >
      (<span className="text-md font-extrabold text-white" id="cart-count">{cartCount}</span>)
      <span className="font-bold text-white text-sm ml-1">Ver meu carrinho</span>
      <FaCartPlus className="text-lg text-white ml-1" />
    </button>
  </footer>
);

export default Footer;
