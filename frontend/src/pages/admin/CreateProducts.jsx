import React, { useState } from 'react';
import { createProduto } from '../../services/Services';
export const CreateProducts = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valor: "",
    categoria: "", // nova chave
    foto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result }); // converte para base64
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const novoProduto = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.valor), // no backend é preco
      categoria: formData.categoria,
      imagem: formData.foto,
    };

    const response = await createProduto(novoProduto);
    alert("Produto criado com sucesso!");
    console.log("Criado:", response);

    // limpa o form
    setFormData({
      nome: "",
      descricao: "",
      valor: "",
      categoria: "",
      foto: null,
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao criar produto.");
  }
};


  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Cadastrar Hambúrguer</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          name="nome"
          placeholder="Nome do Hambúrguer"
          value={formData.nome}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <textarea
          name="descricao"
          placeholder="Descrição"
          value={formData.descricao}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          name="valor"
          placeholder="Valor"
          value={formData.valor}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* Select de Categoria */}
<label className="block mb-2">Categoria</label>
<select
  name="categoria"
  value={formData.categoria}
  onChange={handleChange}
  className="w-full border rounded px-3 py-2 mb-3"
>
  <option value="">Selecione...</option>
  <option value="Combos">Combos</option>
  <option value="Normais">Normais</option>
  <option value="Camarão">Camarão</option>
  <option value="Duplos">Duplos</option>
  <option value="Agridoce">Agridoce</option>
  <option value="Agridoces com Geleia">Agridoces com Geleia</option>
  <option value="Doces">Doces</option>
  <option value="Petiscos">Petiscos</option>
  <option value="Bebidas">Bebidas</option>
</select>


        {/* Upload da foto */}
        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {formData.foto && (
          <img
            src={formData.foto}
            alt="Pré-visualização"
            className="w-32 h-32 object-cover rounded mx-auto"
          />
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Salvar
        </button>
      </form>
    </div>
  );
};
