import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

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
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
