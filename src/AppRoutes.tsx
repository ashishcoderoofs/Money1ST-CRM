import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import OrganizationalChart from "./pages/OrganizationalChart";
import BranchDevelopment from "./pages/BranchDevelopment";
import FnaTraining from "./pages/FnaTraining";
import Admin from "./pages/Admin";
import Consultants from "./pages/Consultants";
import Clients from "./pages/Clients";
import NewConsultant from "./pages/NewConsultant";
import EditConsultant from "./pages/EditConsultant";
import ConsultantDetails from "./pages/ConsultantDetails";
import NewClient from "./pages/NewClient";
import UserDetails from "./pages/UserDetails";
import EditUser from "./pages/EditUser";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RBACProtectedRoute from "./components/RBACProtectedRoute";
import SecuriaProtectedRoute from "./components/SecuriaProtectedRoute";
import Securia from "./pages/Securia";
import ClientDetails from "./pages/ClientDetails";
import EditClient from "./pages/EditClient";
import Analytics from "./pages/Analytics";
import ReportBug from "./pages/ReportBug";
import HomeDashboard from "./pages/HomeDashboard";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <Layout>
            <HomeDashboard />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Dashboard">
            <Layout>
              <Dashboard />
            </Layout>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/reports"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Reports">
            <Layout>
              <Reports />
            </Layout>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/organizational-chart"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Organizational Chart">
            <Layout>
              <OrganizationalChart />
            </Layout>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/branch-development"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Branch Development">
            <Layout>
              <BranchDevelopment />
            </Layout>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/fna-training"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="FNA Training">
            <Layout>
              <FnaTraining />
            </Layout>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Admin">
            <Layout>
              <Admin />
            </Layout>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/analytics"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Analytics">
            <Layout>
              <Analytics />
            </Layout>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/report-bug"
      element={
        <ProtectedRoute>
          <Layout>
            <ReportBug />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/securia"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Securia">
            <SecuriaProtectedRoute>
              <Layout>
                <Securia />
              </Layout>
            </SecuriaProtectedRoute>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/securia/consultants"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Securia">
            <SecuriaProtectedRoute>
              <Layout>
                <Consultants />
              </Layout>
            </SecuriaProtectedRoute>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/securia/consultants/new"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Securia">
            <SecuriaProtectedRoute>
              <Layout>
                <NewConsultant />
              </Layout>
            </SecuriaProtectedRoute>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/securia/consultants/edit/:id"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Securia">
            <SecuriaProtectedRoute>
              <Layout>
                <EditConsultant />
              </Layout>
            </SecuriaProtectedRoute>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/securia/consultants/:id"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Securia">
            <SecuriaProtectedRoute>
              <Layout>
                <ConsultantDetails />
              </Layout>
            </SecuriaProtectedRoute>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/securia/clients"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Securia">
            <SecuriaProtectedRoute>
              <Layout>
                <Clients />
              </Layout>
            </SecuriaProtectedRoute>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
     <Route
      path="/securia/clients/new"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Securia">
            <SecuriaProtectedRoute>
              <Layout>
                <NewClient />
              </Layout>
            </SecuriaProtectedRoute>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/securia/clients/:clientId"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Securia">
            <SecuriaProtectedRoute>
              <Layout>
                <ClientDetails />
              </Layout>
            </SecuriaProtectedRoute>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/securia/clients/:clientId/edit"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Securia">
            <SecuriaProtectedRoute>
              <Layout>
                <EditClient />
              </Layout>
            </SecuriaProtectedRoute>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users/:userId"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Admin">
            <Layout>
              <UserDetails />
            </Layout>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users/:userId/edit"
      element={
        <ProtectedRoute>
          <RBACProtectedRoute pageName="Admin">
            <Layout>
              <EditUser />
            </Layout>
          </RBACProtectedRoute>
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
