import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-20 h-20 bg-amazon-yellow/20 rounded-full flex items-center justify-center mx-auto text-amazon-orange">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">SORRY</h1>
        <p className="text-sm font-semibold text-gray-700">
          we couldn't find that page
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Try searching or go to Amazon Clone's home page.
        </p>
        <Link
          to="/"
          className="amazon-btn-primary inline-flex items-center gap-2 text-xs py-2 px-6 shadow font-bold"
        >
          <Home className="w-4 h-4" /> Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
