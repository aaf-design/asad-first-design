"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, Bell } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Eye className="text-primary" size={24} />,
      content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, and WhatsApp contact details."
    },
    {
      title: "How We Use Your Information",
      icon: <Shield className="text-primary" size={24} />,
      content: "We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about your orders and promotional offers."
    },
    {
      title: "Data Security",
      icon: <Lock className="text-primary" size={24} />,
      content: "We implement a variety of security measures to maintain the safety of your personal information. Your data is stored securely using Firebase's encrypted infrastructure."
    },
    {
      title: "Third-Party Services",
      icon: <Server className="text-primary" size={24} />,
      content: "We use Firebase (Google) for authentication, database, and storage services. These third-party providers have their own privacy policies regarding how they handle your data."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  {section.icon}
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                  <p className="text-foreground/60 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
          <Bell className="mx-auto text-primary" size={32} />
          <h3 className="text-xl font-bold text-foreground">Questions about our policy?</h3>
          <p className="text-foreground/60 max-w-lg mx-auto">
            If you have any questions regarding this privacy policy, you may contact us using the information in the footer.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
