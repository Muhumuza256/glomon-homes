import { useRef, useState } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import api from '../../services/api'

/**
 * ImageUpload
 * Props:
 *   value      — current image URL (string)
 *   onChange   — called with new URL string
 *   label      — optional section label
 */
export default function ImageUpload({ value, onChange, label = 'Cover Image' }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(res.data.url)
    } catch (err) {
      setUploadError(err.response?.data?.error ?? 'Upload failed. Check Cloudinary settings.')
    } finally {
      setUploading(false)
      // reset so same file can be re-selected
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-text-main">{label}</p>

      {/* Preview / drop zone */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-card overflow-hidden transition-colors cursor-pointer
          ${value ? 'border-border' : 'border-border hover:border-primary/50'}
          ${uploading ? 'cursor-not-allowed' : ''}`}
      >
        {value ? (
          <div className="relative h-44">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            {/* Overlay on hover */}
            {!uploading && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                <span className="text-white text-sm font-semibold flex items-center gap-2">
                  <Upload size={16} /> Change image
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-36 flex flex-col items-center justify-center gap-2 text-text-muted">
            <ImageIcon size={28} className="text-border" />
            <p className="text-sm">Click to upload from gallery</p>
            <p className="text-xs text-text-muted/60">JPG, PNG, WEBP up to 10 MB</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="text-primary animate-spin" />
            <p className="text-sm text-text-muted">Uploading…</p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />

      {/* URL text fallback */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste an image URL"
          className="flex-1 border border-border rounded-btn px-3 py-2 text-xs text-text-muted focus:outline-none focus:border-primary transition-colors bg-white"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 rounded-btn border border-border text-text-muted hover:text-red-500 hover:border-red-200 transition-colors"
            title="Clear image"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {uploadError && (
        <p className="text-xs text-red-600">{uploadError}</p>
      )}
    </div>
  )
}
