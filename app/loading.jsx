"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  // Prevents hydration mismatch (fixes your error)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50 w-full h-full">
      <img
        src="/loading.gif"
        alt="Loading..."
        className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
      />
    </div>
  );
}
