# Usa uma imagem Node oficial
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração do backend
COPY backend/package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código do backend
COPY backend .

# Expõe a porta (a mesma do server.js)
EXPOSE 8080

# Comando de inicialização
CMD ["node", "server.js"]
