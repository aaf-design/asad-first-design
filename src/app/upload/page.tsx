"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Upload, Loader2, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserUploadPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, isAdmin, authLoading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFile = () => {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !imageFile) return;

    setUploading(true);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('designs')
        .getPublicUrl(filePath);

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from('designs')
        .insert([
          {
            title,
            description,
            image_url: publicUrl,
            user_id: user.id,
          },
        ]);

      if (dbError) throw dbError;

      router.push("/");
    } catch (error: any) {
      console.error("Upload failed:", error.message);
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <Link href="/" className="inline-flex items-center space-x-2 text-foreground/60 hover:text-foreground transition-colors">
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl transition-colors duration-500">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-black text-foreground">Upload Your <span className="text-primary">Design</span></h1>
            <p className="text-foreground/60">Share your digital assets with the community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80 block uppercase tracking-wider">Design File</label>
              {!previewUrl ? (
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="design-upload"
                    required
                  />
                  <label
                    htmlFor="design-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-12 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group"
                  >
                    <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="text-primary" size={32} />
                    </div>
                    <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Choose an image</span>
                    <span className="text-sm text-foreground/40 mt-1">PNG, JPG, SVG up to 10MB</span>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border aspect-video bg-background group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80 block uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your design a catchy title"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80 block uppercase tracking-wider">Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your creative process or use cases..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !imageFile}
              className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-white font-black py-4 rounded-xl flex items-center justify-center space-x-3 transition-all shadow-lg shadow-primary/20 text-lg uppercase tracking-widest"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Uploading Design...</span>
                </>
              ) : (
                <>
                  <Upload size={24} />
                  <span>Publish Design</span>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
