// ProductItem.js
import React from 'react';

const ProductItem = ({ product, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
      onClick={() => onSelect(product)}
    >
      <img 
        src={product.imagem} 
        alt={product.nome}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = '/caminho/para/imagem/padrao.jpg'; // Imagem padrão caso a do produto não carregue
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{product.nome}</h3>
        <p className="text-gray-600 mt-2 line-clamp-2">{product.descricao}</p>
        <p className="text-red-600 font-bold mt-2">R$ {product.preco.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductItem;