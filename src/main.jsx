import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
    <App />
  </React.StrictMode>
);
