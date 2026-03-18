"use client";

import { motion } from "framer-motion";
import { Cookie, Settings, Check, X, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function CookieSettings() {
  const [settings, setSettings] = useState({
    essential: true,
    performance: true,
    advertising: false,
    analytics: true
  });

  const toggleSetting = (key: keyof typeof settings) => {
    if (key === 'essential') return; // Cannot disable essential cookies
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieTypes = [
    {
      id: 'essential',
      title: "Essential Cookies",
      icon: <Check className="text-primary" size={20} />,
      content: "These cookies are necessary for the website to function correctly. They cannot be disabled.",
      status: true
    },
    {
      id: 'performance',
      title: "Performance Cookies",
      icon: <Settings className="text-primary" size={20} />,
      content: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.",
      status: settings.performance
    },
    {
      id: 'analytics',
      title: "Analytics Cookies",
      icon: <Cookie className="text-primary" size={20} />,
      content: "These cookies help us understand how visitors interact with the website by collecting and reporting information anonymously.",
      status: settings.analytics
    },
    {
      id: 'advertising',
      title: "Advertising Cookies",
      icon: <ShieldAlert className="text-primary" size={20} />,
      content: "These cookies are used to deliver more relevant advertisements to you and your interests.",
      status: settings.advertising
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-12 bg-card border border-border p-8 md:p-12 rounded-3xl shadow-2xl transition-colors duration-500"
      >
        <div className="text-center space-y-4">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Cookie className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Cookie <span className="text-primary">Settings</span>
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Manage your cookie preferences and control how we use tracking technologies.
          </p>
        </div>

        <div className="space-y-4">
          {cookieTypes.map((type, index) => (
            <div
              key={type.id}
              className="flex items-center justify-between p-6 bg-background/50 border border-border rounded-2xl hover:border-primary/20 transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-card p-2 rounded-lg border border-border mt-1 group-hover:text-primary transition-colors">
                  {type.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">{type.title}</h3>
                  <p className="text-sm text-foreground/50 max-w-md leading-relaxed">
                    {type.content}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => toggleSetting(type.id as any)}
                disabled={type.id === 'essential'}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                  type.status ? 'bg-primary' : 'bg-slate-700'
                } ${type.id === 'essential' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-all duration-300 shadow-sm ${
                  type.status ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="bg-primary hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all">
            Save My Preferences
          </button>
          <button className="bg-card border border-border hover:border-primary/50 text-foreground/70 px-8 py-3 rounded-xl transition-all">
            Accept All Cookies
          </button>
        </div>
      </motion.div>
    </div>
  );
}
