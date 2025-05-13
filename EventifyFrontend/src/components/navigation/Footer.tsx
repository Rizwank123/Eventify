import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <CalendarDays className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Eventify</span>
            </Link>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <p>&copy; {currentYear} Eventify. All rights reserved.</p>
            <span className="inline-flex items-center ml-2">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> by Mohammad Rizwan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;