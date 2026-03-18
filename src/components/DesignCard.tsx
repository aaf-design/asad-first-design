"use client";

import Link from "next/link";
import { Design } from "@/types/design";
import { Eye, Clock, User, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface DesignCardProps {
  design: Design;
  onDelete?: (id: string) => void;
}

export default function DesignCard({ design, onDelete }: DesignCardProps) {
  const { isAdmin } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this design?")) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('designs')
        .delete()
        .eq('id', design.id);

      if (error) throw error;
      onDelete?.(design.id);
    } catch (error: any) {
      console.error("Error deleting design:", error.message);
      alert("Failed to delete: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(design.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative bg-card border border-border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-background">
        {/* Protection Blur Overlay */}
        <div className="absolute inset-0 bg-background/5 backdrop-blur-[1px] z-10 group-hover:backdrop-blur-0 transition-all duration-700" />
        
        <img 
          src={design.image_url} 
          alt={design.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 flex flex-col items-center justify-center">
          <Link 
            href={`/design/${design.id}`}
            className="flex items-center space-x-2 bg-primary text-white px-8 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/40 transform translate-y-4 group-hover:translate-y-0"
          >
            <Eye size={20} />
            <span>View Asset</span>
          </Link>
        </div>

        {/* Date Badge */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 bg-destructive/80 backdrop-blur-md text-white rounded-full hover:bg-destructive transition-all active:scale-90"
              title="Delete Design"
            >
              {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          )}
          <div className="flex items-center space-x-1.5 bg-background/80 backdrop-blur-md border border-border px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground/60">
            <Clock size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {design.title}
          </h3>
          <div className="flex items-center space-x-2 text-xs text-foreground/40 font-bold uppercase tracking-tighter">
            <User size={12} className="text-primary" />
            <span>Designer ID: {design.user_id.slice(0, 8)}...</span>
          </div>
        </div>
        
        <p className="text-sm text-foreground/60 line-clamp-2 leading-relaxed font-medium">
          {design.description}
        </p>
      </div>
    </motion.div>
  );
}
