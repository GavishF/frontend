import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 md:py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Nikola" className="h-8 object-contain" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elevated fashion essentials. Timeless silhouettes, modern tailoring, and understated luxury.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition">Shop</Link></li>
              <li><Link to="/about-us" className="text-gray-400 hover:text-white transition">About</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/cart" className="text-gray-400 hover:text-white transition">Cart</a></li>
              <li><a href="/wishlist" className="text-gray-400 hover:text-white transition">Wishlist</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Returns</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="flex-shrink-0 mt-1 text-red-600" />
                <span className="text-gray-400">No 7, Galle Road, Bambalapitiya</span>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="flex-shrink-0 mt-1 text-red-600" />
                <a href="tel:+94774628194" className="text-gray-400 hover:text-white transition">077 462 8194</a>
              </li>
              <li className="flex items-start gap-3">
                <FiMail className="flex-shrink-0 mt-1 text-red-600" />
                <a href="mailto:nikola.collection.lk@gmail.com" className="text-gray-400 hover:text-white transition">nikola.collection.lk@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <FiGlobe className="flex-shrink-0 mt-1 text-red-600" />
                <a href="https://nikola-frontend.onrender.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">nikola-frontend.onrender.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-6">
            <a href="https://instagram.com/nikola_fashion" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition text-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg>
            </a>
            <a href="https://facebook.com/nikola_fashion" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition text-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://twitter.com/nikola_fashion" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition text-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.856 2.905c.052.57.052 1.14 0 1.71 0 6.558-4.99 14.127-14.127 14.127-2.79 0-5.407-.87-7.6-2.35.4.05.81.05 1.21 0 2.32 0 4.44-.73 6.17-2.05-2.19-.04-4.08-1.47-4.73-3.45.29.04.6.04.91.02-2.3-.47-4.04-2.49-4.04-4.9v-.06c.68.4 1.47.65 2.31.68-1.35-.9-2.24-2.44-2.24-4.18 0-.92.25-1.78.69-2.52 2.49 3.06 6.22 5.08 10.43 5.32-.1-.5-.15-1.01-.15-1.53 0-3.66 2.96-6.63 6.62-6.63 1.9 0 3.61.79 4.82 2.05 1.49-.3 2.91-.87 4.17-1.64-.49 1.51-1.54 2.77-2.9 3.57 1.33-.16 2.6-.52 3.78-1.05-.88 1.32-1.98 2.48-3.25 3.41z"/></svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Nikola Fashion. All rights reserved.</p>
            <div className="mt-2 flex justify-center gap-4">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
