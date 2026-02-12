'use client';

import React from 'react';
import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from 'lucide-react';

/**
 * Footer Component
 * Links, contact info, social media, newsletter signup
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-road-grey-900 text-white">
      {/* Main Footer Content */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1 sm:col-span-1 flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-mechanic-blue to-reliable-red rounded-lg flex items-center justify-center font-montserrat font-bold text-lg">
                AP
              </div>
              <div>
                <h3 className="text-h4 font-montserrat font-bold">AutoParts</h3>
                <p className="text-body-sm text-road-grey-300">Kenya</p>
              </div>
            </div>
            <p className="text-body-sm text-road-grey-300 mb-6">
              Quality automotive spare parts. Fast delivery. Trusted mechanics.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 justify-center sm:justify-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-mechanic-blue rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-mechanic-blue rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-mechanic-blue rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-h4 font-montserrat font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 flex flex-col items-center sm:items-start">
              <li>
                <Link
                  href="/search"
                  className="text-body-sm text-road-grey-300 hover:text-white inline-flex items-center gap-1 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Browse Parts
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-body-sm text-road-grey-300 hover:text-white inline-flex items-center gap-1 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-body-sm text-road-grey-300 hover:text-white inline-flex items-center gap-1 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-body-sm text-road-grey-300 hover:text-white inline-flex items-center gap-1 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center sm:text-left">
            <h4 className="text-h4 font-montserrat font-bold mb-4">Support</h4>
            <ul className="space-y-3 flex flex-col items-center sm:items-start">
              <li>
                <Link
                  href="#faq"
                  className="text-body-sm text-road-grey-300 hover:text-white inline-flex items-center gap-1 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#shipping"
                  className="text-body-sm text-road-grey-300 hover:text-white inline-flex items-center gap-1 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="#returns"
                  className="text-body-sm text-road-grey-300 hover:text-white inline-flex items-center gap-1 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-body-sm text-road-grey-300 hover:text-white inline-flex items-center gap-1 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h4 className="text-h4 font-montserrat font-bold mb-4">Contact</h4>
            <ul className="space-y-4 flex flex-col items-center sm:items-start">
              <li className="flex justify-center sm:justify-start items-start gap-3 text-body-sm text-road-grey-300">
                <Phone className="w-5 h-5 text-mechanic-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">+254 701 000 000</p>
                  <p className="text-road-grey-400">Mon-Fri 8AM-6PM</p>
                </div>
              </li>
              <li className="flex justify-center sm:justify-start items-start gap-3 text-body-sm text-road-grey-300">
                <Mail className="w-5 h-5 text-mechanic-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">support@autopartskenya.co.ke</p>
                  <p className="text-road-grey-400">We reply in 24 hours</p>
                </div>
              </li>
              <li className="flex justify-center sm:justify-start items-start gap-3 text-body-sm text-road-grey-300">
                <MapPin className="w-5 h-5 text-mechanic-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Nairobi, Kenya</p>
                  <p className="text-road-grey-400">Serving all of Kenya</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <p className="text-body-sm text-road-grey-400 text-center sm:text-left">
            © {currentYear} AutoParts Kenya. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-6 text-body-sm text-road-grey-400 justify-center sm:justify-end">
            <Link href="#privacy" className="hover:text-white transition-colors whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-white transition-colors whitespace-nowrap">
              Terms of Service
            </Link>
            <Link href="#cookies" className="hover:text-white transition-colors whitespace-nowrap">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
