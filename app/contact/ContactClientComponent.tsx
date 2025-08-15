// app/contact/ContactClientComponent.tsx
"use client";

import { useRef, useState } from 'react';
import emailjs from 'emailjs-com';

import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import WaveSeparator from '@/components/WaveSeperator';

// Tipe data untuk konten kontak
interface ContactContent {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface ContactClientComponentProps {
    contactContent: ContactContent;
}

export default function ContactClientComponent({ contactContent }: ContactClientComponentProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formRef.current) {
      try {
        await emailjs.sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          formRef.current,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        );

        toast({
          title: "Success",
          description: "Your message has been sent successfully!",
        });
        formRef.current.reset();
      } catch (error) {
        console.error("EmailJS error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send your message. Please try again later.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      <Toaster />
      {/* Hero Section */}
      <section className="relative text-white py-12 md:py-28"
      style={{
        backgroundImage: 'linear-gradient(110deg, #0734B6 0%, #85B9E9 24%, #2C71B2 48%, #3979B2 66%, #0B3055 89%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-9 mb-3">
              {contactContent.title}
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              {contactContent.subtitle}
            </p>
          </AnimatedSection>
        </div>
        
        {/* Contact Section */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-2">
            <AnimatedSection>
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {/* Contact Info */}
                  <div className="p-8 space-y-10 bg-gray-700/5 backdrop-blur-2xl rounded-2xl mx-4 border-white border-x border-y">
                    <h3 className="text-2xl font-bold text-white">
                      Contact Information
                    </h3>
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-white mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100">Address</h3>
                        <p className="text-white">{contactContent.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-white mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">Phone</h3>
                        <p className="text-white">{contactContent.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-white mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">Email</h3>
                        <p className="text-white">{contactContent.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-white mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">Hours</h3>
                        <p className="text-white">{contactContent.hours}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="bg-gray-500/20 backdrop-blur-2xl rounded-2xl mx-4 border-white border-x border-y p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">
                      Send us a message
                    </h3>
                    <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Name
                          </label>
                          <Input placeholder="Your name" name="user_name" className='bg-transparent placeholder:text-white text-white' />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Email
                          </label>
                          <Input type="email" name="user_email" placeholder="your.email@example.com" className='bg-transparent placeholder:text-white text-white' />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Subject
                        </label>
                        <Input placeholder="Message subject" name="subject" className='bg-transparent placeholder:text-white text-white' />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Message
                        </label>
                        <Textarea rows={6} placeholder="Tell us about your project..." name="message" className='bg-transparent placeholder:text-white text-white' />
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <WaveSeparator/>
          </div>
        </section>
        </section>
      </div>
  );
}