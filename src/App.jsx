import { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import GlobalToastSetup from "./components/GlobalToastSetup";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { store } from "./store";

// Lazy load page components
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFail = lazy(() => import("./pages/PaymentFail"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const NotFound = lazy(() => import("./pages/NotFound"));
// Service provider pages
const CreateServicePage = lazy(() => import("./pages/CreateServicePage"));
const EditServicePage = lazy(() => import("./pages/EditServicePage"));

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AuthProvider>
          <GlobalToastSetup />
          <Router>
            <ErrorBoundary>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/services/:id" element={<ServiceDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route
                        path="/reset-password/:uidb64/:token"
                        element={<ResetPassword />}
                      />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route
                        path="/admin-dashboard"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/payment-success/:orderId"
                        element={<PaymentSuccess />}
                      />
                      <Route
                        path="/payment-fail/:orderId"
                        element={<PaymentFail />}
                      />
                      <Route
                        path="/payment-cancel/:orderId"
                        element={<PaymentCancel />}
                      />
                      {/* Service Provider Routes */}
                      <Route
                        path="/dashboard/services/new"
                        element={
                          <ProtectedRoute requiredRole="service_provider">
                            <CreateServicePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/services/:id/edit"
                        element={
                          <ProtectedRoute requiredRole="service_provider">
                            <EditServicePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </ErrorBoundary>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </Provider>
  );
}

// Vercel deployment trigger - fixes MIME type issues
export default App;
