import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const EditProducts = () => {
  const { id } = useParams() // pega o ID do produto pela URL
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valor: "",
    foto: null
  })

  // Carrega dados do produto para edição
  useEffect(() => {
    fetch(`http://localhost:5000/produtos/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          nome: data.nome,
          descricao: data.descricao,
          valor: data.valor,
          foto: null // não carregamos a foto diretamente
        })
      })
      .catch(err => console.error("Erro ao buscar produto:", err))
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto: e.target.files[0] })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append("nome", formData.nome)
    data.append("descricao", formData.descricao)
    data.append("valor", formData.valor)
    if (formData.foto) {
      data.append("foto", formData.foto) // só envia nova foto se o usuário trocar
    }

    fetch(`http://localhost:5000/produtos/${id}`, {
      method: "PUT", // ou PATCH
      body: data
    })
      .then(res => res.json())
      .then(result => {
        console.log("Produto atualizado com sucesso:", result)
      })
      .catch(err => console.error("Erro ao atualizar produto:", err))
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Hambúrguer</h2>
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
          <label className="block mb-1 font-medium">Trocar Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Atualizar Produto
        </button>
      </form>
    </div>
  )
}
