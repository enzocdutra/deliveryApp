import React, { useState } from "react";
import {
  FaBox,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
  FaList
} from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Admin() {
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState({
    products: false,
    users: false,
  });

  const navigate = useNavigate();

  const toggleSubmenu = (menu) => {
    setOpenSubmenus({
      ...openSubmenus,
      [menu]: !openSubmenus[menu],
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove o token salvo
    navigate("/login"); // redireciona para login
  };

  return (
    <div className="w-full h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gradient-to-br from-[#441704] to-[#b34b0a] text-white flex flex-col transition-all duration-300 h-screen`}
      >
        {/* Header do Sidebar */}
        <div className="p-6 text-2xl font-bold border-b border-white/20 flex items-center justify-between flex-shrink-0">
          {isOpen && <span>Admin Panel</span>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-gray-200 text-xl"
          >
            <FaBars />
          </button>
        </div>

        {/* Menu - Área scrollable */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-3 p-4">
            {/* Produtos */}
            <li>
              <div
                className="flex items-center justify-between p-2 hover:bg-white/20 rounded-lg cursor-pointer"
                onClick={() => toggleSubmenu("products")}
              >
                <div className="flex items-center gap-3">
                  <FaBox />
                  {isOpen && <span>Produtos</span>}
                </div>
                {isOpen &&
                  (openSubmenus.products ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronRight size={14} />
                  ))}
              </div>

              {/* Submenu de Produtos */}
              {isOpen && openSubmenus.products && (
                <ul className="ml-8 mt-2 space-y-2 border-l border-white/20 pl-3">
                  <li>
                    <Link
                      to="/admin/products"
                      className="flex items-center gap-2 p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <FaList size={12} />
                      <span>Todos os Produtos</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="products/create"
                      className="flex items-center gap-2 p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <FaPlus size={12} />
                      <span>Criar</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Usuários (exemplo adicional) */}
            {/* <li>
              <div
                className="flex items-center justify-between p-2 hover:bg-white/20 rounded-lg cursor-pointer"
                onClick={() => toggleSubmenu("users")}
              >
                <div className="flex items-center gap-3">
                  <FaUsers />
                  {isOpen && <span>Usuários</span>}
                </div>
                {isOpen &&
                  (openSubmenus.users ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronRight size={14} />
                  ))}
              </div>

              {isOpen && openSubmenus.users && (
                <ul className="ml-8 mt-2 space-y-2 border-l border-white/20 pl-3">
                  <li>
                    <Link
                      to="/admin/users"
                      className="flex items-center gap-2 p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <FaList size={12} />
                      <span>Todos os Usuários</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="users/create"
                      className="flex items-center gap-2 p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <FaPlus size={12} />
                      <span>Criar</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li> */}
          </ul>
        </nav>

        {/* Footer do Sidebar - fixo na parte inferior */}
        <div className="p-4 border-t border-white/20 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <FaSignOutAlt /> 
            {isOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Bem-vindo, Admin</span>
          </div>
        </header>

        {/* Área de conteúdo - scrollable */}
        <section className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}