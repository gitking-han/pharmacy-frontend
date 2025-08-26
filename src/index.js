import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Styles
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/css/argon-dashboard-react.css";

// Layouts
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import NotFound from "views/examples/NotFound";

// Context Providers
import MedicineState from "context/MedicineState";
import { StockProvider } from "./context/stockContext";
import { SupplierProvider } from "./context/supplierContext";
import { ReturnProvider } from "context/ReturnContext";
import SaleState from "./context/SaleState";
import { ProfileProvider } from "./context/ProfileContext";
// Routes config
import routes from "routes";

function GuardedRoute({ element }) {
  const isAuthenticated = !!localStorage.getItem("token");

  if (isAuthenticated) {
    return element;
  } else {
    return <Navigate to="/auth/login" replace />;
  }
}



function AppRouter() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type = "success") => {
    setAlert({ msg: message, type });
    setTimeout(() => setAlert(null), 1500);
  };

  const appRoutes = routes(alert, showAlert);

  return (
 
    <MedicineState>
      <StockProvider>
        <SupplierProvider>
          <SaleState>
            <ReturnProvider>
            <ProfileProvider>
            {alert && (
              <div
                className={`p-4 text-white text-center ${alert.type === "success" ? "bg-green-500" : "bg-red-500"
                  }`}
              >
                {alert.msg}
              </div>
            )}

            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/admin/index" replace />} />
                <Route path="/admin" element={<Navigate to="/admin/index" replace />} />
                <Route
                  path="/admin/*"
                  element={<GuardedRoute element={<AdminLayout routes={appRoutes} />} />}
                />
                <Route path="/auth/*" element={<AuthLayout routes={appRoutes} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>

            </BrowserRouter>
            </ProfileProvider>
            </ReturnProvider>
          </SaleState>
        </SupplierProvider>
      </StockProvider>
    </MedicineState>
    
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppRouter />);
