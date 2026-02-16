import React from "react";
import Routes from "./Routes";
import { Toaster } from "sonner";
import { AuthProvider } from "context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
