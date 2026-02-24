"use client";

import { motion } from "framer-motion";
import { Button } from "./button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";

interface PathwayCardProps {
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  color: string;
  image: string;
  features: string[];
  outcome: string;
  cta: string;
  index: number;
}

export default function PathwayCard({
  title,
  tagline,
  description,
  icon: Icon,
  color,
  image,
  features,
  outcome,
  cta,
  index
}: PathwayCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      viewport={{ once: true }}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
    >
      <div className="flex-1">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${color} text-white text-sm font-bold mb-6`}>
          <Icon className="w-4 h-4" />
          {title}
        </div>
        
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
          {tagline}
        </h3>
        
        <p className="text-lg text-slate-600 mb-6">
          {description}
        </p>

        <div className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-slate-700">{feature}</span>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-xl mb-6">
          <p className="text-sm font-medium text-slate-800">
            <span className="font-bold text-primary">Outcome:</span> {outcome}
          </p>
        </div>

        <Button variant="accent" className="btn-cta-small">
          {cta}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 relative">
        <div className={`aspect-square rounded-3xl bg-gradient-to-br ${color} p-1`}>
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-accent/20 to-orange-600/20 rounded-full blur-2xl"></div>
      </div>
    </motion.div>
  );
}