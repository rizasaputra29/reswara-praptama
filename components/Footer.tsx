// components/Footer.tsx
import { getContactContent, getServicesPageContent } from '@/lib/data';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';

const Footer = async () => {
  const contactInfo = await getContactContent();
  const servicesContent = await getServicesPageContent();

  return (
    <footer className="bg-white text-gray-900 relative py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/logo-merah.svg" // Assuming you have a black version of the logo
                alt="Reswara Logo Hitam"
                width={150}
                height={40}
                priority
              />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Solusi terintegrasi untuk kebutuhan konstruksi dan arsitektur dengan standar kualitas terbaik.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-600 hover:text-blue-500 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-500 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-600 hover:text-blue-500 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-600 hover:text-blue-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/" className="hover:text-blue-500 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-blue-500 transition-colors">About</a></li>
              <li><a href="/services" className="hover:text-blue-500 transition-colors">Services</a></li>
              <li><a href="/portfolio" className="hover:text-blue-500 transition-colors">Portfolio</a></li>
              <li><a href="/contact" className="hover:text-blue-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-600">
              {servicesContent?.items.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <span className="hover:text-blue-500 transition-colors">{service.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                <span className="text-sm">{contactInfo?.address || 'Data not available'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-600" />
                <span className="text-sm">{contactInfo?.phone || 'Data not available'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-600" />
                <span className="text-sm">{contactInfo?.email || 'Data not available'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            © 2025 CV Reswara Praptama. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;