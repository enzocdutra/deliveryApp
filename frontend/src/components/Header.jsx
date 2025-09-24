import React, { useState, useEffect, useMemo } from 'react';
import Logo from '../assets/Logo.png';
import CoverImage from '../assets/Capa.jpg';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Configuração dos horários em um objeto para fácil manutenção
  const scheduleConfig = useMemo(() => ({
    closedDays: {
      tuesday: true, // Terça-feira fechado
      penultimateWeekend: true // Penúltimo final de semana fechado
    },
    openingHours: [
      { start: 12 * 60, end: 14 * 60 }, // Almoço: 12h-14h
      { start: 19 * 60, end: 24 * 60 }  // Jantar: 19h-00h
    ]
  }), []);

  // Função para calcular o penúltimo final de semana do mês
  const getPenultimateWeekend = useMemo(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return {
      saturday: lastDay - 6,
      sunday: lastDay - 5
    };
  }, [currentTime.getMonth()]);

  // Função principal para verificar se está aberto
  const checkOpen = useMemo(() => {
    const now = currentTime;
    const day = now.getDay();
    const date = now.getDate();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Verificar dias fechados
    if (scheduleConfig.closedDays.tuesday && day === 2) return false;
    
    if (scheduleConfig.closedDays.penultimateWeekend) {
      const isPenultimateSaturday = (day === 6 && date === getPenultimateWeekend.saturday);
      const isPenultimateSunday = (day === 0 && date === getPenultimateWeekend.sunday);
      if (isPenultimateSaturday || isPenultimateSunday) return false;
    }

    // Verificar horários de funcionamento
    return scheduleConfig.openingHours.some(({ start, end }) => 
      currentMinutes >= start && currentMinutes < end
    );
  }, [currentTime, scheduleConfig, getPenultimateWeekend]);

  // Atualizar estado e hora atual
  useEffect(() => {
    setIsOpen(checkOpen);
  }, [checkOpen]);

  // Atualizar o tempo a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Formatar horário atual para exibição
  const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Próximo horário de abertura
  const getNextOpening = () => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const day = now.getDay();
    
    // Se estiver fechado, encontrar próximo horário
    const nextOpening = scheduleConfig.openingHours.find(({ start }) => start > currentMinutes);
    
    if (nextOpening) {
      return `Abre às ${Math.floor(nextOpening.start / 60)}h${nextOpening.start % 60 === 0 ? '00' : nextOpening.start % 60}`;
    } else {
      return "Abre amanhã às 12h00";
    }
  };

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

        {/* Status de abertura */}
        <div className="  rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="text-white/80 text-lg font-medium">
              {formattedTime} • {currentTime.toLocaleDateString('pt-BR')}
            </div>
            
            <div className={`px-8 py-4 rounded-xl text-md font-bold transition-all duration-500 ${
              isOpen 
                ? ' text-white ' 
                : ' text-white '
            }`}>
              {isOpen ? '🟢 Aberto Agora' : '🔴 Fechado'}
            </div>

            {!isOpen && (
              <div className="text-white/90 text-sm font-medium bg-black/30 px-4 py-2 rounded-lg">
                ⏰ {getNextOpening()}
              </div>
            )}

            {isOpen && (
              <div className="text-green-200 text-sm font-medium">
                🕒 Fecha às 00h00 • Entrega disponível
              </div>
            )}
          </div>
        </div>

        {/* Horários de funcionamento */}
        {/* <div className="mt-6 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="text-white/80 text-sm">
            <strong>Horários:</strong> Ter-Sex 12h-14h • 19h-00h | Sáb-Dom 19h-00h
          </div>
        </div> */}
      </div>
    </header>
  );
};

export default Header;