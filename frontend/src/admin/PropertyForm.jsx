import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import ImageUpload from '../components/ui/ImageUpload'
import api from '../services/api'

const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'VILLA', 'COMMERCIAL', 'LAND', 'OFFICE']
const DISTRICTS = ['Kampala', 'Wakiso', 'Mukono', 'Entebbe', 'Jinja']
const STATUSES = ['ACTIVE', 'INACTIVE', 'SOLD', 'RENTED']
const AMENITIES = [
  'Security', 'Parking', 'Swimming Pool', 'Generator', 'Water Tank',
  'Garden', 'WiFi Ready', 'Lake View', 'Gym', 'Lift', 'CCTV', 'Borehole',
]

const EMPTY = {
  title: '', description: '', propertyType: 'APARTMENT',
  price: '', priceType: 'SALE', currency: 'UGX',
  bedrooms: '', bathrooms: '', area: '',
  location: '', district: 'Kampala', address: '',
  featured: false, status: 'ACTIVE',
  amenities: [], coverImage: '',
}

const inputCls =
  'w-full border border-border rounded-btn px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-colors bg-white'
const labelCls = 'block text-xs font-medium text-text-main mb-1.5'

function Field({ label, required, children }) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

export default function PropertyForm({ initial = EMPTY, isEdit = false, propertyId }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...EMPTY, ...initial })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const toggleAmenity = (amenity) =>
    set(
      'amenities',
      form.amenities.includes(amenity)
        ? form.amenities.filter((a) => a !== amenity)
        : [...form.amenities, amenity]
    )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        area: form.area ? parseFloat(form.area) : null,
        images: form.coverImage ? [form.coverImage] : [],
        coverImage: form.coverImage || null,
      }

      if (isEdit) {
        await api.put(`/api/properties/${propertyId}`, payload)
      } else {
        await api.post('/api/properties', payload)
      }

      setSuccess(true)
      setTimeout(() => navigate('/admin/properties'), 1200)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Failed to save property. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="text-green-500 mb-3" size={44} />
        <h3 className="font-display font-semibold text-text-main text-xl mb-1">
          {isEdit ? 'Property updated!' : 'Property created!'}
        </h3>
        <p className="text-text-muted text-sm">Redirecting to properties…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-btn">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Basic info ───────────────────────────────────────────────────── */}
      <section className="bg-white rounded-card shadow-card p-5 sm:p-6 space-y-4">
        <h3 className="font-display font-semibold text-text-main text-base border-b border-border pb-3">
          Basic Information
        </h3>

        <Field label="Title" required>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. 3-Bedroom Apartment in Kololo"
            className={inputCls}
          />
        </Field>

        <Field label="Description" required>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Describe the property in detail…"
            className={`${inputCls} resize-none`}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Property Type" required>
            <select
              value={form.propertyType}
              onChange={(e) => set('propertyType', e.target.value)}
              className={inputCls}
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status" required>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className={inputCls}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-card shadow-card p-5 sm:p-6 space-y-4">
        <h3 className="font-display font-semibold text-text-main text-base border-b border-border pb-3">
          Pricing
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Price (UGX)" required>
            <input
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="450000000"
              className={inputCls}
            />
          </Field>

          <Field label="Listing Type" required>
            <select
              value={form.priceType}
              onChange={(e) => set('priceType', e.target.value)}
              className={inputCls}
            >
              <option value="SALE">For Sale</option>
              <option value="RENT">For Rent</option>
            </select>
          </Field>

          <Field label="Currency">
            <input
              type="text"
              value={form.currency}
              onChange={(e) => set('currency', e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      {/* ── Property details ─────────────────────────────────────────────── */}
      <section className="bg-white rounded-card shadow-card p-5 sm:p-6 space-y-4">
        <h3 className="font-display font-semibold text-text-main text-base border-b border-border pb-3">
          Property Details
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Bedrooms">
            <input
              type="number"
              min="1"
              value={form.bedrooms}
              onChange={(e) => set('bedrooms', e.target.value)}
              placeholder="3"
              className={inputCls}
            />
          </Field>
          <Field label="Bathrooms">
            <input
              type="number"
              min="1"
              value={form.bathrooms}
              onChange={(e) => set('bathrooms', e.target.value)}
              placeholder="2"
              className={inputCls}
            />
          </Field>
          <Field label="Area (m²)">
            <input
              type="number"
              min="1"
              value={form.area}
              onChange={(e) => set('area', e.target.value)}
              placeholder="145"
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      {/* ── Location ─────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-card shadow-card p-5 sm:p-6 space-y-4">
        <h3 className="font-display font-semibold text-text-main text-base border-b border-border pb-3">
          Location
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Location / Neighbourhood" required>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Kololo, Kampala"
              className={inputCls}
            />
          </Field>
          <Field label="District" required>
            <select
              value={form.district}
              onChange={(e) => set('district', e.target.value)}
              className={inputCls}
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Full Address">
          <input
            type="text"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="Plot 14, Kampala Road"
            className={inputCls}
          />
        </Field>
      </section>

      {/* ── Amenities ────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-card shadow-card p-5 sm:p-6">
        <h3 className="font-display font-semibold text-text-main text-base border-b border-border pb-3 mb-4">
          Amenities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AMENITIES.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <input
                type="checkbox"
                checked={form.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="w-4 h-4 rounded accent-primary"
              />
              <span className="text-sm text-text-muted group-hover:text-text-main transition-colors">
                {amenity}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* ── Image & flags ────────────────────────────────────────────────── */}
      <section className="bg-white rounded-card shadow-card p-5 sm:p-6 space-y-5">
        <h3 className="font-display font-semibold text-text-main text-base border-b border-border pb-3">
          Image & Visibility
        </h3>

        <ImageUpload
          value={form.coverImage}
          onChange={(url) => set('coverImage', url)}
        />

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => set('featured', !form.featured)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              form.featured ? 'bg-accent' : 'bg-gray-200'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                form.featured ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
          <span className="text-sm text-text-main font-medium">
            Featured listing
            <span className="text-text-muted font-normal ml-1">(shown on homepage)</span>
          </span>
        </label>
      </section>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pb-8">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-btn text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {loading && <Spinner size="sm" className="border-white/30 border-t-white" />}
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Property'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/properties')}
          className="px-6 py-3 rounded-btn text-sm font-medium border border-border text-text-muted hover:text-text-main hover:border-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
