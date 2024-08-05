import { createContext, useContext, useState, useEffect } from "react";
import { axiosClient } from "../axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AuthContext = createContext();
const MySwal = withReactContent(Swal);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const signin = async (email, password) => {
    try {
      const response = await axiosClient.post("/api/login", { email, password });
      const user_data = response.data.data.user;
      setUser(user_data);
      localStorage.setItem("user", JSON.stringify(user_data));
      const { token } = response.data.data; // Access the token here
      setToken(token);
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error(error?.response?.data?.message || "Error during signin");
      MySwal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: error?.response?.data?.message || 'An error occurred during sign in.',
      });
      throw error;
    }
  };
  

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const signout = async () => {
    try {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out", error);
      MySwal.fire({
        icon: 'error',
        title: 'Sign Out Error',
        text: 'An error occurred during sign out.',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, signin, signout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
