import React, { useState, useContext } from 'react';
import ProductItem from './ProductItem';
import ItemModal from './ItemModal';
import { CartContext } from '../Context/CartContext';
import Cheese from '../assets/cheese.jpg'
import Catupiry from '../assets/catupiry.jpg'
import Doritos from '../assets/Doritos.jpg'
import Tradicional from '../assets/Tradicional.jpg'
import Barbecue from '../assets/barbcue.jpg'
import Bacon from '../assets/bacon.jpg'
import Chicken from '../assets/DuploChicken.jpg'
import Kids from '../assets/kids.jpg'
import Mexicano from '../assets/mexicano.jpg'
import Onion from '../assets/DuploOnion.jpg'
import Qqueijos from '../assets/Duplo4queijos.jpg'
import American from '../assets/american.jpg'
const Normais = [
  {
    id: 1,
    title: 'CHEESE',
    description:
      'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, queijo cheddar e maionese caseira.',
    price: '20,90',
    imageSrc:Cheese,
  },
  {
    id: 2,
    title: 'CATUPIRY',
    description:
      'Pão de brioche, bife de carne bovina artesanal, catupiry, mussarela, bacon e maionese caseira.',
    price: '25,00',
    imageSrc:Catupiry,
  },
  {
    id: 3,
    title: 'DORITOS',
    description:
      'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, doritos, bacon e maionese caseira.',
    price: '26,00',
    imageSrc:Doritos,
  },
  {
    id: 4,
    title: 'TRADICIONAL ',
    description:
      'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, mussarela, tomate, bacon, alface e maionese caseira.',
    price: '26,00',
    imageSrc:Tradicional,
  },
  {
    id: 5,
    title: 'BARBECUE',
    description:
      'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, cebola roxa caramelizada, barbecue defumado e maionese caseira.',
    price: '23,00',
    imageSrc:Barbecue,
  },
  {
    id: 6,
    title: 'BACON',
    description:
      'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, tomate, cebola roxa crua, bacon, alface e maionese caseira',
    price: '28,00',
    imageSrc:Bacon,
  },
  {
    id: 7,
    title: 'Chicken',
    description:
      'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, tomate, cebola roxa crua, bacon, alface e maionese caseira',
    price: '28,00',
    imageSrc:Chicken,
  },
  {
    id: 8,
    title: 'CHICKEN CARAMELIZADO',
    description:
      'Pão de brioche, bife de frango artesanal, cheddar cremoso, cebola roxa caramelizada, barbecue, bacon e maionese caseira.',
    price: '23,00',
    imageSrc:Chicken,
  },
  {
    id: 9,
    title: 'KIDS',
    description:
      'Pão de brioche, bife de carne bovina artesanal, mussarela e maionese caseira.',
    price: '18,00',
    imageSrc:Kids,
  },
  {
    id: 10,
    title: 'MEXICANO',
    description:
      'Pão de brioche, bife de carne bovina artesanal, catupiry, mussarela, picles, tomate, cebola roxa crua, pimenta, pimentões coloridos, rúcula, ketchup e maionese caseira.',
    price: '26,00',
    imageSrc:Mexicano,
  },
  {
    id: 11,
    title: 'Onion',
    description:
      'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, anéis de cebola frito e maionese caseira.',
    price: '24,00',
    imageSrc:Onion,
  },
  {
    id: 12,
    title: '4 Queijos',
    description:
      'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, anéis de cebola frito e maionese caseira.',
    price: '24,00',
    imageSrc:Qqueijos,
  },
  {
    id: 13,
    title: 'AMERICAN',
    description:
      'Pão de brioche, bife de carne bovina artesanal, catupiry, mussarela, picles, cebola roxa crua e maionese caseira.',
    price: '21,00',
    imageSrc:American,
  },

  // Outros produtos podem ser adicionados aqui...
];

const Menu = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addItemToCart } = useContext(CartContext);

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div id="menu" className="py-4  h-screen">
      <div className="text-start p-4 text-2xl font-medium uppercase mb-4">
        <h1>Hambúrgueres</h1>
      </div>
      <div className="text-center text-[#303030] p-4 text-2xl font-medium uppercase mb-4">
        <h1>Normais</h1>
      </div>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {Normais.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onSelect={openModal}
          />
        ))}
      </main>
         <div className="w-full text-center text-[#303030] p-4 text-2xl font-medium uppercase mb-4">
        <h1>Duplos</h1>
      </div>

      {selectedProduct && (
        <ItemModal
          itemTitle={selectedProduct.title}
          itemPrice={selectedProduct.price}
          itemImage={selectedProduct.imageSrc}
          itemDescription={selectedProduct.description}
          onClose={closeModal}
          onConfirm={(itemData) => {
            console.log("Item adicionado:", itemData); // Debug
            addItemToCart(itemData);
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default Menu;
