import React, { useState, useContext, useEffect } from 'react';
import ProductItem from './ProductItem';
import ItemModal from './ItemModal';
import { CartContext } from '../Context/CartContext';
import { getProdutosByCategoria } from '../services/Services';

const categorias = [
  { nome: 'Combos', titulo: 'Combos' },
  { nome: 'Normais', titulo: 'Normais' },
  { nome: 'Camarão', titulo: 'Camarão' },
  { nome: 'Duplos', titulo: 'Duplos' },
  { nome: 'Agridoce', titulo: 'Agridoces' },
  { nome: 'AgridoceGeleia', titulo: 'Agridoces com Geleia' },
  { nome: 'Doces', titulo: 'Doces' },
  { nome: 'Petiscos', titulo: 'Petiscos' },
  { nome: 'Bebidas', titulo: 'Bebidas' },
];

const Menu = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addItemToCart } = useContext(CartContext);
  const [produtos, setProdutos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const results = {};
        for (let cat of categorias) {
          const data = await getProdutosByCategoria(cat.nome);
          
          // Mapear os dados para garantir a estrutura correta
          results[cat.nome] = data.map(item => ({
            id: item.id || item._id || Math.random().toString(36).substr(2, 9),
            nome: item.nome || item.name || item.title || "Produto sem nome",
            descricao: item.descricao || item.description || "",
            preco: item.preco || item.price || item.valor || 0,
            imagem: item.imagem || item.image || item.foto || item.img || "",
            categoria: item.categoria || item.category || cat.nome
          }));
        }
        setProdutos(results);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    };
    carregarProdutos();
  }, []);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Carregando cardápio...</p>
      </div>
    );
  }

  return (
    <div id="menu" className="bg-gray-100 min-h-screen">
      <div className="p-4 text-center mb-10 bg-black">
        <p className="text-red-600 text-3xl text-center"><strong>Atenção!</strong></p>
        <span className="text-xl text-center text-white">
          não fizemos trocas de um condimento por outro, entra como adicional!
        </span>
      </div>

      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold uppercase text-gray-800">Cardápio</h1>
        </header>

     {categorias.map((cat) => (
  <section key={cat.nome} className="mb-8">
    <h2 className="text-2xl font-semibold text-black mb-4">{cat.titulo}</h2>

    {produtos[cat.nome] && produtos[cat.nome].length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos[cat.nome].map((product) => (
          <ProductItem 
            key={product.id} 
            product={product} 
            onSelect={openModal} 
          />
        ))}
      </div>
    ) : (
      cat.nome === "Combos" && (
        <p className="text-gray-500 text-center italic">
          Não há combos disponíveis hoje .
        </p>
      )
    )}
  </section>
))}


        {selectedProduct && (
          <ItemModal
            itemTitle={selectedProduct.nome}
            itemPrice={selectedProduct.preco}
            itemImage={selectedProduct.imagem}
            itemDescription={selectedProduct.descricao}
            itemCategory={selectedProduct.categoria}
            onClose={closeModal}
            onConfirm={(itemData) => {
              addItemToCart(itemData);
              closeModal();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Menu;