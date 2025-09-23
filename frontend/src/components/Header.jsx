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

    // Terça-feira (folga)
    if (day === 2) return false;

    // Penúltimo final de semana do mês (sábado e domingo)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const penultimateWeekendStart = lastDay - 6;
    const penultimateWeekendEnd = lastDay - 5;
    if ((day === 6 && date === penultimateWeekendStart) || (day === 0 && date === penultimateWeekendEnd)) {
      return false;
    }

    // Horários fixos: 12h00 - 14h00 e 19h00 - 00h00
    const lunchStart = 12 * 60;
    const lunchEnd = 14 * 60;
    const dinnerStart = 19 * 60;
    const dinnerEnd = 24 * 60; // até meia-noite

    return (
      (currentMinutes >= lunchStart && currentMinutes < lunchEnd) ||
      (currentMinutes >= dinnerStart && currentMinutes < dinnerEnd)
    );
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
            className={`px-6 py-3 rounded-lg mt-5 text-xl font-bold ${
              isOpen ? 'bg-green-700 text-white' : 'bg-red-500 text-white'
            }`}
            id="date-span"
          >
            {isOpen ? 'Aberto' : 'Fechado'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
