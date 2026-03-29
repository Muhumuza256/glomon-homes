import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useSubmitEnquiry } from '../../hooks/useEnquiries'
import Spinner from '../ui/Spinner'

const inputCls =
  'w-full border border-border rounded-btn px-3 py-2.5 text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors bg-white'

export default function EnquiryForm({ propertyId, propertyTitle }) {
  const { submit, loading, error, success, reset } = useSubmitEnquiry()
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submit({ ...form, propertyId: propertyId ?? null })
  }

  if (success) {
    return (
      <div className="text-center py-8 px-2">
        <CheckCircle className="text-green-500 mx-auto mb-3" size={40} />
        <h4 className="font-display font-semibold text-text-main text-lg mb-1">Enquiry Sent!</h4>
        <p className="text-text-muted text-sm mb-5">
          We'll get back to you as soon as possible.
        </p>
        <button onClick={reset} className="text-sm text-primary hover:underline transition-colors">
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {propertyTitle && (
        <p className="text-xs text-text-muted pb-3 border-b border-border">
          Enquiring about:{' '}
          <span className="font-medium text-text-main line-clamp-1">{propertyTitle}</span>
        </p>
      )}

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-btn">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

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
        <label className="block text-xs font-medium text-text-main mb-1.5">Phone Number</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="+256 700 000 000"
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-main mb-1.5">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder="I'm interested in this property and would like more information…"
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-light text-white py-3 rounded-btn text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && <Spinner size="sm" className="border-white/30 border-t-white" />}
        {loading ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  )
}
