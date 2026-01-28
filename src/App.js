import React from "react";
import RoutesApp from "./routes/routes";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./components/toast";
import { UnidadeProvider } from "./components/unidade-context";
import { AuthProvider } from "./components/auth-context";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UnidadeProvider>
          <RoutesApp />
          <ToastProvider />
        </UnidadeProvider>
      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;