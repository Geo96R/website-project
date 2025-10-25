'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Terminal() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="border border-tron-cyan border-glow p-12 bg-tron-dark/50 backdrop-blur-sm max-w-2xl text-center space-y-6"
      >
        <h1 className="text-4xl font-bold text-tron-cyan text-glow">TERMINAL</h1>
        <div className="h-px bg-gradient-to-r from-transparent via-tron-cyan to-transparent" />
        <p className="text-xl text-gray-300">Coming Soon</p>
        <p className="text-sm text-gray-400">Interactive terminal experience in development...</p>
        
        <Link 
          href="/"
          className="inline-block mt-8 px-6 py-3 border border-tron-cyan text-tron-cyan hover:bg-tron-cyan hover:text-black transition-all duration-300"
        >
          &lt; BACK TO HOME
        </Link>
      </motion.div>
    </div>
  );
}
