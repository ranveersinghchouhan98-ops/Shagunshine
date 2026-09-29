import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
      <div className="font-serif text-7xl font-bold text-maroon-900">404</div>
      <h2 className="font-serif text-2xl font-bold text-stone-900">Page Not Found</h2>
      <p className="text-xs text-stone-500 max-w-sm">
        The luxury formulation or page you are looking for has been moved or does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider"
      >
        <span>Return to Home</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
