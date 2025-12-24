"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  BiHome, 
  BiBook, 
  BiFile, 
  BiMessage, 
  BiStar, 
  BiBell,
  BiCog,
  BiHelpCircle,
  BiUser 
} from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session, status } = useSession();

  // Close sidebar when clicking a link on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BiHome },
    { name: 'Categories', href: '/categories', icon: BiBook },
    { name: 'Notes', href: '/upload', icon: BiFile },
    { name: 'Messages', href: '/messages', icon: BiMessage }, 
    { name: 'Reviews', href: '/reviews', icon: BiStar },
    { name: 'Notifications', href: '/notifications', icon: BiBell },
  ];

  const secondaryItems = [
    { name: 'Settings', href: '/settings', icon: BiCog },
    { name: 'Help', href: '/help', icon: BiHelpCircle },
  ];

  return (
    <>
      {/* --- Top Bar --- */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4">
        <div className="flex items-center">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            <div className={`w-6 h-0.5 bg-gray-600 mb-1.5 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-600 mb-1.5 ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-600 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>

          <div className="ml-2 lg:ml-0">
            <h1 className="text-xl font-bold text-gray-800">Mentora Admin</h1>
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <BiBell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="relative">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : session ? (
              <>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center p-0.5 rounded-full border border-gray-200 hover:shadow-sm transition-all"
                >
                  <img
                    src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name || 'User'}&background=0D8ABC&color=fff`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>
                
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {session.user?.name || 'Admin User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <button 
                        onClick={() => signOut()} 
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                      >
                        <FiLogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- Mobile Overlay --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* --- Sidebar --- */}
      <aside 
        className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <nav className="h-full flex flex-col p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    onClick={handleLinkClick}
                    className="flex items-center p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all group"
                  >
                    <Icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          
          <div className="mt-auto border-t border-gray-100 pt-4">
            <ul className="space-y-1">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex items-center p-3 text-gray-500 hover:bg-gray-50 rounded-lg transition-all"
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}