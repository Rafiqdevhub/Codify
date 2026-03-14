import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const CodeReview = lazy(() => import("./pages/CodeReview"));
const AiChat = lazy(() => import("./pages/AiChat"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppRouteFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900">
    <p className="text-sm text-gray-200">Loading...</p>
  </div>
);

const AppBootstrap: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<AppRouteFallback />}>
        <Routes>
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/review" element={<CodeReview />} />
          <Route path="/chat" element={<AiChat />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppBootstrap />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
