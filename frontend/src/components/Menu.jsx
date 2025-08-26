import React, { useState, useContext } from 'react';
import ProductItem from './ProductItem';
import ItemModal from './ItemModal';
import { CartContext } from '../Context/CartContext';
// Imports dos produtos (imagens)
import Cheese from '../assets/cheese.jpg';
import Catupiry from '../assets/catupiry.jpg';
import Doritos from '../assets/Doritos.jpg';
import Tradicional from '../assets/Tradicional.jpg';
import Barbecue from '../assets/barbcue.jpg';
import Bacon from '../assets/bacon.jpg';
import Chicken from '../assets/Chicken.jpg';
import ChickenCaramel from '../assets/chickenCaramelizado.jpg';
import Kids from '../assets/kids.jpg';
import Mexicano from '../assets/mexicano.jpg';
import Onion from '../assets/Onion.jpg';
import Qqueijos from '../assets/4queijos.jpg';
import American from '../assets/american.jpg';
// Duplos
import Dbarbecue from '../assets/DuploBarbecue.jpg';
import Dchicken from '../assets/Dchicken.jpg';
import DchickenC from '../assets/DchickenC.jpg';
import Dbacon from '../assets/DuploBacon.jpg';
import Dcatupiry from '../assets/DuploCatupiry.jpg';
import Dcheese from '../assets/DuploCheese.jpg';
import Donion from '../assets/DuploOnion.jpg';
import D4Queijos from '../assets/Duplo4queijos.jpg';
// Agridoces
import Hawai from '../assets/Hawai.jpg';
import Calif from '../assets/california.jpg';
import Tropical from '../assets/Logo.png';
import Peach from '../assets/peach.jpg';
import Rej from '../assets/ReJ.jpg'
// Agridoces geleia
import SweetChilli from '../assets/sweetChilli.jpg';
import SweetAbacaxi from '../assets/abacaxi.jpg';
import MorangoChilli from '../assets/Morando.png';
import MaracujaChilli from '../assets/MaracujaChilli.jpg';
// Doces
import Banoffe from '../assets/Banoffe.jpg';
import Nutella from '../assets/Nutella.jpg';
import Parrilero from '../assets/Parrilero.jpg';

const Normais = [
  { id: 1, title: 'CHEESE', description: 'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, queijo cheddar e maionese caseira.', price: '23,00', imageSrc: Cheese },
  { id: 2, title: 'CATUPIRY', description: 'Pão de brioche, bife de carne bovina artesanal, catupiry, mussarela, bacon e maionese caseira.', price: '28,00', imageSrc: Catupiry },
  { id: 3, title: 'DORITOS', description: 'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, doritos, bacon e maionese caseira.', price: '29,00', imageSrc: Doritos },
  { id: 4, title: 'TRADICIONAL', description: 'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, mussarela, tomate, bacon, alface e maionese caseira.', price: '29,00', imageSrc: Tradicional },
  { id: 5, title: 'BARBECUE', description: 'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, cebola roxa caramelizada, barbecue defumado e maionese caseira.', price: '26,00', imageSrc: Barbecue },
  { id: 6, title: 'BACON', description: 'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, tomate, cebola roxa crua, bacon, alface, ketchup e maionese caseira.', price: '30,00', imageSrc: Bacon },
  { id: 7, title: 'Chicken', description: 'Pão de brioche, bife de frango artesanal, catupiry, mussarela, bacon e maionese caseira.', price: '28,00', imageSrc: Chicken },
  { id: 8, title: 'CHICKEN CARAMELIZADO', description: 'Pão de brioche, bife de frango artesanal, cheddar cremoso, cebola roxa caramelizada, barbecue, bacon e maionese caseira.', price: '26,00', imageSrc: ChickenCaramel },
  { id: 9, title: 'KIDS', description: 'Pão de brioche, bife de carne bovina artesanal, mussarela e maionese caseira.', price: '21,00', imageSrc: Kids },
  { id: 10, title: 'MEXICANO', description: 'Pão de brioche, bife de carne bovina artesanal, catupiry, mussarela, picles, tomate, cebola roxa crua, pimenta, pimentões coloridos, rúcula, ketchup e maionese caseira.', price: '29,00', imageSrc: Mexicano },
  { id: 11, title: 'Onion', description: 'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, anéis de cebola frito e maionese caseira.', price: '27,00', imageSrc: Onion },
  { id: 12, title: '4 Queijos', description: 'Pão de brioche, bife bovino artesanal, catupiry, queijo mussarela, queijo cheddar, queijo provolone e maionese caseira', price: '28,00', imageSrc: Qqueijos },
  { id: 13, title: 'AMERICAN', description: 'Pão de brioche, bife de carne bovina artesanal, catupiry, mussarela, picles, cebola roxa crua e maionese caseira.', price: '24,00', imageSrc: American },
  { id: 15, title: 'ITALIAN', description: 'Pão de brioche, bife bovino artesanal, Mussarela, molho pesto, tomate seco, bacon, rúcula, catupiry e maionese caseira.', price: '36,00', imageSrc: Tropical },
];

