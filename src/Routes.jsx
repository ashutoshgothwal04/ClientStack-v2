import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProjectManagement from "./pages/project-management";
import BillingInvoices from "./pages/billing-invoices";
import LoginPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import RegisterPage from "./pages/register";
import UserProfile from "./pages/user-profile";
import SettingsPage from "pages/settings";
import Clients from "pages/clients";
import Help from "pages/help";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<BillingInvoices />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project-management" element={<ProjectManagement />} />
          <Route path="/billing-invoices" element={<BillingInvoices />} />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/clients" element={<Clients />} />   // ..
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
