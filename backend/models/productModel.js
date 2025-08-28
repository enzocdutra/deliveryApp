import db from "../config/db.js";

export const getAll = (callback) => {
  db.all("SELECT * FROM produtos ORDER BY id DESC", [], callback);
};

export const getById = (id, callback) => {
  db.get("SELECT * FROM produtos WHERE id = ?", [id], callback);
};

export const create = ({ nome, descricao, preco, imagem }, callback) => {
  db.run(
    "INSERT INTO produtos (nome, descricao, preco, imagem) VALUES (?, ?, ?, ?)",
    [nome, descricao, preco, imagem || null],
    function (err) {
      callback(err, { id: this?.lastID, nome, descricao, preco, imagem });
    }
  );
};

export const update = ({ id, nome, descricao, preco, imagem }, callback) => {
  db.run(
    "UPDATE produtos SET nome = ?, descricao = ?, preco = ?, imagem = ? WHERE id = ?",
    [nome, descricao, preco, imagem || null, id],
    function (err) {
      callback(err, { changes: this.changes, id, nome, descricao, preco, imagem });
    }
  );
};

export const remove = (id, callback) => {
  db.run("DELETE FROM produtos WHERE id = ?", [id], function (err) {
    callback(err, { changes: this.changes });
  });
};
