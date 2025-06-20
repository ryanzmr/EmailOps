import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { testDBConnection, connectDB } from "../services/api";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testConnectionStatus, setTestConnectionStatus] = useState({
    message: "",
    type: "",
  });
  const [connectStatus, setConnectStatus] = useState({ message: "", type: "" });

  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  const initialValues = {
    serverName: "",
    databaseName: "",
    username: "",
    password: "",
  };
  const validationSchema = Yup.object({
    serverName: Yup.string().required("Server Name is required"),
    databaseName: Yup.string().required("Database Name is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setConnectStatus({ message: "", type: "" });
    setTestConnectionStatus({ message: "", type: "" });
    try {
      const response = await connectDB(values);
      if (response.success) {
        // Call AuthContext's login function
        login(/* pass response.data or token if available */);
        setConnectStatus({
          message: response.message || "Successfully connected!",
          type: "success",
        });
        setTimeout(() => navigate("/dashboard"), 1000); // Navigate after brief delay
      } else {
        setConnectStatus({
          message: response.message || "Connection failed.",
          type: "error",
        });
      }
    } catch (error) {
      setConnectStatus({
        message: error.message || error || "Connection failed.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestConnection = async (values) => {
    if (
      !values.serverName ||
      !values.databaseName ||
      !values.username ||
      !values.password
    ) {
      setTestConnectionStatus({
        message: "Please fill all fields to test connection.",
        type: "error",
      });
      return;
    }
    setIsTestingConnection(true);
    setTestConnectionStatus({ message: "", type: "" });
    setConnectStatus({ message: "", type: "" });
    try {
      const response = await testDBConnection(values);
      setTestConnectionStatus({
        message:
          response.message ||
          (response.success ? "Test successful!" : "Test failed."),
        type: response.success ? "success" : "error",
      });
    } catch (error) {
      setTestConnectionStatus({
        message: error.message || error || "Test failed.",
        type: "error",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-gray-100 p-4 selection:bg-sky-400 selection:text-sky-900">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-400 sm:text-5xl">
          Email Operations Center
        </h1>
      </header>
      <div className="bg-slate-800/70 backdrop-blur-md p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-sky-100">
          Connect to Database
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, dirty, isValid }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="serverName"
                  className="block text-sm font-medium text-sky-200"
                >
                  Server Name
                </label>
                <Field
                  type="text"
                  name="serverName"
                  id="serverName"
                  className="mt-1 block w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-gray-50"
                />
                <ErrorMessage
                  name="serverName"
                  component="div"
                  className="text-red-400 text-xs mt-1.5"
                />
              </div>
              <div>
                <label
                  htmlFor="databaseName"
                  className="block text-sm font-medium text-sky-200"
                >
                  Database Name
                </label>
                <Field
                  type="text"
                  name="databaseName"
                  id="databaseName"
                  className="mt-1 block w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-gray-50"
                />
                <ErrorMessage
                  name="databaseName"
                  component="div"
                  className="text-red-400 text-xs mt-1.5"
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-sky-200"
                >
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  className="mt-1 block w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-gray-50"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-400 text-xs mt-1.5"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-sky-200"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    className="block w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-sky-300 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-400 text-xs mt-1.5"
                />
              </div>
              {testConnectionStatus.message && (
                <div
                  className={`p-3 my-2 rounded-md text-sm text-center ${testConnectionStatus.type === "success" ? "bg-green-800/60 text-green-300" : "bg-red-800/60 text-red-300"}`}
                >
                  {testConnectionStatus.message}
                </div>
              )}
              {connectStatus.message && (
                <div
                  className={`p-3 my-2 rounded-md text-sm text-center ${connectStatus.type === "success" ? "bg-green-800/60 text-green-300" : "bg-red-800/60 text-red-300"}`}
                >
                  {connectStatus.message}
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => handleTestConnection(values)}
                  disabled={isSubmitting || isTestingConnection}
                  className="w-full sm:w-1/2 py-2.5 px-4 border border-sky-500/50 rounded-lg shadow-sm text-sm font-medium text-sky-200 hover:bg-sky-700/50 hover:border-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  {isTestingConnection ? "Testing..." : "Test Connection"}
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting || isTestingConnection || !dirty || !isValid
                  }
                  className="w-full sm:w-1/2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  {isSubmitting ? "Connecting..." : "Connect"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="text-xs text-slate-400 text-center mt-8">
          Ensure your SQL Server is configured for remote connections.
        </p>
      </div>
      <footer className="mt-10 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Email Operations Inc. All rights
        reserved.
      </footer>
    </div>
  );
};
export default LoginPage;
