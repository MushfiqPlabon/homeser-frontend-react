import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { AnimatedRoutes } from "./components";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import GlobalToastSetup from "./components/GlobalToastSetup";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AuthProvider>
          <WebSocketProvider>
            <GlobalToastSetup />
            <Router>
              <ErrorBoundary>
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="grow">
                    <AnimatedRoutes />
                  </main>
                  <Footer />
                </div>
              </ErrorBoundary>
            </Router>
          </WebSocketProvider>
        </AuthProvider>
      </ToastProvider>
    </Provider>
  );
}

// Vercel deployment trigger - fixes MIME type issues
export default App;
