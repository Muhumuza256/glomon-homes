import { useState } from 'react'
import { X, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import api from '../../services/api'
import Spinner from '../ui/Spinner'

const TIME_SLOTS = [
  '9:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '1:00 PM – 2:00 PM',
  '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',
]

const inputCls =
  'w-full border border-border rounded-btn px-3 py-2.5 text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors bg-surface'

// Min date = today
function todayStr() {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

export default function VisitBookingModal({ propertyId, propertyTitle, onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', visitDate: '', timeSlot: '', notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/api/visits', {
        ...form,
        propertyId: propertyId ?? null,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Could not book visit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface rounded-card shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface z-10">
          <div>
            <h3 className="font-display font-bold text-text-main text-lg flex items-center gap-2">
              <Calendar size={18} className="text-accent" />
              Book a Visit
            </h3>
            {propertyTitle && (
              <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{propertyTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-btn text-text-muted hover:text-text-main hover:bg-border/40 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h4 className="font-display font-semibold text-text-main text-xl mb-2">
                Visit Booked!
              </h4>
              <p className="text-text-muted text-sm mb-1">
                Thank you, <strong>{form.name}</strong>. We've received your booking.
              </p>
              <p className="text-text-muted text-sm mb-6">
                We'll confirm your visit via <strong>{form.email}</strong> shortly.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-primary text-white rounded-btn text-sm font-semibold transition-colors hover:bg-primary-light"
              >
                Close
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
                    type="text" required value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Your name" className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1.5">Phone</label>
                  <input
                    type="tel" value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="+256 700 000 000" className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-main mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="you@email.com" className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1.5">
                    Preferred Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date" required value={form.visitDate}
                    min={todayStr()}
                    onChange={(e) => set('visitDate', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1.5">
                    Time Slot <span className="text-red-400">*</span>
                  </label>
                  <select
                    required value={form.timeSlot}
                    onChange={(e) => set('timeSlot', e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-main mb-1.5">
                  Additional Notes
                </label>
                <textarea
                  rows={3} value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Anything specific you'd like to see or discuss…"
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="bg-primary/5 rounded-btn p-3 flex items-start gap-2">
                <Clock size={14} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-text-muted leading-relaxed">
                  Visits are typically 30–60 minutes. Our agent will confirm your booking within 24 hours.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-btn text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Spinner size="sm" className="border-white/30 border-t-white" />}
                {loading ? 'Booking…' : 'Confirm Booking'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
