import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main grid container - reduced py padding from 12 to 8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info - reduced space-y from 4 to 3 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">HealthCare</h3>
            <p className="text-sm">
              Quality healthcare with compassion since 2000.
            </p>
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <span>📞</span>
                <span>Emergency: (555) 123-4567</span>
              </p>
              <p className="flex items-center gap-2">
                <span>✉️</span>
                <span>contact@healthcare.com</span>
              </p>
            </div>
          </div>

          {/* Quick Links - more compact spacing */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition-colors">Doctors</Link></li>
              <li className="hover:text-white transition-colors">Appointments</li>
            </ul>
          </div>

          {/* Services - more compact spacing */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Our Services</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/doctors?specialization=Cardiologist" className="hover:text-white transition-colors">Primary Care</Link></li>
              <li><Link to="/doctors?specialization=Pediatrician" className="hover:text-white transition-colors">Emergency Care</Link></li>
              <li><Link to="/doctors?specialization=Dermatologist" className="hover:text-white transition-colors">Diagnostics</Link></li>
              <li><Link to="/doctors?specialization=Neurologist" className="hover:text-white transition-colors">Specialist Care</Link></li>
            </ul>
          </div>

          {/* Opening Hours - more compact layout */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Opening Hours</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span>8:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar - reduced padding */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
          <p>© 2024 HealthCare. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;