import React from 'react';
import { motion } from 'framer-motion';

export default function PartnerCTA() {
  return (
    <section className="relative py-32 bg-[#0A0F1C] overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-[20rem] -left-[10rem] w-[50rem] h-[50rem] rounded-full bg-gradient-to-r from-blue-600 to-transparent blur-[120px] mix-blend-screen" />
        <div className="absolute top-[10rem] -right-[20rem] w-[60rem] h-[60rem] rounded-full bg-gradient-to-l from-indigo-600 to-transparent blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-[#0A0F1C] to-transparent z-10" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] z-0 opacity-50" />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden"
        >
          {/* Inner subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              Ready to Build the Future of <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Education & Employment?
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto font-light">
              Join the StrideNex Partner Network today. No upfront cost for Base Partners. Start earning while ensuring better outcomes for your community.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button 
                onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold shadow-[0_0_30px_-5px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <span>Become a Base Partner</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </motion.button>
              
              <motion.button 
                onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 text-white bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 rounded-xl font-medium transition-all"
              >
                Contact Enterprise Sales
              </motion.button>
            </div>
            
            <p className="mt-12 text-sm text-gray-400 font-medium">
              Have questions? Contact us at <a href="mailto:strategic-planning@stridenex.ai" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 transition-colors">strategic-planning@stridenex.ai</a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
