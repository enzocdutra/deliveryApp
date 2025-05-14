import React, { useState, useEffect } from 'react';
import Logo from '../assets/Logo.png';
import CoverImage from '../assets/Capa.jpg'; // substitua por sua imagem de capa

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const checkOpen = () => {
    const now = new Date();
    const day = now.getDay(); // 0 (domingo) a 6 (sábado)
    const date = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    const openMinutes = 19 * 60; // 19:00
    const closeMinutes = 24 * 60; // 02:00

    // Terça-feira (folga)
    if (day === 2) return false;

    // Penúltimo final de semana do mês (sábado e domingo)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const penultimateWeekendStart = lastDay - 6;
    const penultimateWeekendEnd = lastDay - 5;
    if ((day === 6 && date === penultimateWeekendStart) || (day === 0 && date === penultimateWeekendEnd)) {
      return false;
    }

    // Como closeMinutes (02:00) é menor que openMinutes (19:00), o restaurante fica aberto de 19:00 até 23:59 e também de 00:00 até 02:00
    if (closeMinutes < openMinutes) {
      return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
    }

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
      className="w-full h-[450px] bg-cover shadow-md"
      style={{
        backgroundImage: `url(${CoverImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full h-full flex justify-center items-center flex-col gap-2 bg-black/60">
        <img
          src={Logo}
          alt="Logo do projeto"
          className="p-2 w-36 h-36 object-cover rounded-full"
        />
        <h1 className="capitalize text-4xl font-semibold text-white">La burguer</h1>
        <span className="capitalize text-xl text-white font-medium">
          Av. Presidente Vargas 24, Bagé
        </span>
        <div className="p-4">
          <div
            className={`px-4 py-2 rounded-lg mt-5 ${
              isOpen ? 'bg-green-700' : 'bg-red-500'
            }`}
            id="date-span"
          >
            <span className="capitalize text-white font-medium">
              Quarta a segunda - 19:00 às 00:00 (Terças e penúltimo fim de semana do mês: fechado){' '}
              {isOpen ? '(Aberto)' : '(Fechado)'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
