import db from "../config/db.js";

export const createUser = ({ username, password }, callback) => {
  db.run(
    "INSERT INTO usuarios (username, password) VALUES (?, ?)",
    [username, password],
    function (err) {
      callback(err, { id: this?.lastID, username });
    }
  );
};

export const getUserByUsername = (username, callback) => {
  db.get("SELECT * FROM usuarios WHERE username = ?", [username], callback);
};
