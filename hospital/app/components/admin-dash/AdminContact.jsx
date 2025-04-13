"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const colors = {
  primary: '#006A71',
  secondary: '#48A6A7',
  accent: '#9ACBD0',
  background: '#f7fffd',
  white: '#FFFFFF',
  success: '#4CAF50',
  warning: '#618300',
  danger: '#F44336',
  confirmed: '#007f83',
  done: '#0027ff',
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    light: '#6B7280'
  }
};

const AdminContact = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/contact');
            if (response.data.success) {
                setMessages(response.data.data);
            } else {
                setMessages([]);
            }
        } catch (err) {
            console.error('Error fetching contact messages:', err);
            setError('Failed to load contact messages.');
        } finally {
            setLoading(false);
        }
    };

    const filteredMessages = messages.filter((msg) =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: colors.background }}>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" style={{ borderColor: colors.primary }}></div>
                <span className="mt-4 text-xl" style={{ color: colors.text.primary }}>Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: colors.background }}>
                <div className="border-l-4 p-6 rounded-lg shadow-md" style={{ 
                    backgroundColor: `${colors.danger}10`,
                    borderColor: colors.danger
                }}>
                    <div className="flex items-center">
                        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke={colors.danger}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="ml-4 text-xl font-medium" style={{ color: colors.danger }}>{error}</span>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={fetchMessages}
                            className="px-6 py-3 rounded-md transition-colors"
                            style={{ 
                                backgroundColor: colors.danger,
                                color: colors.white
                            }}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full py-12 px-4" style={{ backgroundColor: colors.background }}>
            <div className="max-w-7xl mx-auto rounded-xl shadow-2xl p-8" style={{ backgroundColor: colors.white }}>
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4" style={{ borderBottom: `1px solid ${colors.accent}50` }}>
                    <div className="flex items-center">
                        <div className="p-4 rounded-full" style={{ backgroundColor: `${colors.accent}20` }}>
                            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke={colors.primary}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <div className="ml-6">
                            <h2 className="text-3xl font-bold" style={{ color: colors.text.primary }}>Contact Messages</h2>
                            <p className="mt-2" style={{ color: colors.text.secondary }}>Manage contact messages</p>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 w-full sm:w-1/3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-3 px-4 pr-10 rounded-lg focus:ring-2"
                                style={{ 
                                    border: `1px solid ${colors.accent}`,
                                    ':focus': { 
                                        ringColor: colors.primary,
                                        borderColor: colors.primary 
                                    }
                                }}
                            />
                            <svg className="h-6 w-6 absolute left-4 top-3" fill="none" viewBox="0 0 24 24" stroke={colors.text.light}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border" style={{ borderColor: `${colors.accent}50` }}>
                    <table className="min-w-full">
                        <thead>
                            <tr style={{ backgroundColor: colors.primary }}>
                                <th className="px-8 py-4 text-left font-semibold text-white">Name</th>
                                <th className="px-8 py-4 text-left font-semibold text-white">Email</th>
                                <th className="px-8 py-4 text-left font-semibold text-white hidden md:table-cell">Date</th>
                                <th className="px-8 py-4 text-left font-semibold text-white">Subject</th>
                                <th className="px-8 py-4 text-left font-semibold text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ divideColor: `${colors.accent}30` }}>
                            {filteredMessages.length > 0 ? (
                                filteredMessages.map((message) => (
                                    <tr key={message._id} className="hover:bg-gray-100 transition-colors">
                                        <td className="px-8 py-4" style={{ color: colors.text.primary }}>{message.name}</td>
                                        <td className="px-8 py-4">
                                            <a href={`mailto:${message.email}`} className="hover:underline" style={{ color: colors.primary }}>
                                                {message.email}
                                            </a>
                                        </td>
                                        <td className="px-8 py-4 hidden md:table-cell" style={{ color: colors.text.secondary }}>{formatDate(message.createdAt)}</td>
                                        <td className="px-8 py-4" style={{ color: colors.text.primary }}>{message.subject}</td>
                                        <td className="px-8 py-4">
                                            <button
                                                onClick={() => setSelectedMessage(message)}
                                                className="px-5 py-2 rounded-md transition-colors"
                                                style={{ 
                                                    backgroundColor: colors.primary,
                                                    color: colors.white
                                                }}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center px-8 py-10">
                                        <div className="flex flex-col items-center">
                                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke={colors.text.light}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <span className="mt-4 text-xl font-medium" style={{ color: colors.text.secondary }}>No messages found.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {selectedMessage && (
                    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-md flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-3xl font-bold" style={{ color: colors.text.primary }}>Message Details</h3>
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke={colors.text.secondary}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10` }}>
                                        <div className="text-sm" style={{ color: colors.text.secondary }}>Name</div>
                                        <div className="text-xl font-semibold" style={{ color: colors.text.primary }}>{selectedMessage.name}</div>
                                    </div>
                                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10` }}>
                                        <div className="text-sm" style={{ color: colors.text.secondary }}>Email</div>
                                        <div className="text-xl font-semibold">
                                            <a href={`mailto:${selectedMessage.email}`} style={{ color: colors.primary }}>{selectedMessage.email}</a>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10` }}>
                                        <div className="text-sm" style={{ color: colors.text.secondary }}>Sent Date</div>
                                        <div className="text-xl font-semibold" style={{ color: colors.text.primary }}>{formatDate(selectedMessage.createdAt)}</div>
                                    </div>
                                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10` }}>
                                        <div className="text-sm" style={{ color: colors.text.secondary }}>Subject</div>
                                        <div className="text-xl font-semibold" style={{ color: colors.text.primary }}>{selectedMessage.subject}</div>
                                    </div>
                                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10` }}>
                                        <div className="text-sm" style={{ color: colors.text.secondary }}>Message</div>
                                        <div className="mt-2 whitespace-pre-line leading-relaxed" style={{ color: colors.text.primary }}>{selectedMessage.message}</div>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        onClick={() => window.open(`mailto:${selectedMessage.email}`)}
                                        className="px-6 py-3 rounded-md transition-colors"
                                        style={{ 
                                            backgroundColor: colors.primary,
                                            color: colors.white
                                        }}
                                    >
                                        Reply via Email
                                    </button>
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="px-6 py-3 rounded-md transition-colors"
                                        style={{ 
                                            backgroundColor: colors.accent,
                                            color: colors.text.primary
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminContact;