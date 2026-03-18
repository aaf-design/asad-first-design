"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Design } from "@/types/design";
import { WHATSAPP_NUMBER, SITE_TITLE } from "@/lib/constants";
import { 
  ArrowLeft, 
  MessageCircle, 
  ShieldCheck, 
  Loader2,
  Lock,
  Clock,
  User,
  Share2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DesignDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBlurred, setIsBlurred] = useState(true);

  useEffect(() => {
    const fetchDesign = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('designs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setDesign(data);
      } catch (error: any) {
        console.error("Error fetching design:", error.message || error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [id, router]);

  // Security: Disable right click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
      <Loader2 className="animate-spin text-primary" size={48} />
      <span className="text-foreground/40 font-black uppercase tracking-widest text-sm">Retrieving Asset...</span>
    </div>
  );

  if (!design) return null;

  const whatsappMessage = encodeURIComponent(`I'm interested in the design: ${design.title}`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/" 
        className="inline-flex items-center space-x-2 text-foreground/40 hover:text-foreground transition-all mb-12 group font-bold uppercase text-xs tracking-widest"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Return to Feed</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Protected Image Section */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-card border border-border shadow-2xl group transition-all duration-500 hover:shadow-primary/10">
            {/* Watermark */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.05] flex flex-wrap content-around justify-around p-8 select-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="text-foreground font-black text-2xl -rotate-45 uppercase tracking-tighter">
                  {SITE_TITLE}
                </span>
              ))}
            </div>

            {/* Transparent Layer */}
            <div className="absolute inset-0 z-30 bg-transparent" />

            {/* Blur Overlay */}
            {isBlurred && (
              <div 
                onClick={() => setIsBlurred(false)}
                className="absolute inset-0 z-40 bg-background/40 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer group transition-all duration-700"
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-primary/10 p-6 rounded-full border border-primary/20 mb-4 group-hover:scale-110 transition-transform"
                >
                  <Lock className="text-primary" size={40} />
                </motion.div>
                <span className="text-foreground font-black text-xl uppercase tracking-widest">Reveal Asset</span>
                <p className="text-foreground/40 text-sm mt-2 font-bold uppercase tracking-tighter">Encrypted Preview</p>
              </div>
            )}

            <img 
              src={design.image_url} 
              alt={design.title}
              className={`w-full h-full object-cover transition-all duration-1000 ${isBlurred ? 'scale-110 blur-2xl' : 'scale-100 blur-0'}`}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />

            <div className="absolute bottom-8 right-8 z-50">
              <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-xl">
                <ShieldCheck size={16} className="text-primary" />
                <span className="text-[10px] font-black text-foreground/60 uppercase tracking-[0.2em]">Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center space-y-10"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                <Clock size={12} />
                <span>Added {new Date(design.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 bg-foreground/5 border border-border px-4 py-1.5 rounded-full text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                <User size={12} />
                <span>By User {design.user_id.slice(0, 6)}</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight leading-none uppercase">
              {design.title}
            </h1>
            
            <p className="text-xl text-foreground/60 leading-relaxed font-medium">
              {design.description}
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-4 bg-primary text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95 text-lg uppercase tracking-widest"
              >
                <MessageCircle size={24} />
                <span>Contact to Buy</span>
              </a>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="flex items-center justify-center space-x-3 bg-card border border-border text-foreground font-black px-10 py-5 rounded-[2rem] transition-all hover:bg-foreground/5 uppercase tracking-widest text-sm"
              >
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>

            <div className="p-8 bg-foreground/5 border border-border rounded-[2.5rem] space-y-4">
              <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Asset Specification</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">
                <li className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-50" />
                  <span>Ultra High Resolution</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-50" />
                  <span>Full Commercial Rights</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-50" />
                  <span>Instant Delivery</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-50" />
                  <span>Lifetime Updates</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
