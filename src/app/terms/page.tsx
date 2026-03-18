"use client";

import { motion } from "framer-motion";
import { Scale, ShoppingBag, Download, Info, AlertCircle } from "lucide-react";

export default function TermsOfService() {
  const terms = [
    {
      title: "Use of Designs",
      icon: <Download className="text-secondary" size={24} />,
      content: "All designs purchased from this store are for personal or commercial use as specified at the time of purchase. You may not resell the designs as individual assets."
    },
    {
      title: "Purchases",
      icon: <ShoppingBag className="text-secondary" size={24} />,
      content: "Purchases are made via WhatsApp. By initiating a purchase, you agree to provide accurate information and follow the payment process as instructed by the administrator."
    },
    {
      title: "Intellectual Property",
      icon: <Scale className="text-secondary" size={24} />,
      content: "All intellectual property rights for the designs belong to the administrator until they are transferred to the buyer upon full payment and according to the license terms."
    },
    {
      title: "Refund Policy",
      icon: <AlertCircle className="text-secondary" size={24} />,
      content: "Due to the digital nature of the products, all sales are final. Refunds are only issued in special circumstances at the administrator's discretion."
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
            Terms of <span className="text-secondary">Service</span>
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
        </div>

        <div className="grid gap-8">
          {terms.map((term, index) => (
            <motion.div
              key={term.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-secondary/10 p-3 rounded-xl">
                  {term.icon}
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-foreground">{term.title}</h2>
                  <p className="text-foreground/60 leading-relaxed">{term.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-8 text-center space-y-4">
          <Info className="mx-auto text-secondary" size={32} />
          <h3 className="text-xl font-bold text-foreground">Need clarification?</h3>
          <p className="text-foreground/60 max-w-lg mx-auto">
            By using our website, you signify your acceptance of these terms. If you do not agree, please do not use our site.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
