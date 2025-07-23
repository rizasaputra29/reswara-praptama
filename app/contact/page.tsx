"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface ContactData {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export default function Contact() {
  const [content, setContent] = useState<ContactData | null>(null);

  useEffect(() => {
    // Mengambil data dari API baru
    fetch('/api/content/contact')
      .then(res => res.json())
      .then(data => setContent(data));
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main>
      <Navbar />
      <div>
        {/* Hero Section */}
        <section className="relative rounded-b-2xl text-white py-24 md:py-48"
      style={{
        backgroundImage: 'linear-gradient(to right, #183449 0%, #47525B 25%, #0C2A46 48%, #213950 66%, #0C1824 89%)'
      }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                {content.title}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {content.subtitle}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-white ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="bg-white rounded-3xl border-x border-y shadow-lg p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Contact Info */}
                  <div className="p-8 space-y-10">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-gray-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                        <p className="text-gray-600">{content.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-gray-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                        <p className="text-gray-600">{content.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-gray-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                        <p className="text-gray-600">{content.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-gray-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Hours</h3>
                        <p className="text-gray-600">{content.hours}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="border-x border-y rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Send us a message
                    </h3>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                          </label>
                          <Input placeholder="Your name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <Input type="email" placeholder="your.email@example.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <Input placeholder="Message subject" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <Textarea rows={6} placeholder="Tell us about your project..." />
                      </div>
                      <Button className="w-full bg-gray-600 hover:bg-gray-700">
                        Send Message
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}