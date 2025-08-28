import React, { useState } from "react";
import { FaBox, FaUsers, FaSignOutAlt, FaBars, FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronRight, FaList } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";

export default function Admin() {
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState({
    products: false,
    users: false
  });

  const toggleSubmenu = (menu) => {
    setOpenSubmenus({
      ...openSubmenus,
      [menu]: !openSubmenus[menu]
    });
  };

  return (
    <div className="w-full h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gradient-to-br from-[#441704] to-[#b34b0a] text-white flex flex-col transition-all duration-300`}
      >
        <div className="p-6 text-2xl font-bold border-b border-white/20 flex items-center justify-between">
          {isOpen && <span>Admin Panel</span>}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-3">
            {/* Produtos */}
            <li>
              <div 
                className="flex items-center justify-between p-2 hover:bg-white/20 rounded-lg cursor-pointer"
                onClick={() => toggleSubmenu('products')}
              >
                <div className="flex items-center gap-3">
                  <FaBox />
                  {isOpen && <span>Produtos</span>}
                </div>
                {isOpen && (
                  openSubmenus.products ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />
                )}
              </div>
              
              {/* Submenu de Produtos */}
              {isOpen && openSubmenus.products && (
                <ul className="ml-8 mt-2 space-y-2 border-l border-white/20 pl-3">
                  <li>
                    <Link
                      to="/admin/products"
                      className="flex items-center gap-2 p-1 hover:bg-white/20 rounded"
                    >
                      <FaList size={12} />
                      <span>Todos os Produtos</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="products/create"
                      className="flex items-center gap-2 p-1 hover:bg-white/20 rounded"
                    >
                      <FaPlus size={12} />
                      <span>Criar</span>
                    </Link>
                  </li>
                 
                </ul>
              )}
            </li>

       
          </ul>
        </nav>

        {/* Sair */}
        <div className="p-4 border-t border-white/20">
          <button className="flex items-center gap-2 w-full text-left hover:text-red-400">
            <FaSignOutAlt /> {isOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-gray-900 text-xl"
          >
            <FaBars />
          </button>
          <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>
   
        </header>

        {/* Aqui troca dinamicamente */}
        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}