import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export const DeleteProducts = () => {
  const { id } = useParams() // pega o ID do produto pela URL
  const navigate = useNavigate()
  const [produto, setProduto] = useState(null)

  // Carrega o produto pelo ID
  useEffect(() => {
    fetch(`http://localhost:5000/produtos/${id}`)
      .then(res => res.json())
      .then(data => setProduto(data))
      .catch(err => console.error("Erro ao carregar produto:", err))
  }, [id])

  const handleDelete = () => {
    fetch(`http://localhost:5000/produtos/${id}`, {
      method: "DELETE",
    })
      .then(res => {
        if (res.ok) {
          alert("Produto excluído com sucesso!")
          navigate("/produtos") // redireciona para a lista de produtos
        } else {
          alert("Erro ao excluir produto")
        }
      })
      .catch(err => console.error("Erro ao excluir:", err))
  }

  if (!produto) return <p>Carregando produto...</p>

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-600">Excluir Hambúrguer</h2>
      
      <p className="mb-4 text-center">
        Tem certeza que deseja excluir o produto <strong>{produto.nome}</strong>?
      </p>

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/produtos")}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
        >
          Cancelar
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Confirmar Exclusão
        </button>
      </div>
    </div>
  )
}
