import React, { useState } from "react";
import { createProduto } from "../../services/Services";

export const CreateProducts = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valor: "",
    foto: null,
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("nome", formData.nome.trim());
      data.append("descricao", formData.descricao.trim());
      
      // Converte o valor para número
      const valorNumerico = parseFloat(formData.valor);
      if (isNaN(valorNumerico)) {
        throw new Error("Valor inválido");
      }
      data.append("valor", valorNumerico.toString()); // Ou apenas valorNumerico dependendo do servidor
      
      if (formData.foto) {
        data.append("foto", formData.foto);
      }

      const result = await createProduto(data);
      setMessage(`✅ Produto "${result.nome}" cadastrado com sucesso!`);

      // Limpa o formulário
      setFormData({ nome: "", descricao: "", valor: "", foto: null });
      
      // Limpa o input de arquivo
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

    } catch (err) {
      console.error("Erro detalhado:", err);
      
      if (err.response?.data) {
        // Mostra mensagem específica do servidor se disponível
        setMessage(`❌ Erro: ${JSON.stringify(err.response.data)}`);
      } else if (err.message) {
        setMessage(`❌ ${err.message}`);
      } else {
        setMessage("❌ Erro ao salvar produto. Verifique os dados.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrar Hambúrguer</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block mb-1 font-medium">Nome do Hambúrguer *</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            minLength={2}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descrição *</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            minLength={10}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Valor (R$) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Salvando..." : "Salvar Hambúrguer"}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center p-3 rounded-lg ${
          message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};