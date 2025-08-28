import axios from "axios";

// URL do backend
const API_URL = "http://localhost:5000";

// Função para pegar o token salvo
const getToken = () => localStorage.getItem("token");

// ================== AUTH ==================

// Registrar usuário
export const registerUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { username, password });
  return response.data;
};

// Login
export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  return response.data; // { token }
};

// ================== PRODUTOS ==================

// Listar produtos
export const getProdutos = async () => {
  const response = await axios.get(`${API_URL}/produtos`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Criar produto
export const createProduto = async (produto) => {
  const response = await axios.post(`${API_URL}/produtos/create`, produto, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Atualizar produto
export const updateProduto = async (id, produto) => {
  const response = await axios.put(`${API_URL}/produtos/${id}`, produto, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Deletar produto
export const deleteProduto = async (id) => {
  const response = await axios.delete(`${API_URL}/produtos/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};
