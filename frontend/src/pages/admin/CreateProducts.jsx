import React, { useState } from 'react'

export const CreateProducts = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valor: "",
    foto: null
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto: e.target.files[0] })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 🔥 Aqui você pode enviar os dados para sua API
    const data = new FormData()
    data.append("nome", formData.nome)
    data.append("descricao", formData.descricao)
    data.append("valor", formData.valor)
    data.append("foto", formData.foto)

    fetch("http://localhost:5000/produtos", {
      method: "POST",
      body: data
    })
    .then(res => res.json())
    .then(result => {
      console.log("Produto salvo com sucesso:", result)
    })
    .catch(err => console.error("Erro:", err))
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrar Hambúrguer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block mb-1 font-medium">Nome do Hambúrguer</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descrição</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Salvar Hambúrguer
        </button>
      </form>
    </div>
  )
}
