"use client"

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  MessageCircle, 
  Check, 
  User,
  ChevronRight
} from 'lucide-react';

export default function About() {
  const [isWhatsAppLoaded, setIsWhatsAppLoaded] = useState(false);

  // Function to load WhatsApp chat widget
  useEffect(() => {
    // Make sure we're in the browser environment
    if (typeof window !== 'undefined') {
      // Create a direct WhatsApp floating button
      const whatsappContainer = document.createElement('div');
      whatsappContainer.id = 'whatsapp-consultation-button';
      whatsappContainer.style.position = 'fixed';
      whatsappContainer.style.bottom = '20px';
      whatsappContainer.style.right = '20px';
      whatsappContainer.style.zIndex = '1000';
      
      // Create button element
      const whatsappButton = document.createElement('a');
      whatsappButton.href = `https://wa.me/962788862798?text=${encodeURIComponent('I would like to schedule a consultation with Lumera Hospital.')}`;
      whatsappButton.target = '_blank';
      whatsappButton.rel = 'noopener noreferrer';
      whatsappButton.style.display = 'flex';
      whatsappButton.style.alignItems = 'center';
      whatsappButton.style.justifyContent = 'center';
      whatsappButton.style.backgroundColor = '#25D366';
      whatsappButton.style.color = 'white';
      whatsappButton.style.width = '60px';
      whatsappButton.style.height = '60px';
      whatsappButton.style.borderRadius = '50%';
      whatsappButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
      whatsappButton.style.transition = 'all 0.3s ease';
      whatsappButton.style.cursor = 'pointer';
      
      // Create WhatsApp icon
      const whatsappIcon = document.createElement('div');
      whatsappIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      `;
      
      // Create text label that appears on hover
      const textContainer = document.createElement('div');
      textContainer.style.position = 'absolute';
      textContainer.style.right = '70px';
      textContainer.style.backgroundColor = '#006A71';
      textContainer.style.color = 'white';
      textContainer.style.padding = '8px 16px';
      textContainer.style.borderRadius = '4px';
      textContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      textContainer.style.opacity = '0';
      textContainer.style.transition = 'opacity 0.3s ease';
      textContainer.style.pointerEvents = 'none';
      textContainer.innerText = 'Consultation';
      
      // Show label on hover
      whatsappButton.onmouseenter = () => {
        textContainer.style.opacity = '1';
      };
      
      whatsappButton.onmouseleave = () => {
        textContainer.style.opacity = '0';
      };
      
      // Add hover effect
      whatsappButton.onmouseover = () => {
        whatsappButton.style.transform = 'scale(1.1)';
        whatsappButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
      };
      
      whatsappButton.onmouseout = () => {
        whatsappButton.style.transform = 'scale(1)';
        whatsappButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
      };
      
      // Assemble the elements
      whatsappButton.appendChild(whatsappIcon);
      whatsappContainer.appendChild(textContainer);
      whatsappContainer.appendChild(whatsappButton);
      
      // Add to the document
      document.body.appendChild(whatsappContainer);
      
      setIsWhatsAppLoaded(true);
      
      // Clean up function
      return () => {
        if (document.body.contains(whatsappContainer)) {
          document.body.removeChild(whatsappContainer);
        }
      };
    }
  }, []);

  return (
    <>
      <Head>
        <title>About Us | Lumera Hospital</title>
        <meta name="description" content="Learn about Lumera Hospital's mission, values, history and our dedicated team of healthcare professionals." />
      </Head>

      <main className="bg-gray-50">
        {/* Hero Section with improved gradient */}
        <section className="relative h-96">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-700 to-teal-500 opacity-90" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
            <h1 className="text-5xl font-bold mb-4 text-center">About Lumera Hospital</h1>
            <p className="text-xl max-w-2xl text-center">
              Delivering exceptional healthcare with compassion and innovation since 2005
            </p>
          </div>
        </section>

        {/* Mission & Values with enhanced visual appeal */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-teal-700">Our Mission</h2>
              <p className="text-lg mb-6">
                At Lumera Hospital, our mission is to provide exceptional healthcare that improves the health and wellbeing of the communities we serve. We are committed to delivering patient-centered care with compassion, integrity, and excellence.
              </p>
              <h2 className="text-3xl font-bold mb-6 text-teal-700">Our Values</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-teal-400 rounded-full p-1 mr-3 mt-1">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-teal-700">Excellence</span>
                    <p>We strive for excellence in all aspects of healthcare delivery, continuously improving our services.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-teal-400 rounded-full p-1 mr-3 mt-1">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-teal-700">Compassion</span>
                    <p>We treat each patient with kindness, empathy, and respect, recognizing their unique needs.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-teal-400 rounded-full p-1 mr-3 mt-1">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-teal-700">Innovation</span>
                    <p>We embrace cutting-edge technologies and innovative approaches to enhance patient care.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-teal-400 p-8 rounded-lg shadow-lg">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4 text-white">Lumera by the Numbers</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">500+</p>
                    <p className="text-teal-800 font-medium">Beds</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">300+</p>
                    <p className="text-teal-800 font-medium">Physicians</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">50+</p>
                    <p className="text-teal-800 font-medium">Specialties</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">20</p>
                    <p className="text-teal-800 font-medium">Years of Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our History with improved timeline */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-teal-700">Our History</h2>
            <div className="relative">
              {/* Timeline */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-teal-400"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-xl font-bold mb-2 text-teal-700">2005</h3>
                      <p>Lumera Hospital was founded with a vision to provide accessible and high-quality healthcare to our community.</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-4 h-4 bg-teal-500 rounded-full absolute left-1/2 transform -translate-x-1/2 border-4 border-white"></div>
                  <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0"></div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12"></div>
                  <div className="hidden md:block w-4 h-4 bg-teal-500 rounded-full absolute left-1/2 transform -translate-x-1/2 border-4 border-white"></div>
                  <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-xl font-bold mb-2 text-teal-700">2010</h3>
                      <p>Expanded our facilities and added the state-of-the-art Cardiac Care Center and Women's Health Pavilion.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-xl font-bold mb-2 text-teal-700">2015</h3>
                      <p>Achieved national recognition for excellence in patient care and innovative healthcare delivery models.</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-4 h-4 bg-teal-500 rounded-full absolute left-1/2 transform -translate-x-1/2 border-4 border-white"></div>
                  <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0"></div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12"></div>
                  <div className="hidden md:block w-4 h-4 bg-teal-500 rounded-full absolute left-1/2 transform -translate-x-1/2 border-4 border-white"></div>
                  <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-xl font-bold mb-2 text-teal-700">2020</h3>
                      <p>Opened the Lumera Research Center, dedicating resources to advancing medical knowledge and treatments.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-xl font-bold mb-2 text-teal-700">2025</h3>
                      <p>Today, we continue our commitment to healthcare excellence with expanded telehealth services and cutting-edge treatments.</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-4 h-4 bg-teal-500 rounded-full absolute left-1/2 transform -translate-x-1/2 border-4 border-white"></div>
                  <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team with lucide-react icons */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-teal-700">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
              <div className="bg-teal-400 h-40 flex items-center justify-center">
                <User className="w-24 h-24 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-teal-700">Dr. Sarah Chen</h3>
                <p className="text-sm text-gray-500 mb-3">Chief Executive Officer</p>
                <p>With over 20 years of experience in healthcare management, Dr. Chen leads Lumera with a vision of innovation and excellence.</p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
              <div className="bg-teal-500 h-40 flex items-center justify-center">
                <User className="w-24 h-24 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-teal-700">Dr. Michael Rodriguez</h3>
                <p className="text-sm text-gray-500 mb-3">Chief Medical Officer</p>
                <p>Dr. Rodriguez oversees all clinical operations, ensuring we maintain the highest standards of patient care and safety.</p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
              <div className="bg-teal-700 h-40 flex items-center justify-center">
                <User className="w-24 h-24 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-teal-700">Rebecca Johnson</h3>
                <p className="text-sm text-gray-500 mb-3">Chief Nursing Officer</p>
                <p>With a passion for patient-centered care, Rebecca leads our nursing staff in providing compassionate healthcare services.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section with improved design */}
        <section className="py-16 bg-gradient-to-r from-teal-700 to-teal-500 text-white">
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Team at Lumera Hospital</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              We're always looking for passionate healthcare professionals who share our commitment to excellence and compassionate care.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="http://localhost:3000/register">
                <button className="bg-white text-teal-700 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition duration-300 flex items-center justify-center">
                  Register Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <Link href="http://localhost:3000/contact">
                <button className="border-2 border-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-teal-700 transition duration-300 flex items-center justify-center">
                  Contact Us
                  <MessageCircle className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}