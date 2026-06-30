import React from 'react';
import { Clock, ShoppingCart } from 'lucide-react';

const ProductItem = ({ product, onSelect, storeOpen = true }) => {
  const formatarPreco = (preco) => {
    try {
      const numero = typeof preco === 'number' ? preco : parseFloat(preco);

      if (Number.isNaN(numero)) {
        return '0,00';
      }

      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numero);
    } catch (error) {
      console.error('Erro ao formatar preço:', error);
      return '0,00';
    }
  };

  const precoFormatado = formatarPreco(product.preco);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 ${
        storeOpen
          ? 'border-stone-200 hover:-translate-y-1 hover:shadow-xl'
          : 'border-stone-200 opacity-75'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <img
          src={product.imagem}
          alt={product.nome}
          className={`h-full w-full object-cover transition duration-500 ${
            storeOpen ? 'group-hover:scale-105' : 'grayscale-[25%]'
          }`}
          onError={(e) => {
            e.target.src = '/imagens/padrao.jpg';
          }}
        />
        {!storeOpen && (
          <div className="absolute inset-x-3 top-3 flex items-center gap-2 rounded-full bg-stone-950/85 px-3 py-2 text-xs font-bold text-amber-200 backdrop-blur">
            <Clock size={14} />
            Fora do horário de pedidos
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex-1">
          <h3 className="text-lg font-black leading-tight text-stone-950 sm:text-xl">{product.nome}</h3>
          {product.descricao && (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">{product.descricao}</p>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-stone-400">Preço</span>
            <p className="text-2xl font-black text-red-600">R$ {precoFormatado}</p>
          </div>

          <button
            type="button"
            onClick={() => onSelect(product)}
            disabled={!storeOpen}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-black transition ${
              storeOpen
                ? 'bg-amber-400 text-stone-950 shadow-md hover:bg-amber-300 active:scale-95'
                : 'cursor-not-allowed bg-stone-200 text-stone-500'
            }`}
          >
            <ShoppingCart size={17} />
            {storeOpen ? 'Adicionar' : 'Fora do horário'}
          </button>
        </div>

        {!storeOpen && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
            Disponível a partir das 19h.
          </p>
        )}
      </div>
    </article>
  );
};

export default ProductItem;
