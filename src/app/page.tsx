"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Design } from "@/types/design";
import DesignCard from "@/components/DesignCard";
import { LayoutGrid, Search, Loader2, Sparkles, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('designs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDesigns(data || []);
      } catch (error: any) {
        console.error("Error fetching designs:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-border/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 space-y-8 max-w-5xl"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/20 px-6 py-2 rounded-full text-primary text-sm font-black tracking-[0.3em] uppercase"
          >
            <Sparkles size={16} />
            <span>Digital Design Hub</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-foreground leading-[0.9]">
            CREATIVE <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x">ECOSYSTEM</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/40 max-w-2xl mx-auto leading-relaxed font-medium">
            A high-performance marketplace for modern creators. Upload, share, and discover elite digital assets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAdmin ? (
              <Link 
                href="/upload"
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 flex items-center space-x-3"
              >
                <Plus size={20} />
                <span>Share Design</span>
              </Link>
            ) : !user && (
              <Link 
                href="/signup"
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 flex items-center space-x-3"
              >
                <Plus size={20} />
                <span>Join Now</span>
              </Link>
            )}
            <button 
              onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-card border border-border text-foreground px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-foreground/5 transition-all"
            >
              Explore Feed
            </button>
          </div>
        </motion.div>
      </section>

      {/* Gallery Header */}
      <section id="gallery" className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Recent Drops</h2>
              <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">{designs.length} Assets Live</p>
            </div>
          </div>

          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl pl-12 pr-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[600px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={24} />
            </div>
            <span className="text-foreground/40 font-black uppercase tracking-widest">Syncing with database...</span>
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6 text-center">
            <div className="w-24 h-24 bg-card border border-border rounded-[2.5rem] flex items-center justify-center mb-4">
              <LayoutGrid className="text-foreground/10" size={40} />
            </div>
            <h3 className="text-3xl font-black text-foreground uppercase">No assets found</h3>
            <p className="text-foreground/40 max-w-sm font-medium">Check back later for new premium designs.</p>
            {isAdmin && <Link href="/upload" className="text-primary font-black uppercase tracking-widest hover:underline pt-4">Upload Now &rarr;</Link>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredDesigns.map((design) => (
                <DesignCard 
                  key={design.id} 
                  design={design} 
                  onDelete={(id) => setDesigns(prev => prev.filter(d => d.id !== id))}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
