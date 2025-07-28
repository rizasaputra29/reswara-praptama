"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getLinkClasses = (href: string) => {
    const baseClasses = "relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap";
    const activeHoverBgClasses = scrolled ? 'bg-black/10 backdrop-blur-sm' : 'bg-white/20 backdrop-blur-sm';
    const activeHoverTextColor = scrolled ? 'text-black' : 'text-white';
    const defaultTextColor = scrolled ? 'text-gray-600' : 'text-gray-300';

    if (isActive(href)) {
      return `${baseClasses} ${activeHoverBgClasses} ${activeHoverTextColor}`;
    } else {
      return `${baseClasses} ${defaultTextColor} hover:${activeHoverBgClasses} hover:${activeHoverTextColor}`;
    }
  };

  return (
    <nav className={`fixed py-2 top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      scrolled
        ? 'bg-white shadow-sm'
        : 'backdrop-blur-sm border-b border-white/20' // Added border-b border-white/50 here
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Conditional rendering based on 'scrolled' state */}
          <Link href="/" className="flex items-center">
            {scrolled ? (
              <Image
                src="/images/logo-merah.svg"
                alt="Reswara Logo Merah"
                width={100}
                height={100}
                priority
              />
            ) : (
              <div className='text-white text-2xl font-bold'>CV Reswara Praptama</div>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getLinkClasses(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors duration-200 ${
                scrolled ? 'text-gray-600 hover:text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={`md:hidden py-4 transition-colors duration-300 ${
            scrolled ? 'border-t border-gray-200' : 'border-t border-slate-800'
          }`}>
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getLinkClasses(item.href)}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;