const Duplos = [
  { id: 1, title: 'DUPLO BARBECUE', description: 'Pão de brioche, 2 bifes de carne bovina artesanal, duplo cheddar cremoso, dupla cebola roxa caramelizada,  duplo barbecue e maionese caseira.', price: '31,00', imageSrc: Dbarbecue },
  { id: 2, title: 'DUPLO BACON', description: 'Pão de brioche, 2 bifes de carne bovina artesanal, duplo cheddar cremoso, dupla cebola roxa crua, duplo tomate, duplo bacon, alface, ketchup e maionese caseira.', price: '36,00', imageSrc: Dbacon },
  { id: 3, title: 'DUPLO CATUPIRY', description: 'Pão de brioche, 2 bifes de carne bovina artesanal, duplo catupiry, dupla mussarela, duplo bacon e maionese caseira.', price: '35,00', imageSrc: Dcatupiry },
  { id: 4, title: 'DUPLO CHICKEN', description: 'Pão de brioche, 2 bifes de frango artesanal, duplo catupiry, dupla mussarela, duplo bacon e maionese caseira.', price: '35,00', imageSrc: Dchicken },
  { id: 5, title: ' DUPLO CHICKEN CARAMELIZADO', description: 'Pão de brioche, 2 bifes de frango artesanal, duplo cheddar cremoso, dupla cebola roxa caramelizada, duplo barbecue, duplo bacon e maionese caseira.', price: '33,00', imageSrc: DchickenC },
  { id: 6, title: 'DUPLO CHEESE', description: 'Pão de brioche, 2 bifes de carne bovina artesanal, duplo cheddar cremoso, duplo queijo cheddar e maionese caseira.', price: '30,00', imageSrc: Dcheese },
  { id: 7, title: 'DUPLO ONION', description: 'Pão de brioche, 2 bifes de carne bovina artesanal, duplo cheddar cremoso, duplo anel de cebola frito e maionese caseira.', price: '33,00', imageSrc: Donion },
  { id: 8, title: 'DUPLO 4 QUEIJOS', description: 'Pão de brioche, 2 bifes bovino, duplo catupiry, dupla Mussarela, duplo queijo cheddar, duplo queijo provolone e maionese caseira.', price: '35,00', imageSrc: D4Queijos },
];

const Camarao = [
  { id: 1, title: 'CAMARÃO PICANTE BURGUER', description: 'Pão de brioche, camarão frito na chapa ao molho shoyo, pimenta, creme de leite, geleia de pimenta e maionese.', price: '43,00', imageSrc: 'https://media.istockphoto.com/id/1300336688/pt/foto/juicy-burger-with-beef-shrimp-tomatoes-cheese-and-crispy-onions-on-a-dark-background-close-up.jpg?s=2048x2048&w=is&k=20&c=oesiDURoI49IOoUGEm13T3YVf_fJCWQiNlqx2o2Uv6g=' },
  { id: 2, title: 'CAMARÃO CARAMELIZADO BURGUER', description: 'Pão de brioche, camarão frito na chapa, cebola roxa caramelizada, cheddar cremoso e maionese.', price: '43,00', imageSrc: 'https://media.istockphoto.com/id/1300336688/pt/foto/juicy-burger-with-beef-shrimp-tomatoes-cheese-and-crispy-onions-on-a-dark-background-close-up.jpg?s=2048x2048&w=is&k=20&c=oesiDURoI49IOoUGEm13T3YVf_fJCWQiNlqx2o2Uv6g=' },
  { id: 3, title: 'CAMARÃO AO SHOYO BURGUER', description: 'Pão de brioche, camarão frito na chapa ao molho shoyo, molho de pimenta, molho especial e maionese.', price: '43,00', imageSrc: 'https://media.istockphoto.com/id/1300336688/pt/foto/juicy-burger-with-beef-shrimp-tomatoes-cheese-and-crispy-onions-on-a-dark-background-close-up.jpg?s=2048x2048&w=is&k=20&c=oesiDURoI49IOoUGEm13T3YVf_fJCWQiNlqx2o2Uv6g=' },
];

