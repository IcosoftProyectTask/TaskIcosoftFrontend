import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from "react-toastify";
import ThemeProvider from "./context/ThemeContext";
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from "./context/UserContext";

import App from "./App";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ThemeProvider>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
            {/* ToastContainer mejorado */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss={false}  // Cambié esta opción a false para asegurar que no se quede pegada
              draggable
              pauseOnHover
              theme="dark"   // O "light" según lo que prefieras
              limit={1}       // Limita a 1 el número de toasts visibles al mismo tiempo
            />
          </ThemeProvider>
        </UserProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);
