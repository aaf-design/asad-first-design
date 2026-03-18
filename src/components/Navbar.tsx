"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { SITE_TITLE } from "@/lib/constants";
import { LogIn, LogOut, Home, UserPlus, Upload, Sparkles, Moon, Sun, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { theme, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themes = [
    { name: 'indigo', color: 'bg-indigo-500' },
    { name: 'emerald', color: 'bg-emerald-500' },
    { name: 'rose', color: 'bg-rose-500' },
    { name: 'amber', color: 'bg-amber-500' },
    { name: 'cyan', color: 'bg-cyan-500' },
  ];

  const scrollToGallery = () => {
    const element = document.getElementById('gallery');
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "%") { // Shift + 5
        setShowAdminLogin(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 relative overflow-hidden rounded-xl bg-primary/10 border border-primary/20 transition-all group-hover:scale-110 group-hover:rotate-6 flex items-center justify-center">
              <Sparkles className="text-primary group-hover:text-secondary transition-colors" size={24} />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent transition-all duration-500">
                AAF
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                Premium Design
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-card border border-border text-primary hover:border-primary/50 transition-all flex items-center justify-center"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-full bg-card border border-border text-primary hover:border-primary/50 transition-all flex items-center justify-center"
              >
                <Sparkles size={18} />
              </button>
              
              {showThemeMenu && (
                <div className="absolute top-12 right-0 bg-card border border-border rounded-xl p-2 shadow-2xl z-[60] min-w-[120px] animate-in fade-in zoom-in duration-200">
                  <div className="grid grid-cols-1 gap-1">
                    {themes.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => {
                          setTheme(t.name as any);
                          setShowThemeMenu(false);
                        }}
                        className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
                          theme === t.name ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:bg-primary/5'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${t.color}`} />
                        <span className="text-xs font-medium capitalize">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/" className="text-foreground/70 hover:text-foreground flex items-center space-x-1 transition-colors">
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <button
              onClick={scrollToGallery}
              className="text-foreground/70 hover:text-foreground flex items-center space-x-1 transition-colors"
            >
              <LayoutGrid size={18} />
              <span className="hidden sm:inline">Feed</span>
            </button>

            {isAdmin && (
              <Link href="/upload" className="flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full font-bold hover:bg-primary hover:text-white transition-all animate-pulse shadow-lg shadow-primary/20">
                <Upload size={18} />
                <span className="hidden sm:inline uppercase text-[10px] tracking-widest">Admin Upload</span>
              </Link>
            )}

            {!user ? (
              <div className="flex items-center space-x-2">
                {showAdminLogin ? (
                  <Link
                    href="/login"
                    className="flex items-center space-x-1 bg-card border border-border hover:bg-primary/10 text-foreground px-3 py-1.5 rounded-lg transition-all"
                  >
                    <LogIn size={18} className="text-primary" />
                    <span>Admin Login</span>
                  </Link>
                ) : (
                  <Link
                    href="/signup"
                    className="flex items-center space-x-1 bg-primary hover:opacity-90 text-white px-3 py-1.5 rounded-lg transition-all shadow-lg shadow-primary/20"
                  >
                    <UserPlus size={18} />
                    <span>Join</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-foreground/40 hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="text-foreground/40 hover:text-foreground transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
