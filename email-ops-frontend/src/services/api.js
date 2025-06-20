import axios from "axios";

// Define a base URL for the API if available, otherwise use relative paths
// const API_BASE_URL = 'http://localhost:3001/api'; // Example, adjust as needed
// For now, we'll use relative paths assuming the frontend and backend are served on the same domain or proxied.
const apiClient = axios.create({
  // baseURL: API_BASE_URL, // Uncomment and set if you have a base URL
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': 'Bearer ' + localStorage.getItem('token') // Example for token-based auth
  },
});

// Interceptor for handling responses (optional, but good for centralized error handling/logging)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error or handle globally
    console.error("API call error:", error.response || error.message || error);
    // You might want to transform the error into a more user-friendly format
    // or handle specific error codes (e.g., 401 for unauthorized)
    return Promise.reject(
      error.response ? error.response.data : error.message || "Network Error",
    );
  },
);

// --- Connection APIs ---
export const testDBConnection = async (connectionDetails) => {
  try {
    // Replace '/api/test-connection' with your actual backend endpoint
    const response = await apiClient.post(
      "/api/db/test-connection",
      connectionDetails,
    );
    return response.data; // Expected: { success: true, message: 'Connection successful' }
  } catch (error) {
    console.error("Error testing DB connection:", error);
    throw error; // Re-throw to be caught by the calling component
  }
};

export const connectDB = async (connectionDetails) => {
  try {
    // Replace '/api/connect' with your actual backend endpoint
    const response = await apiClient.post("/api/db/connect", connectionDetails);
    // Expected: { success: true, message: 'Connected', token: 'some_jwt_token' (if using tokens) }
    // If using token-based auth, you might store the token here:
    // if (response.data.token) {
    //   localStorage.setItem('token', response.data.token);
    //   apiClient.defaults.headers['Authorization'] = 'Bearer ' + response.data.token;
    // }
    return response.data;
  } catch (error) {
    console.error("Error connecting to DB:", error);
    throw error;
  }
};

// --- Dashboard APIs ---
export const fetchEmailStats = async () => {
  // Renamed from getEmailStats
  try {
    const response = await apiClient.get("/api/dashboard/stats");
    // Expected: { pending: 10, success: 150, failed: 5 }
    return response.data;
  } catch (error) {
    console.error("Error fetching email stats:", error);
    throw error;
  }
};

// --- Manual Email Page APIs ---
export const fetchManualEmailData = async () => {
  // Renamed from getManualEmailData
  try {
    const response = await apiClient.get("/api/emails/list");
    // Expected: Array of email objects similar to mock data
    return response.data;
  } catch (error) {
    console.error("Error fetching manual email data:", error);
    throw error;
  }
};

export const postSendComposedEmail = async (emailData) => {
  // Renamed from mockSendComposedEmail
  try {
    // emailData should contain { recipientEmail, subject, body, attachmentPath, originalEmailId }
    const response = await apiClient.post("/api/emails/send", emailData);
    // Expected: { success: true, message: 'Email sent successfully' }
    return response.data;
  } catch (error) {
    console.error("Error sending composed email:", error);
    throw error;
  }
};

export const postUpdateOperationStatus = async (emailId, newStatus) => {
  // Renamed from mockUpdateOperationStatus
  try {
    const response = await apiClient.post("/api/emails/update-status", {
      id: emailId,
      status: newStatus,
    });
    // Expected: { success: true, message: 'Status updated successfully' }
    return response.data;
  } catch (error) {
    console.error("Error updating operation status:", error);
    throw error;
  }
};

// Note: The actual API endpoints ('/api/...') are placeholders.
// These need to be replaced with the real backend API endpoints.
// Error handling is basic; more sophisticated handling (e.g., specific error messages
// based on status codes) can be added in components or within these service functions.
