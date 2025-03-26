import React, { useState, useEffect } from 'react';
import Logo from '../assets/Logo.png';
import CoverImage from '../assets/Capa.jpg'; // substitua por sua imagem de capa

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const checkOpen = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = 19 * 60;
    const closeMinutes = 23 * 60 + 30;
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  };

  useEffect(() => {
    setIsOpen(checkOpen());
    const intervalId = setInterval(() => {
      setIsOpen(checkOpen());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header
      className="w-full h-[350px] bg-black bg- bg-cover  shadow-md"
      style={{ backgroundImage: `url(${CoverImage})` }}
    >
      <div className="w-full h-full flex justify-center items-center flex-col gap-2 bg-black/60">
        <img
          src={Logo}
          alt="Logo do projeto"
          className="p-2 w-36 h-36 object-cover rounded-full"
        />
        <h1 className="capitalize text-4xl font-semibold text-white">South burguer</h1>
        <span className="capitalize text-xl text-white font-medium">Rua 2024, Bagé</span>
        <div
          className={`px-4 py-2 rounded-lg mt-5 ${
            isOpen ? 'bg-green-700' : 'bg-red-500'
          }`}
          id="date-span"
        >
          <span className="capitalize text-white font-medium">
            seg à dom - 19:00 às 23:30 {isOpen ? '(Aberto)' : '(Fechado)'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
