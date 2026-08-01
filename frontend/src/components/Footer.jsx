import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-amazon-light_blue text-white mt-12 text-xs">
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="w-full bg-slate-700 hover:bg-slate-600 py-3 text-center font-medium text-xs tracking-wide transition cursor-pointer"
      >
        Back to top
      </button>

      {/* Footer Links Columns */}
      <div className="max-w-7xl mx-auto py-10 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-sm mb-3">Get to Know Us</h3>
          <ul className="space-y-2 text-gray-300 text-xs">
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">About Amazon</a></li>
            <li><a href="#" className="hover:underline">Investor Relations</a></li>
            <li><a href="#" className="hover:underline">Amazon Devices</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-3">Make Money with Us</h3>
          <ul className="space-y-2 text-gray-300 text-xs">
            <li><a href="#" className="hover:underline">Sell products on Amazon</a></li>
            <li><a href="#" className="hover:underline">Sell on Amazon Business</a></li>
            <li><a href="#" className="hover:underline">Sell apps on Amazon</a></li>
            <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
            <li><a href="#" className="hover:underline">Advertise Your Products</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-3">Amazon Payment Products</h3>
          <ul className="space-y-2 text-gray-300 text-xs">
            <li><a href="#" className="hover:underline">Amazon Business Card</a></li>
            <li><a href="#" className="hover:underline">Shop with Points</a></li>
            <li><a href="#" className="hover:underline">Reload Your Balance</a></li>
            <li><a href="#" className="hover:underline">Amazon Currency Converter</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-3">Let Us Help You</h3>
          <ul className="space-y-2 text-gray-300 text-xs">
            <li><Link to="/profile" className="hover:underline">Amazon and COVID-19</Link></li>
            <li><Link to="/profile" className="hover:underline">Your Account</Link></li>
            <li><Link to="/orders" className="hover:underline">Your Orders</Link></li>
            <li><a href="#" className="hover:underline">Shipping Rates & Policies</a></li>
            <li><a href="#" className="hover:underline">Returns & Replacements</a></li>
            <li><a href="#" className="hover:underline">Help & Support</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Branding Bar */}
      <div className="border-t border-gray-700 bg-amazon-blue py-6 text-center text-gray-400 text-xs">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl font-bold text-white">amazon<span className="text-amazon-gold">.clone</span></span>
        </div>
        <p>© 2026 Amazon Clone Production Demo. Built with React 19, Django 5 & MySQL 8.</p>
      </div>
    </footer>
  );
};

export default Footer;
