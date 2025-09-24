import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { getProdutos, deleteProduto, updateProduto } from "../../services/Services";

export default function AllProducts() {
  const [produtos, setProdutos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState(null);
  const [produtoToEdit, setProdutoToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editFormData, setEditFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    imagem: null,
    categoria: ""
  });

  // Estados para paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Buscar produtos no backend
  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setIsLoading(true);
      const data = await getProdutos();
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoizar cálculos para melhor performance
  const { categorias, produtosFiltrados, currentProdutos, totalPages } = useMemo(() => {
    // Filtrar produtos por categoria
    const produtosFiltrados = selectedCategory 
      ? produtos.filter(produto => produto.categoria === selectedCategory)
      : produtos;

    // Extrair categorias únicas
    const categorias = [...new Set(produtos.map(produto => produto.categoria).filter(Boolean))];

    // Calcular paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProdutos = produtosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(produtosFiltrados.length / itemsPerPage);

    return { categorias, produtosFiltrados, currentProdutos, totalPages };
  }, [produtos, selectedCategory, currentPage, itemsPerPage]);

  // Resetar página quando mudar o filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Funções de paginação
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const goToPage = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleDeleteClick = useCallback((produto) => {
    setProdutoToDelete(produto);
    setShowDeleteModal(true);
  }, []);

  const handleEditClick = useCallback((produto) => {
    setProdutoToEdit(produto);
    setEditFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      imagem: produto.imagem,
      categoria: produto.categoria || ""
    });
    setShowEditModal(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (!produtoToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProduto(produtoToDelete.id);
      setShowDeleteModal(false);
      setProdutoToDelete(null);
      
      // Atualizar lista localmente sem recarregar tudo
      setProdutos(prev => prev.filter(p => p.id !== produtoToDelete.id));
      
      alert(`Produto "${produtoToDelete.nome}" excluído com sucesso!`);
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      alert("Erro ao excluir produto. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setProdutoToDelete(null);
  }, []);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Verificar tamanho do arquivo (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert("O arquivo é muito grande. Máximo permitido: 10MB");
          return;
        }

        const base64 = await convertToBase64(file);
        setEditFormData(prev => ({
          ...prev,
          imagem: base64
        }));
      } catch (error) {
        console.error("Erro ao converter imagem:", error);
        alert("Erro ao processar a imagem.");
      }
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleConfirmEdit = async () => {
    if (!produtoToEdit) return;

    setIsEditing(true);
    try {
      const updatedData = {
        ...editFormData,
        preco: parseFloat(editFormData.preco)
      };

      await updateProduto(produtoToEdit.id, updatedData);
      setShowEditModal(false);
      setProdutoToEdit(null);
      
      // Atualizar produto localmente sem recarregar tudo
      setProdutos(prev => prev.map(p => 
        p.id === produtoToEdit.id ? { ...p, ...updatedData } : p
      ));
      
      alert(`Produto "${editFormData.nome}" atualizado com sucesso!`);
    } catch (err) {
      console.error("Erro ao editar produto:", err);
      alert("Erro ao editar produto. Tente novamente.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = useCallback(() => {
    setShowEditModal(false);
    setProdutoToEdit(null);
  }, []);

  const handleCategoryFilter = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const clearFilter = useCallback(() => {
    setSelectedCategory("");
  }, []);

  // Gerar array de números de página para exibição
  const getPageNumbers = useCallback(() => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  }, [currentPage, totalPages]);

  // Componente de loading otimizado
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="animate-pulse bg-gray-200 rounded-xl h-20"></div>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Produtos</h2>
          <p className="text-gray-600 mt-2">Administre o cardápio do seu restaurante</p>
        </div>
        <Link
          to="/admin/products/create"
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Novo Produto
        </Link>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-gray-50 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
          
          <button
            onClick={clearFilter}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === "" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todos
          </button>
          
          {categorias.map(categoria => (
            <button
              key={categoria}
              onClick={() => handleCategoryFilter(categoria)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === categoria 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
        
        {selectedCategory && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <span>Filtro ativo:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
              {selectedCategory}
            </span>
            <button 
              onClick={clearFilter}
              className="text-red-600 hover:text-red-800 ml-2"
            >
              Limpar filtro
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : produtos.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum produto cadastrado</h3>
          <p className="text-gray-500 mb-6">Comece adicionando seu primeiro produto ao cardápio</p>
          <Link
            to="/admin/products/create"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            Criar Primeiro Produto
          </Link>
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-500 mb-6">
            {selectedCategory 
              ? `Nenhum produto na categoria "${selectedCategory}"` 
              : "Nenhum produto corresponde aos critérios de busca"}
          </p>
          <button
            onClick={clearFilter}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Ver Todos os Produtos
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Imagem
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {currentProdutos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        {produto.imagem ? (
                          <div className="relative group">
                            <img
                              src={produto.imagem}
                              alt={produto.nome}
                              loading="lazy"
                              className="w-16 h-16 rounded-lg object-cover shadow-sm border border-gray-200 group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 hidden">
                              <span className="text-gray-400 text-xs">Erro</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{produto.nome}</h3>
                        <p className="text-xs text-gray-500 mt-1">ID: {produto.id}</p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                        {produto.descricao}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {produto.categoria || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(produto)}
                          className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-100 hover:border-blue-200"
                          title="Editar produto"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>

                        <button
                          onClick={() => handleDeleteClick(produto)}
                          className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-100 hover:border-red-200"
                          title="Excluir produto"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer da tabela com paginação melhorada */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                Mostrando {currentProdutos.length} de {produtosFiltrados.length} produto(s)
                {selectedCategory && ` na categoria "${selectedCategory}"`}
                {totalPages > 1 && ` - Página ${currentPage} de ${totalPages}`}
              </p>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded border border-gray-200 hover:border-gray-300"
                  >
                    Anterior
                  </button>
                  
                  <div className="flex gap-1">
                    {getPageNumbers().map(page => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 text-sm rounded border transition-colors ${
                          currentPage === page 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded border border-gray-200 hover:border-gray-300"
                  >
                    Próximo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modais (mantidos com otimizações) */}
      {showDeleteModal && (
        <DeleteModal 
          produtoToDelete={produtoToDelete}
          isDeleting={isDeleting}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showEditModal && (
        <EditModal
          editFormData={editFormData}
          isEditing={isEditing}
          onCancel={handleCancelEdit}
          onConfirm={handleConfirmEdit}
          onEditChange={handleEditChange}
          onFileChange={handleFileChange}
        />
      )}
    </div>
  );
}

// Componentes modais separados para melhor performance
const DeleteModal = React.memo(({ produtoToDelete, isDeleting, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Confirmar Exclusão</h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Tem certeza que deseja excluir o produto <strong className="text-red-600">"{produtoToDelete?.nome}"</strong>? 
          Esta ação não pode ser desfeita.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 font-medium"
          >
            Cancelar
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 font-medium flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Excluindo...
              </>
            ) : (
              "Sim, Excluir"
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
));

const EditModal = React.memo(({ editFormData, isEditing, onCancel, onConfirm, onEditChange, onFileChange }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Editar Produto</h3>
        <p className="text-gray-600">Atualize as informações do produto</p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Produto *</label>
            <input
              type="text"
              name="nome"
              value={editFormData.nome}
              onChange={onEditChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Preço (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              name="preco"
              value={editFormData.preco}
              onChange={onEditChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição *</label>
          <textarea
            name="descricao"
            value={editFormData.descricao}
            onChange={onEditChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria *</label>
          <select
            name="categoria"
            value={editFormData.categoria}
            onChange={onEditChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Selecione uma categoria</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Lanches">Lanches</option>
            <option value="Sobremesas">Sobremesas</option>
            <option value="Combos">Combos</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Imagem</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors duration-200">
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-600">Clique para selecionar uma imagem</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF até 10MB</p>
            </label>
          </div>
          {editFormData.imagem && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
              <img
                src={editFormData.imagem}
                alt="Preview"
                loading="lazy"
                className="w-48 h-48 object-cover rounded-xl shadow-sm border border-gray-200 mx-auto"
              />
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isEditing}
            className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 font-medium"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isEditing}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 font-medium flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
));