const Agridoce = [
  { id: 1, title: 'HAWAIANO', description: 'Pão de brioche, bife de carne bovina artesanal, queijo provolone, lombo canadense, abacaxi caramelizado, bacon, rúcula, barbecue e maionese caseira.', price: '33,00', imageSrc: Hawai },
  { id: 2, title: 'CALIFÓRNIA', description: 'Pão de brioche, bife de carne bovina artesanal, mussarela, lombo canadense, figo caramelizado, bacon, barbecue e maionese caseira.', price: '31,00', imageSrc: Calif },
  { id: 3, title: 'TROPICAL', description: 'Pão de brioche, bife de carne bovina artesanal, cream cheese, figo caramelizado, abacaxi caramelizado, pêssego caramelizado, hortelã, bacon, barbecue e maionese caseira.', price: '38,00', imageSrc: Tropical },
  { id: 4, title: 'PEACH', description: 'Pão de brioche, bife de carne bovina artesanal, cream cheese, lombo canadense, pêssego caramelizado, hortelã e maionese caseira.', price: '31,00', imageSrc: Peach },
  { id: 4, title: 'ROMEU E JULIETA', description: 'Pão de brioche, hambúrguer bovino artesanal, queijo mussarela e goiabada.', price: '24,00', imageSrc: Rej }
];

const AgridoceGeleia = [
  { id: 1, title: 'SWEET CHILLI', description: 'Pão de brioche, bife de carne bovina artesanal, cheddar cremoso, bacon, geleia de pimenta e maionese caseira.', price: '30,00', imageSrc: SweetChilli },
  { id: 2, title: 'DUPLO SWEET CHILLI', description: 'Pão de brioche, 2 bifes de carne bovina artesanal, duplo cheddar cremoso, duplo bacon, dupla geleia de pimenta e maionese caseira.', price: '36,00', imageSrc: SweetChilli },
  { id: 3, title: 'SWEET PINEAPPLE', description: 'Pão de brioche, bife de carne bovina artesanal, cream cheese, bacon, geleia de abacaxi com pimenta e maionese caseira.', price: '30,00', imageSrc: SweetAbacaxi },
  { id: 4, title: 'DUPLO SWEET PINEAPPLE', description: 'Pão de brioche, 2 bifes de carne bovina artesanal, duplo cream cheese, duplo bacon, dupla geleia de abacaxi com pimenta e maionese caseira.', price: '36,00', imageSrc: SweetAbacaxi },
  { id: 5, title: 'MORANGO CHILLI BURGUER', description: 'Pão de brioche, bife bovino, cream cheese, geleia de morango com pimenta, bacon e maionese.', price: '31,00', imageSrc: MorangoChilli },
  { id: 6, title: 'MARACUJÁ CHILLI', description: 'Pão de brioche, bife de carne bovina artesanal, geleia de maracujá com chilli e maionese caseira.', price: '35,00', imageSrc: MaracujaChilli },
];

const Doces = [
  { id: 1, title: 'BANOFFEE', description: 'Pão de brioche, banana selada na chapa, doce de leite, farofa doce e cream cheese.', price: '23,00', imageSrc: Banoffe },
  { id: 2, title: 'NUTELLA', description: 'Pão de brioche, Nutella, leite em pó ninho e morango.', price: '26,00', imageSrc: Nutella },
  { id: 3, title: 'PARRILLERO', description: 'Pão de brioche, bife de carne artesanal, queijo provolone e doce de leite.', price: '27,00', imageSrc: Parrilero },
];

