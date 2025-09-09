import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyToken } from "../services/Services";

export default function PrivateRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const data = await verifyToken(token);
        if (data.valid) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (err) {
        setIsValid(false);
      }
    };

    checkToken();
  }, []);

  if (isValid === null) {
    return <p className="text-center mt-10">Carregando...</p>; // loading
  }

  return isValid ? children : <Navigate to="/login" />;
}
