import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import {
  Routes as ReactRouterRoutes,
  Route,
  useLocation,
} from "react-router-dom";
import { PageTransition, ProtectedRoute } from "./";

// Lazy load page components
const Home = lazy(() => import("../pages/Home"));
const Services = lazy(() => import("../pages/Services"));
const ServiceDetail = lazy(() => import("../pages/ServiceDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const PaymentSuccess = lazy(() => import("../pages/PaymentSuccess"));
const PaymentFail = lazy(() => import("../pages/PaymentFail"));
const PaymentCancel = lazy(() => import("../pages/PaymentCancel"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const NotFound = lazy(() => import("../pages/NotFound"));
// Service provider pages
const CreateServicePage = lazy(() => import("../pages/CreateServicePage"));
const EditServicePage = lazy(() => import("../pages/EditServicePage"));

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
          </div>
        }
      >
        <ReactRouterRoutes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/services"
            element={
              <PageTransition>
                <Services />
              </PageTransition>
            }
          />
          <Route
            path="/services/:id"
            element={
              <PageTransition>
                <ServiceDetail />
              </PageTransition>
            }
          />
          <Route
            path="/cart"
            element={
              <PageTransition>
                <Cart />
              </PageTransition>
            }
          />
          <Route
            path="/checkout"
            element={
              <PageTransition>
                <Checkout />
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/register"
            element={
              <PageTransition>
                <Register />
              </PageTransition>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageTransition>
                <ForgotPassword />
              </PageTransition>
            }
          />
          <Route
            path="/reset-password/:uidb64/:token"
            element={
              <PageTransition>
                <ResetPassword />
              </PageTransition>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <PageTransition>
                  <AdminDashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success/:orderId"
            element={
              <PageTransition>
                <PaymentSuccess />
              </PageTransition>
            }
          />
          <Route
            path="/payment-fail/:orderId"
            element={
              <PageTransition>
                <PaymentFail />
              </PageTransition>
            }
          />
          <Route
            path="/payment-cancel/:orderId"
            element={
              <PageTransition>
                <PaymentCancel />
              </PageTransition>
            }
          />
          {/* Service Provider Routes */}
          <Route
            path="/dashboard/services/new"
            element={
              <ProtectedRoute requiredRole="service_provider">
                <PageTransition>
                  <CreateServicePage />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/services/:id/edit"
            element={
              <ProtectedRoute requiredRole="service_provider">
                <PageTransition>
                  <EditServicePage />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <PageTransition>
                <Unauthorized />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </ReactRouterRoutes>
      </Suspense>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
