import React from 'react';
import { Clock, MapPin, ShoppingBag, Utensils } from 'lucide-react';
import Logo from '../assets/Logo.png';
import CoverImage from '../assets/Capa.jpg';
import { STORE_HOURS } from '../lib/store-hours';

const Header = ({ storeOpen = false, statusMessage = '' }) => {
  const handleMenuClick = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className="relative min-h-[520px] w-full overflow-hidden bg-stone-950 bg-cover bg-center bg-no-repeat shadow-2xl sm:min-h-[580px]"
      style={{ backgroundImage: `url(${CoverImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-stone-950" />

      <div className="relative z-10 mx-auto flex min-h-[520px] w-full max-w-6xl flex-col justify-between px-4 py-5 sm:min-h-[580px] sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="La Burguer"
              className="h-14 w-14 rounded-full border-2 border-amber-300/70 object-cover shadow-xl sm:h-16 sm:w-16"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Cardápio online</p>
              <h1 className="text-2xl font-black text-white sm:text-3xl">La Burguer</h1>
            </div>
          </div>

          <div className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-lg sm:flex ${
            storeOpen ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'
          }`}>
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
            {storeOpen ? 'Aberto agora' : 'Fechado'}
          </div>
        </div>

        <div className="max-w-3xl pb-10 pt-20 text-left sm:pt-28">
          <div className={`mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-lg sm:hidden ${
            storeOpen ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'
          }`}>
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
            {storeOpen ? 'Aberto agora' : 'Fechado no momento'}
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-black uppercase tracking-wide text-stone-950 shadow-xl">
            <Utensils size={16} />
            Artesanal, rápido e feito no capricho
          </div>

          <h2 className="max-w-2xl text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            Seu hambúrguer favorito, direto no seu pedido.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-stone-100 sm:text-lg">
            Peça pelo cardápio online e finalize pelo WhatsApp. Pedidos disponíveis das {STORE_HOURS.label}.
          </p>

          <div className="mt-7 grid gap-3 text-sm text-white sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <Clock size={18} className="text-amber-300" />
              <span>{statusMessage || `Pedidos das ${STORE_HOURS.label}`}</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <MapPin size={18} className="text-amber-300" />
              <span>Av. Presidente Vargas 24, Bagé</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMenuClick}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-base font-black text-white shadow-xl shadow-red-950/40 transition hover:bg-red-700 active:scale-95"
          >
            <ShoppingBag size={20} />
            Ver cardápio
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
