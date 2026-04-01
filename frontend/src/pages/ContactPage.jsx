import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Spinner from '../components/ui/Spinner'
import { useSubmitEnquiry } from '../hooks/useEnquiries'

const inputCls =
  'w-full border border-border rounded-btn px-3 py-2.5 text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors bg-white'

const HOURS = [
  { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
  { day: 'Saturday', time: '9:00 AM – 4:00 PM' },
  { day: 'Sunday', time: 'Closed' },
]

const WA_NUMBER = '256704079274'

export default function ContactPage() {
  const { submit, loading, error, success, reset } = useSubmitEnquiry()
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submit({ ...form, propertyId: null })
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="bg-primary pt-28 pb-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-3">
            Get In Touch
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Contact Us
          </h1>
          <p className="text-white/65 text-lg max-w-md mx-auto leading-relaxed">
            Have a question or need help finding the right property? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ── Contact Form ──────────────────────────────────────────── */}
            <div className="lg:col-span-3">
              <div className="bg-surface rounded-card shadow-card p-8">
                <h2 className="font-display font-semibold text-text-main text-xl mb-1">
                  Send Us a Message
                </h2>
                <p className="text-text-muted text-sm mb-6">
                  Fill in the form and we'll get back to you within 24 hours.
                </p>

                {success ? (
                  <div className="text-center py-10">
                    <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                    <h3 className="font-display font-semibold text-text-main text-lg mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-text-muted text-sm mb-6">
                      Thank you for reaching out. We'll be in touch shortly.
                    </p>
                    <button
                      onClick={reset}
                      className="text-sm text-primary hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-btn">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-text-main mb-1.5">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => set('name', e.target.value)}
                          placeholder="Your full name"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-main mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => set('phone', e.target.value)}
                          placeholder="+256 704 079274"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-main mb-1.5">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="you@email.com"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-main mb-1.5">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => set('message', e.target.value)}
                        placeholder="How can we help you? Tell us what you're looking for…"
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary-light text-white py-3 rounded-btn text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading && <Spinner size="sm" className="border-white/30 border-t-white" />}
                      {loading ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* ── Contact Info ──────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">
              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-green-500 hover:bg-green-600 text-white rounded-card p-5 transition-colors"
              >
                <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Chat on WhatsApp</p>
                  <p className="text-white/75 text-xs mt-0.5">Fastest way to reach us</p>
                </div>
              </a>

              {/* Details card */}
              <div className="bg-surface rounded-card shadow-card p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/5 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-main uppercase tracking-wider mb-1">
                      Office
                    </p>
                    <p className="text-text-muted text-sm leading-relaxed">
                      Plot 45 Kira Road<br />
                      Kampala, Uganda
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-5 flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/5 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Phone size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-main uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <a
                      href="tel:+256704079274"
                      className="text-text-muted hover:text-primary text-sm transition-colors"
                    >
                      +256 704 079274
                    </a>
                  </div>
                </div>

                <div className="border-t border-border pt-5 flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/5 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-main uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:info@glomonhomes.com"
                      className="text-text-muted hover:text-primary text-sm transition-colors"
                    >
                      info@glomonhomes.com
                    </a>
                  </div>
                </div>

                <div className="border-t border-border pt-5 flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/5 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-main uppercase tracking-wider mb-2">
                      Office Hours
                    </p>
                    <ul className="space-y-1.5">
                      {HOURS.map(({ day, time }) => (
                        <li key={day} className="flex justify-between gap-4 text-sm">
                          <span className="text-text-muted">{day}</span>
                          <span className="font-medium text-text-main whitespace-nowrap">{time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
