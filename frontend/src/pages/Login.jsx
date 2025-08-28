import { useState } from "react";
import CoverImage from "../assets/Capa.jpg";
import { loginUser } from "../services/Services";

export default function Login() {
  const [username, setUsername] = useState(""); // troquei de email -> username (pra bater com o backend)
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);

      // salva token no localStorage para manter login
      localStorage.setItem("token", data.token);

      setMessage(`✅ Bem-vindo, ${username}!`);
      setUsername("");
      setPassword("");

      // redirecionar depois de logar (ex: dashboard ou home)
      // window.location.href = "/dashboard";
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Falha ao fazer login");
    }
  };

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
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Digite o seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white/20 focus:bg-white/30 outline-none placeholder-white"
            />
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white/20 focus:bg-white/30 outline-none placeholder-white"
            />
            <button
              type="submit"
              className="w-full bg-[#f9b426] text-black font-semibold py-3 rounded-lg hover:text-white hover:bg-[#f3920d] transition"
            >
              Acessar
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.startsWith("✅") ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