const Petiscos = [
  {
    id: 1,
    title: 'Batata Frita 250g',
    description: 'Batata frita crocante.',
    price: '20,00',
    imageSrc: 'https://tse2.mm.bing.net/th?id=OIP.m_v8PAhfhc_1-MVxzl5vRgHaE9&w=317&h=317&c=7'
  },
  {
    id: 2,
    title: 'Batata Frita 500g',
    description: 'Porção grande de batata frita crocante.',
    price: '35,00',
    imageSrc: 'https://tse2.mm.bing.net/th?id=OIP.m_v8PAhfhc_1-MVxzl5vRgHaE9&w=317&h=317&c=7'
  },
  {
    id: 3,
    title: 'Polenta 250g',
    description: 'Polenta frita crocante.',
    price: '20,00',
    imageSrc: 'https://tse4.mm.bing.net/th?id=OIP.NicGvxYz0OiBxUo9F7cwlgHaE8&w=316&h=316&c=7'
  },
  {
    id: 5,
    title: 'Anéis de Cebola 250g',
    description: 'Anéis de cebola empanados.',
    price: '25,00',
    imageSrc: 'https://tse4.mm.bing.net/th?id=OIP.eoQR4gtG6tvXBTVbc75KNgHaEK&w=266&h=266&c=7'
  },
  {
    id: 6,
    title: 'Batata de 250g com cheddar',
    description: 'Batata de 250g com cheddar.',
    price: '24,00',
    imageSrc: 'https://nationaltoday.com/wp-content/uploads/2021/04/Cheddar-Fries-1-1200x834.jpg'
  },
  {
    id: 7,
    title: 'Batata de 250g com bacon',
    description: 'Batata de 250g com bacon.',
    price: '26,00',
    imageSrc: 'https://finoalho.com/wp-content/uploads/2024/07/Batata-Frita-Bacon.png'
  },
  {
    id: 8,
    title: 'Batata de 250g com cheddar e bacon',
    description: 'Batata de 250g com cheddar e bacon.',
    price: '30,00',
    imageSrc: 'https://media-cdn.tripadvisor.com/media/photo-s/15/08/3a/66/cheddar-fries-batatas.jpg'
  }
];

