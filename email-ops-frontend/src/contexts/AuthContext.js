import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [user, setUser] = useState(null); // Optional: store user details or connection info
  // const [token, setToken] = useState(localStorage.getItem('app_token')); // Example: initialize from localStorage

  // Effect to check initial auth status, e.g., from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("app_token"); // Example token check
    if (storedToken) {
      // Here you might want to validate the token with a backend call in a real app
      // For now, just having a token means authenticated for this mock setup
      setIsAuthenticated(true);
      // Potentially set user details if token is valid / contains them
    }
  }, []);

  const login = (/* connectionData, authToken */) => {
    // In a real app, you'd get a token from connectDB and store it
    // For example: localStorage.setItem('app_token', authToken);
    // apiClient.defaults.headers['Authorization'] = 'Bearer ' + authToken; // Update axios instance
    localStorage.setItem("app_token", "dummy_token_for_auth_context"); // Simulate token
    setIsAuthenticated(true);
    // setUser(userData); // If you have user data
    console.log("AuthContext: User logged in (simulated)");
  };

  const logout = () => {
    localStorage.removeItem("app_token"); // Clear token
    // if (apiClient.defaults.headers['Authorization']) {
    //   delete apiClient.defaults.headers['Authorization'];
    // }
    setIsAuthenticated(false);
    // setUser(null);
    console.log("AuthContext: User logged out");
    // Optionally, navigate to login page or refresh to ensure state clears
    // window.location.href = '/'; // Hard redirect if needed
  };

  const value = {
    isAuthenticated,
    // user,
    // token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
