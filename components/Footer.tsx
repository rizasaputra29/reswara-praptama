"use client";

import { Building, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className=" text-white relative"
    style={{
        backgroundImage: 'linear-gradient(to right, #183449 0%, #47525B 25%, #0C2A46 48%, #213950 66%, #0C1824 89%)'
      }}
    >
      {/* Rounded SVG di bagian atas footer */}
      <div className="absolute top-0 left-0 w-full z-0">
        <svg
          className="block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100" // Sesuaikan tinggi viewBox sesuai kedalaman lengkungan
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff" // Warna latar belakang bagian di atas footer (putih)
            fillOpacity="1"
            d="M0,100 C360,0 1080,0 1440,100 L1440,0 L0,0 Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10"> {/* Tambahkan 'relative z-10' pada konten agar berada di atas SVG */}
        {/* Tambahkan padding-top untuk memastikan konten footer tidak tertutup oleh SVG */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-24"> {/* Sesuaikan 'pt-24' sesuai tinggi SVG dan desain */}
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
            <Image
                src="/images/logo-putih.svg" // Logo when at the top (e.g., on dark background)
                alt="Reswara Logo Putih"
                width={180} // Sesuaikan lebar sesuai kebutuhan desain
                height={180} // Sesuaikan tinggi sesuai kebutuhan desain
                priority // Optimal untuk logo di navbar
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Solusi terintegrasi untuk kebutuhan konstruksi dan arsitektur dengan standar kualitas terbaik.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="/portfolio" className="hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><span className="hover:text-white transition-colors">Architectural Design</span></li>
              <li><span className="hover:text-white transition-colors">Construction Permits</span></li>
              <li><span className="hover:text-white transition-colors">Project Supervision</span></li>
              <li><span className="hover:text-white transition-colors">Technical Studies</span></li>
              <li><span className="hover:text-white transition-colors">Land Acquisition</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5" />
                <span className="text-sm">Jl. Sudirman No. 123, Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5" />
                <span className="text-sm">+62 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5" />
                <span className="text-sm">info@techconstruct.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center relative z-10"> {/* Pastikan z-index untuk divider juga */}
          <p className="text-gray-400 text-sm">
            © 2024 TechConstruct. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;