const Bebidas = [
  // Cervejas Garrafa
  { id: 5, title: 'Original Garrafa 600ml', description: 'Cerveja Original garrafa 600ml.', price: '14,00', imageSrc: 'https://choppbrahmaexpress.vtexassets.com/arquivos/ids/155801/cerveja-antarctica-original-600ml_1.jpg?v=637353454967000000' },
  { id: 7, title: 'Heineken Garrafa 600ml', description: 'Cerveja Heineken garrafa 600ml.', price: '16,00', imageSrc: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/23256934/cerveja-heineken-garrafa-600-ml-1.jpg?v=637655997827630000' },
  
  // Refrigerantes Lata
  { id: 8, title: 'Coca-Cola Lata 350ml', description: 'Refrigerante Coca-Cola lata.', price: '6,00', imageSrc: 'https://www.imigrantesbebidas.com.br/bebida/images/products/full/1984-refrigerante-coca-cola-lata-350ml.jpg' },
  { id: 9, title: 'Fanta Laranja Lata 350ml', description: 'Refrigerante Fanta Laranja lata.', price: '6,00', imageSrc: 'https://images.tcdn.com.br/img/img_prod/858764/refrigerante_fanta_laranja_lata_350ml_c_06_1301_1_77f85b0d9fd22841694b65386be4048b.jpg' },
  { id: 10, title: 'Guaraná Lata 350ml', description: 'Refrigerante Guaraná lata.', price: '6,00', imageSrc: 'https://acdn-us.mitiendanube.com/stores/001/043/810/products/7d215ecd8878c518bfbf5dedb4e4a1df-0177e93972e07fb3d817200379205521-640-0.jpg' },
  { id: 11, title: 'Sprite Lata 350ml', description: 'Refrigerante Sprite lata.', price: '6,00', imageSrc: 'https://mfresh.s3.amazonaws.com/uploads/product/sku/11972/image/34a6d2b4-dbb5-45cd-8df2-cb808bfb18b4.jpg' },
  
  // Refrigerantes PET 2L
  { id: 12, title: 'Coca-Cola PET 2L', description: 'Refrigerante Coca-Cola PET 2 litros.', price: '14,00', imageSrc:'https://images.tcdn.com.br/img/img_prod/1115696/coca_cola_pet_2l_6_und_387_1_5ae4d08b3748473ce2b510c7c522bd7a.jpeg' },
  { id: 13, title: 'Fanta Laranja PET 2L', description: 'Refrigerante Fanta PET 2 litros.', price: '13,00', imageSrc: 'https://superprix.vteximg.com.br/arquivos/ids/211062-600-600/548308.png?v=638107612668130000' },
  { id: 14, title: 'Guaraná PET 2L', description: 'Refrigerante Guaraná PET 2 litros.', price: '13,00', imageSrc: 'https://d21wiczbqxib04.cloudfront.net/aIorPKBqoaxd8Io19Fu0xLzU6yE=/fit-in/453x453/filters:fill(FFFFFF):background_color(white)/https://produtos-osuper.s3.sa-east-1.amazonaws.com/934f78e66b9c78d0e284178051dd18e55e31ff07/360/308919adea60-35.webp' },
  { id: 15, title: 'Sprite PET 2L', description: 'Refrigerante Sprite PET 2 litros.', price: '13,00', imageSrc: 'https://io.convertiez.com.br/m/morifarma/shop/products/images/279093/large/refrigerante-sprite-2l_6899.jpg' },

  // Água Mineral
  { id: 16, title: 'Água Mineral com Gás', description: 'Garrafa de água com gás.', price: '4,00', imageSrc: 'https://dispandistribuidora.agilecdn.com.br/8211_1.jpg' },
  { id: 17, title: 'Água Mineral sem Gás', description: 'Garrafa de água sem gás.', price: '4,00', imageSrc: 'https://www.imigrantesbebidas.com.br/bebida/images/products/full/2893-agua-mineral-crystal-sem-gas-500ml.jpg' },

  // Suco
  { id: 18, title: 'Suco Natural de Laranja 350ml', description: 'Suco natural de laranja gelado.', price: '8,00', imageSrc: 'https://storage.googleapis.com/domain-images/06c5ca84-e308-4cad-8b0a-ece554dd990c/products/gallery_ffd2e63a-a707-4c47-9380-55f375e97df1.jpg' },
];

const getProductCategory = (product) => {
  if (Bebidas.includes(product)) return 'Bebidas';
  if (Petiscos.includes(product)) return 'Petiscos';
  if (Doces.includes(product)) return 'Doces';
  if (AgridoceGeleia.includes(product)) return 'AgridoceGeleia';
  if (Agridoce.includes(product)) return 'Agridoce';
  if (Camarao.includes(product)) return 'Camarao';
  if (Duplos.includes(product)) return 'Duplos';
  return 'Normais';
};

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
    <div id="menu" className="bg-gray-100 min-h-screen ">
        <div className='p-4 text-center mb-10 bg-black'>
        <p className='text-red-600 text-3xl text-center'><strong>Atenção !</strong></p>
        <span className='text-xl text-center text-white'>não fizemos trocas de um condimento por outro, entra como adicional!</span>
        </div>
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold uppercase text-gray-800">Cardápio</h1>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Normais</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Normais.map((product) => (
              <ProductItem key={product.id} product={product} onSelect={openModal} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Camarão</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Camarao.map((product) => (
              <ProductItem key={product.id} product={product} onSelect={openModal} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Duplos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Duplos.map((product) => (
              <ProductItem key={product.id} product={product} onSelect={openModal} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Agridoce</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Agridoce.map((product) => (
              <ProductItem key={product.id} product={product} onSelect={openModal} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Agridoces com Geleia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AgridoceGeleia.map((product) => (
              <ProductItem key={product.id} product={product} onSelect={openModal} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Doces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Doces.map((product) => (
              <ProductItem key={product.id} product={product} onSelect={openModal} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Petiscos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Petiscos.map((product) => (
              <ProductItem key={product.id} product={product} onSelect={openModal} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bebidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Bebidas.map((product) => (
              <ProductItem key={product.id} product={product} onSelect={openModal} />
            ))}
          </div>
        </section>

        {selectedProduct && (
          <ItemModal
            itemTitle={selectedProduct.title}
            itemPrice={selectedProduct.price}
            itemImage={selectedProduct.imageSrc}
            itemDescription={selectedProduct.description}
            itemCategory={getProductCategory(selectedProduct)}
            onClose={closeModal}
            onConfirm={(itemData) => {
              console.log("Item adicionado:", itemData);
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