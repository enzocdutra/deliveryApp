import React from 'react';
import Logo from '../assets/Logo.png';
import CoverImage from '../assets/Capa.jpg';

const Header = () => {
  return (
    <header
      className="w-full h-[450px] bg-cover bg-center bg-no-repeat shadow-lg relative"
      style={{ backgroundImage: `url(${CoverImage})` }}
    >
      {/* Overlay gradiente para melhor legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-4">
        {/* Logo */}
        <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
          <img
            src={Logo}
            alt="La Burguer"
            className="w-32 h-32 object-cover rounded-full border-4 border-white/20 shadow-2xl"
          />
        </div>

        {/* Título e endereço */}
        <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
          La Burguer
        </h1>
        <span className="text-xl text-gray-200 font-light mb-6">
          Av. Presidente Vargas 24, Bagé
        </span>


        {/* Horários de funcionamento estáticos */}
        <div className="mt-6 text-lg rounded-lg bg-white/60 p-4 ">
          <div className="text-white/90 ">
            <strong>Horários:</strong> 11:00h as 14:00h & 19h-00h 00:00h
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;