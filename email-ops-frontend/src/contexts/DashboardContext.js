import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// Import the actual API function, replacing the mock one
import { fetchEmailStats } from "../services/api";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState({ pending: 0, success: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Renamed to 'loadStats' to avoid confusion with the imported 'fetchEmailStats'
  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the imported fetchEmailStats function from api.js
      const data = await fetchEmailStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching dashboard stats from API:", err);
      // err might be the error message string from the interceptor or an error object
      const errorMessage =
        typeof err === "string"
          ? err
          : err.message || "Failed to load statistics.";
      setError(errorMessage);
      // Set stats to N/A or keep previous stats on error, depending on desired UX
      setStats({ pending: "N/A", success: "N/A", failed: "N/A" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]); // loadStats is stable due to useCallback

  const value = {
    stats,
    loading,
    error,
    refreshStats: loadStats, // Expose loadStats as refreshStats
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
