import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">Scholarship Portal</span>
            </div>
            <p className="text-gray-300 mb-4">
              Empowering students to achieve their educational dreams through comprehensive scholarship management and application tracking.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@scholarship.edu</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span className="text-sm">(555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/scholarships" className="text-gray-300 hover:text-green-400 transition-colors">
                  Available Scholarships
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-gray-300 hover:text-green-400 transition-colors">
                  Apply Now
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-gray-300 hover:text-green-400 transition-colors">
                  Track Application
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-300 hover:text-green-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Application Guidelines
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Scholarship Portal. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm mt-2 md:mt-0">
              <MapPin className="h-4 w-4" />
              <span>123 Education Ave, Learning City, LC 12345</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
