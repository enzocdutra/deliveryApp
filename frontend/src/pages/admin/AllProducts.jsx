import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProdutos } from "../../services/Services"; // importa o service

export default function AllProducts() {
  const [produtos, setProdutos] = useState([]);

  // Buscar produtos no backend
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await getProdutos();
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Todos os Produtos</h2>
      <p className="mb-4 text-gray-600">Aqui você gerencia os produtos.</p>

      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto cadastrado.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nome</th>
              <th className="border p-2">Descrição</th>
              <th className="border p-2">Preço</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id} className="text-center">
                <td className="border p-2">{produto.nome}</td>
                <td className="border p-2">{produto.descricao}</td>
                <td className="border p-2">R$ {produto.preco}</td>
                <td className="border p-2 flex justify-center gap-2">
                  {/* Botão Editar */}
                  <Link
                    to={`/edit/${produto.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Editar
                  </Link>

                  {/* Botão Excluir */}
                  <Link
                    to={`/delete/${produto.id}`}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Excluir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
