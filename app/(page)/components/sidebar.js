"use client";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  BiHomeAlt, 
  BiGridAlt, 
  BiUserCircle, 
  BiBell,
  BiCog,
  BiHelpCircle,
} from 'react-icons/bi';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname(); // Helpful for active states
  const { data: session, status } = useSession();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BiHomeAlt },
    { name: 'Categories', href: '/categories', icon: BiGridAlt },
    { name: 'Users', href: '/users', icon: BiUserCircle },
    { name: 'Notifications', href: '/notifications', icon: BiBell },
  ];

  const secondaryItems = [
    { name: 'Settings', href: '/settings', icon: BiCog },
    { name: 'Help Center', href: '/help', icon: BiHelpCircle },
  ];

  const isActive = (path) => pathname === path;

  return (
    <>
      {/* --- Header --- */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-600 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-200">
               <span className="text-white font-bold text-lg">Q</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-teal-600">
              Mentora
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Action Icons */}
          <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-all">
            <BiBell size={22} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            {status === 'loading' ? (
              <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
            ) : session ? (
              <>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center p-0.5 rounded-full ring-2 ring-transparent hover:ring-cyan-100 transition-all"
                >
                  <img
                    src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=0891b2&color=fff`}
                    alt="Profile"
                    className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                  />
                </button>
                
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 py-2 overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50/50 mb-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{session.user?.name}</p>
                      </div>
                      <button 
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <FiLogOut /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button onClick={() => signIn()} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all shadow-md shadow-cyan-100">
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- Sidebar --- */}
      <aside 
        className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 
          transition-transform duration-300 ease-in-out px-4 py-6
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <nav className="h-full flex flex-col justify-between">
          <ul className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] px-3 mb-4">Main Menu</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                      active 
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-100' 
                        : 'text-gray-500 hover:bg-cyan-50 hover:text-cyan-600'
                    }`}
                  >
                    <Icon className={`text-xl mr-3 ${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                    <span className="font-semibold text-[15px]">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          
          <div className="space-y-2 pt-6 border-t border-gray-100">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name} className="list-none">
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all"
                  >
                    <Icon className="text-xl mr-3" />
                    <span className="text-[14px] font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}