import React from "react";
import CoverImage from "../assets/Capa.jpg"; // substitua pela imagem certa

export default function Login() {
  return (
    <div className="w-full h-screen flex">
      {/* Lado esquerdo - banner */}
<div className="hidden md:flex w-2/2 relative">
  <img
    src={CoverImage}
    alt="Capa LaBurguer"
    className="absolute inset-0 w-full h-full object-cover"
  />
  {/* Filtro preto */}
  <div className="absolute inset-0 bg-black/60" />
</div>


      {/* Lado direito - form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#441704] to-[#b34b0a]">
        <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl w-11/12 max-w-md text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Login</h2>
          <p className="mb-6 text-sm opacity-80">
            Preencha os campos abaixo com seus dados de acesso.
          </p>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Digite o seu e-mail"
              className="w-full p-3 rounded-lg bg-white/20 focus:bg-white/30 outline-none placeholder-white"
            />
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full p-3 rounded-lg bg-white/20 focus:bg-white/30 outline-none placeholder-white"
            />
            <button
              type="submit"
              className="w-full bg-[#f9b426] text-black font-semibold py-3 rounded-lg hover:text-white hover:bg-[#f3920d] transition"
            >
              Acessar
            </button>
           
          </form>
        </div>
      </div>
    </div>
  );
}
