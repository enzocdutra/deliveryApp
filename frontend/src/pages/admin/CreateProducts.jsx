import React, { useState } from "react";
import { createProduto } from "../../services/Services";

export const CreateProducts = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "", // Mudei de "valor" para "preco"
    imagem: null, // Mudei de "foto" para "imagem"
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Converte a imagem para base64 (data URL)
      const base64 = await convertToBase64(file);
      setFormData({ ...formData, imagem: base64 });
    }
  };

  // Função para converter arquivo para base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Prepara os dados no formato que o backend espera
      const produtoData = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim(),
        preco: parseFloat(formData.preco), // Converte para número
        imagem: formData.imagem // Já está em base64
      };

      console.log('Dados enviados:', produtoData);

      const result = await createProduto(produtoData);
      setMessage(`✅ Produto "${result.nome}" cadastrado com sucesso!`);

      // Limpa o formulário
      setFormData({ nome: "", descricao: "", preco: "", imagem: null });
      
      // Limpa o input de arquivo
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

    } catch (err) {
      console.error("Erro detalhado:", err);
      
      if (err.response?.data) {
        // Mostra mensagem específica do servidor
        const errorData = err.response.data;
        if (errorData.error) {
          setMessage(`❌ ${errorData.error}`);
        } else {
          setMessage(`❌ Erro: ${JSON.stringify(errorData)}`);
        }
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block mb-1 font-medium">Preço (R$) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="preco" // Mudei para "preco"
            value={formData.preco}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-lg px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">A imagem será convertida para base64</p>
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