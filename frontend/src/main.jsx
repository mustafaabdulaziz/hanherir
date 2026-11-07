import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/site.css";
import SiteApp from "./site/SiteApp.jsx";

const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="/*" element={<SiteApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
