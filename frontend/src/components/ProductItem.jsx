// ProductItem.jsx
import React from 'react';

const ProductItem = ({ product, onSelect }) => {
  // Formatação mais robusta usando Intl.NumberFormat
  const formatarPreco = (preco) => {
    try {
      const numero = typeof preco === 'number' ? preco : parseFloat(preco);
      
      if (isNaN(numero)) {
        return '0,00';
      }
      
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numero);
    } catch (error) {
      console.error('Erro ao formatar preço:', error);
      return '0,00';
    }
  };

  const precoFormatado = formatarPreco(product.preco);

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
          e.target.src = '/imagens/padrao.jpg';
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{product.nome}</h3>
        <p className="text-gray-600 mt-2 line-clamp-2">{product.descricao}</p>
        <p className="text-red-600 font-bold mt-2">R$ {precoFormatado}</p>
      </div>
    </div>
  );
};

export default ProductItem;