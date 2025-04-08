'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/contact', {
        name,
        email,
        message,
        termsAccepted
      });

      setResponseMessage('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
      setTermsAccepted(false);
    } catch (error) {
      setResponseMessage('Failed to send the message.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto  rounded-lg overflow-hidden pt-15 mb-15">
      {/* Left side - Person Image */}
      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-6">
        <img 
          src="https://images.pexels.com/photos/6749769/pexels-photo-6749769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Professional woman smiling" 
          className="object-cover h-full w-full"
        />
      </div>
      
      {/* Right side - Contact Form */}
      <div className="w-full md:w-1/2 bg-[#48A6A7] text-white p-8">
        <h1 className="text-3xl font-bold mb-8 text-center tracking-wider">CONTACT FORM</h1>
        
        {responseMessage && (
          <p className="text-center text-black text-lg mb-4">{responseMessage}</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-white">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full py-2 bg-transparent text-white placeholder-white focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="border-b border-white">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full py-2 bg-transparent text-white placeholder-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="border-b border-white">
            <textarea
              placeholder="Enter your message"
              className="w-full py-2 bg-transparent text-white placeholder-white focus:outline-none resize-none"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <button 
              type="submit" 
              className="px-6 py-2 border border-white text-white hover:bg-[#006A71] transition-colors"
            >
              Submit
            </button>
           
          </div>
        </form>
      </div>
    </div>
  );
}