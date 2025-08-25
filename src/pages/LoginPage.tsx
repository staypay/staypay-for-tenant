import React from "react";
import { motion } from "framer-motion";
import { LoginButton } from "@components/auth/LoginButton";
import { useAuth } from "@hooks/useAuth";
import { useRequireAuth } from "@hooks/useRequireAuth";
import { MobileContainer } from "@/components/layout/MobileContainer";

export const LoginPage: React.FC = () => {
  const { error, clearError } = useAuth();

  // Redirect to home if already authenticated
  useRequireAuth({ redirectTo: "/", redirectIfAuthenticated: true });

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <MobileContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        <div className="space-y-3">
          <LoginButton provider="google" fullWidth size="lg" />
          <LoginButton provider="kakao" fullWidth size="lg" />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </MobileContainer>
  );
};
