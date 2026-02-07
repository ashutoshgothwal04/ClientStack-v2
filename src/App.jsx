import React from "react";
import Routes from "./Routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Routes />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
