import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import AdminLayout from './AdminLayout'
import ImageUpload from '../components/ui/ImageUpload'
import Spinner from '../components/ui/Spinner'
import api from '../services/api'

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80'

export default function AdminSettings() {
  const [heroImage, setHeroImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/settings')
      .then((res) => setHeroImage(res.data.hero_image ?? DEFAULT_HERO))
      .catch(() => setHeroImage(DEFAULT_HERO))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setError('')
    setSaving(true)
    setSaved(false)
    try {
      await api.put('/api/settings/hero_image', { value: heroImage || DEFAULT_HERO })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Failed to save. Is the backend running?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl space-y-6">

        {/* Hero Image */}
        <section className="bg-surface rounded-card shadow-card p-5 sm:p-6 space-y-5">
          <div className="border-b border-border pb-3">
            <h3 className="font-display font-semibold text-text-main text-base">
              Homepage Hero Image
            </h3>
            <p className="text-text-muted text-xs mt-0.5">
              The full-screen background image shown at the top of the public homepage.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-44">
              <Spinner size="lg" />
            </div>
          ) : (
            <ImageUpload
              value={heroImage}
              onChange={setHeroImage}
              label="Hero background image"
            />
          )}

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-btn">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-btn text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {saving && <Spinner size="sm" className="border-white/30 border-t-white" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-green-600 text-sm">
                <CheckCircle size={15} />
                Saved!
              </span>
            )}
          </div>
        </section>

        {/* Cloudinary note */}
        <div className="bg-amber-50 border border-amber-200 rounded-card p-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">Image uploads require Cloudinary</p>
          <p className="text-xs leading-relaxed">
            To upload images from your gallery, set these environment variables on your backend (Render dashboard):
            <br />
            <code className="font-mono bg-amber-100 px-1 rounded">CLOUDINARY_CLOUD_NAME</code>,{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">CLOUDINARY_API_KEY</code>,{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">CLOUDINARY_API_SECRET</code>
            <br /><br />
            You can also paste any direct image URL — no Cloudinary needed for that.
          </p>
        </div>

      </div>
    </AdminLayout>
  )
}
