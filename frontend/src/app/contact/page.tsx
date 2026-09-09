'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Contact Us</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Need support with an order or interested in onboarding your local grocery store onto Quecto? Reach out to the Quecto Team anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info (1 col) */}
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Direct Channels</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Us</span>
                  <a href="mailto:quecto@gmail.com" className="font-bold text-white hover:text-emerald-400 transition-colors">
                    quecto@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Helpline Phone</span>
                  <span className="font-bold text-white">+91-9369831243</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Headquarters</span>
                  <span className="font-bold text-white">Lucknow, Uttar Pradesh, India</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Customer First Support</span>
              </div>
              <p>Our community representatives typically reply within 24 hours.</p>
            </div>
          </div>
        </div>

        {/* Contact Form (2 cols) */}
        <div className="md:col-span-2">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Send a Message to The Quecto Team</span>
            </h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Message Received!</h4>
                <p className="text-xs text-slate-300">
                  Thank you for reaching out. The Quecto Team will respond to <span className="text-emerald-400">{formData.email}</span> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Verma"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Your Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. user@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Store Partnership Inquiry / Order Support"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can the Quecto Team help you today?"
                    className="w-full p-3 rounded-xl glass-input"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl glass-button-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Quecto Team</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
