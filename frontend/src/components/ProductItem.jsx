import React from 'react';
import PropTypes from 'prop-types';

const ProductItem = ({ product, onSelect }) => {
  return (
    <div
      className=" flex p-4 rounded-md shadow duration-200  cursor-pointer"
      onClick={() => onSelect(product)}
    >
      <img
        src={product.imageSrc}
        alt={product.title}
        className="w-[130px] h-40 object-cover rounded mb-2"
      />
      <div className='flex flex-col p-4'>
      <h3 className="text-lg font-bold">{product.title}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="mt-2 font-semibold">R$ {product.price}</p>
      </div>
  
    </div>
  );
};

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ProductItem;
