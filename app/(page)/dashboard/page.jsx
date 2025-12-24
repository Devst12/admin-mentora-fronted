// pages/index.js
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="py-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
      </header>
      
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <p className="text-xl text-gray-600 max-w-md text-center">
          A clean and simple Next.js page
        </p>
      </main>
      
      <footer className="py-4 text-center border-t border-gray-200">
        <span className="text-gray-500">Next.js + Tailwind</span>
      </footer>
    </div>
  );
}