import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./router/routes.tsx";
import { AuthProvider } from "./store/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider
        future={{
          v7_startTransition: true,
        }}
        router={router}
      />
    </AuthProvider>
  </StrictMode>
);
