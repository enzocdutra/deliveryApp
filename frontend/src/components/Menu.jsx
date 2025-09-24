import React, { useState, useContext, useEffect, useCallback } from 'react';
import ProductItem from './ProductItem';
import ItemModal from './ItemModal';
import { CartContext } from '../Context/CartContext';
import { getProdutosByCategoria } from '../services/Services';

const categorias = [
  { nome: 'Combos', titulo: 'Combos', icone: '🍱' },
  { nome: 'Alaminuta', titulo: 'Alaminuta', icone: '🍱' },
  { nome: 'Normais', titulo: 'Normais', icone: '🍛' },
  { nome: 'Camarão', titulo: 'Camarão', icone: '🦐' },
  { nome: 'Duplos', titulo: 'Duplos', icone: '🥘' },
  { nome: 'Agridoce', titulo: 'Agridoces', icone: '🍖' },
  { nome: 'AgridoceGeleia', titulo: 'Agridoces com Geleia', icone: '🍯' },
  { nome: 'Doces', titulo: 'Doces', icone: '🍮' },
  { nome: 'Petiscos', titulo: 'Petiscos', icone: '🍟' },
  { nome: 'Bebidas', titulo: 'Bebidas', icone: '🥤' },
];

const Menu = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addItemToCart } = useContext(CartContext);
  const [produtos, setProdutos] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(new Set());
  const [error, setError] = useState(null);

  // Carregar categorias individualmente com fallback
  const carregarCategoria = useCallback(async (cat) => {
    try {
      setLoadingCategories(prev => new Set(prev).add(cat.nome));
      
      const data = await getProdutosByCategoria(cat.nome);
      
      const produtosFormatados = data.map((item) => ({
        id: item.id || item._id || Math.random().toString(36).substr(2, 9),
        nome: item.nome || item.name || item.title || "Produto sem nome",
        descricao: item.descricao || item.description || "",
        preco: item.preco || item.price || item.valor || 0,
        imagem: item.imagem || item.image || item.foto || item.img || "",
        categoria: item.categoria || item.category || cat.nome,
      }));

      setProdutos(prev => ({
        ...prev,
        [cat.nome]: produtosFormatados
      }));

    } catch (err) {
      console.error(`Erro ao carregar categoria ${cat.nome}:`, err);
      // Fallback: categoria vazia em caso de erro
      setProdutos(prev => ({
        ...prev,
        [cat.nome]: []
      }));
    } finally {
      setLoadingCategories(prev => {
        const newSet = new Set(prev);
        newSet.delete(cat.nome);
        return newSet;
      });
    }
  }, []);

  // Carregar categorias prioritárias primeiro
  useEffect(() => {
    const carregarProdutosOtimizado = async () => {
      setLoading(true);
      setError(null);

      try {
        // Carrega categorias prioritárias primeiro (Combos, Bebidas, Normais)
        const categoriasPrioritarias = categorias.filter(cat => 
          ['Combos', 'Bebidas', 'Normais'].includes(cat.nome)
        );

        // Carrega as prioritárias primeiro
        await Promise.all(categoriasPrioritarias.map(cat => carregarCategoria(cat)));

        // Depois carrega o restante em background
        const categoriasRestantes = categorias.filter(cat => 
          !['Combos', 'Bebidas', 'Normais'].includes(cat.nome)
        );

        categoriasRestantes.forEach(cat => carregarCategoria(cat));

      } catch (err) {
        console.error("Erro geral ao carregar produtos:", err);
        setError("Erro ao carregar o cardápio. Tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    };

    carregarProdutosOtimizado();
  }, [carregarCategoria]);

  const openModal = useCallback((product) => setSelectedProduct(product), []);
  const closeModal = useCallback(() => setSelectedProduct(null), []);

  const handleAddToCart = useCallback((itemData) => {
    addItemToCart(itemData);
    closeModal();
  }, [addItemToCart, closeModal]);

  // Skeleton Loading para melhor UX
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-8 bg-gray-400 rounded mt-3"></div>
      </div>
    </div>
  );

  const CategorySkeleton = () => (
    <section className="mb-8">
      <div className="h-8 bg-gray-300 rounded w-1/4 mb-4 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        {/* Banner de atenção */}
        <div className="p-4 text-center mb-6 bg-gradient-to-r from-red-800 to-red-600 shadow-lg">
          <p className="text-white text-2xl font-bold mb-2">⚠️ Atenção!</p>
          <span className="text-lg text-white font-medium">
            Não fazemos trocas de condimentos - consideramos como adicional!
          </span>
        </div>

        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-10">
            <div className="h-10 bg-gray-300 rounded w-1/4 mx-auto mb-4 animate-pulse"></div>
          </header>

          {[...Array(4)].map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center max-w-md mx-4">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro ao carregar</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="menu" className="bg-gray-100 min-h-screen ">
      {/* Banner de atenção */}
      <div className="p-4 text-center mb-6 bg-gradient-to-r from-red-800 to-red-600 shadow-lg">
        <p className="text-white text-2xl font-bold mb-2">⚠️ Atenção!</p>
        <span className="text-lg text-white font-medium">
          Não fazemos trocas de condimentos - consideramos como adicional!
        </span>
      </div>

      <div className="container mx-auto px-4 py-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold uppercase text-gray-900 mb-2 tracking-tight">
            Cardápio
          </h1>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
        </header>

        {categorias.map((cat) => {
          const isLoading = loadingCategories.has(cat.nome);
          const produtosCategoria = produtos[cat.nome] || [];
          const temProdutos = produtosCategoria.length > 0;

          return (
            <section key={cat.nome} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{cat.icone}</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{cat.titulo}</h2>
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : temProdutos ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {produtosCategoria.map((product) => (
                    <ProductItem 
                      key={product.id} 
                      product={product} 
                      onSelect={openModal} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-200">
                  <div className="text-6xl mb-4 opacity-50">{cat.icone}</div>
                  <p className="text-gray-500 text-lg font-medium">
                    {cat.nome === "Combos" 
                      ? "Combos em preparação - volte em breve!" 
                      : `Nenhum ${cat.titulo.toLowerCase()} disponível no momento`
                    }
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Estamos trabalhando para trazer novidades
                  </p>
                </div>
              )}
            </section>
          );
        })}

        {/* Modal */}
        {selectedProduct && (
          <ItemModal
            itemTitle={selectedProduct.nome}
            itemPrice={selectedProduct.preco}
            itemImage={selectedProduct.imagem}
            itemDescription={selectedProduct.descricao}
            itemCategory={selectedProduct.categoria}
            onClose={closeModal}
            onConfirm={handleAddToCart}
          />
        )}

        {/* Botão flutuante para voltar ao topo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 z-40 hover:scale-110"
          aria-label="Voltar ao topo"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* Footer com créditos - Centralizado e melhorado */}
      <div className="w-full flex justify-center py-6">
        <div className="animate-fade-in-up">
          <div className="group relative">
            <div className="
              bg-black/20 backdrop-blur-sm rounded-2xl px-6 py-4 
              border border-white/10 shadow-2xl
              transition-all duration-500
              hover:bg-black/30 hover:scale-105
              hover:shadow-green-500/20
            ">
              <p className="text-sm md:text-base text-white/80 font-light flex items-center">
                <span className="mr-2">✨</span>
                Desenvolvido por 
                <a 
                  href="https://landing-page-iota-six-63.vercel.app" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-green-300 hover:text-green-200 
                    font-medium transition-all duration-300
                    hover:scale-105 ml-2
                    relative
                  "
                >
                  Onez_053
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-green-300 group-hover:w-full transition-all duration-300"></span>
                </a>
              </p>
            </div>
            
            {/* Efeito de brilho pulsante */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Menu;