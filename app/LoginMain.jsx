"use client";

import { signIn, useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loading from "./loading";

function LoginMain() {
  const { status } = useSession();
  const router = useRouter();

  function login(provider) {
    if (provider === "google") {
      signIn(provider, { callbackUrl: "/dashboard" });
    } else {
      toast.error("This login feature is not available yet.");
    }
  }

  if (status === "authenticated") {
    router.push("/");
  }

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Mentora</h1>
          <p className="text-gray-600 text-sm">
            Sign in 
          </p>
        </div>

        {/* Google Login Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => login("google")}
          className="w-full flex items-center justify-center px-6 py-4 bg-black hover:bg-gray-900 text-white rounded-2xl font-semibold transition-all duration-200 shadow-md"
        >
          <img
            className="w-5 h-5 mr-3"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          Continue with Google
        </motion.button>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} mentora. All rights reserved.
          </p>
        </div>
      </motion.div>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}

export default LoginMain;
