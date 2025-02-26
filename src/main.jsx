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
          <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
        </ThemeProvider>
      </UserProvider>
    </QueryClientProvider>
    </Router>
  </React.StrictMode>
);
