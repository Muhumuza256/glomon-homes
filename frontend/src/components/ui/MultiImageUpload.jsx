import { useRef, useState } from 'react'
import { Upload, X, ImageIcon, Loader2, Star } from 'lucide-react'
import api from '../../services/api'

const MAX = 7

/**
 * MultiImageUpload — up to 7 images
 * Layout: cover slot (full-width tall) + 2-col grid for the remaining 6
 * Props:
 *   images   — string[]
 *   onChange — (urls: string[]) => void
 */
export default function MultiImageUpload({ images = [], onChange }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [replacingIndex, setReplacingIndex] = useState(null)

  const triggerUpload = (idx = null) => {
    setReplacingIndex(idx)
    fileRef.current?.click()
  }

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadError('')
    setUploading(true)
    try {
      const slots = replacingIndex !== null ? 1 : MAX - images.length
      const toUpload = files.slice(0, Math.max(0, slots))
      const urls = await Promise.all(
        toUpload.map(async (file) => {
          const formData = new FormData()
          formData.append('image', file)
          const res = await api.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          return res.data.url
        })
      )
      if (replacingIndex !== null) {
        const next = [...images]
        next[replacingIndex] = urls[0]
        onChange(next)
      } else {
        onChange([...images, ...urls])
      }
    } catch (err) {
      setUploadError(err.response?.data?.error ?? 'Upload failed.')
    } finally {
      setUploading(false)
      setReplacingIndex(null)
      e.target.value = ''
    }
  }

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx))

  const ImageSlot = ({ idx, tall = false }) => {
    const url = images[idx]
    const isCover = idx === 0
    const canAdd = idx <= images.length && images.length < MAX
    const isUploading = uploading && idx === images.length

    return (
      <div className={`relative ${tall ? 'h-48' : 'h-28'} rounded-[6px] overflow-hidden`}>
        {url ? (
          <div className="relative w-full h-full group border border-border rounded-[6px] overflow-hidden">
            <img src={url} alt="" className="w-full h-full object-cover" />
            {isCover && (
              <div className="absolute top-2 left-2 bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Star size={8} fill="white" /> Cover
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => triggerUpload(idx)}
                disabled={uploading}
                className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors shadow"
                title="Replace"
              >
                <Upload size={13} />
              </button>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors shadow"
                title="Remove"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => canAdd && triggerUpload()}
            disabled={uploading || !canAdd}
            className={`w-full h-full rounded-[6px] border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors ${
              canAdd
                ? 'border-border hover:border-[#1A1A1A]/30 dark:hover:border-white/30 cursor-pointer'
                : 'border-border/30 cursor-not-allowed opacity-30'
            }`}
          >
            {isUploading ? (
              <Loader2 size={18} className="text-text-muted animate-spin" />
            ) : (
              <>
                <ImageIcon size={18} className="text-border" />
                <span className="text-[10px] text-text-muted">
                  {isCover ? 'Cover photo' : `Photo ${idx + 1}`}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-text-main">
          Property Photos{' '}
          <span className="text-text-muted font-normal">({images.length}/{MAX})</span>
        </p>
        <p className="text-[10px] text-text-muted">First photo is the cover</p>
      </div>

      {/* Cover slot — full width */}
      <ImageSlot idx={0} tall />

      {/* Gallery grid — 3 cols × 2 rows = 6 slots */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <ImageSlot key={idx} idx={idx} />
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
        disabled={uploading}
      />

      {uploadError && (
        <p className="text-[11px] text-red-600">{uploadError}</p>
      )}

      <p className="text-[10px] text-text-muted">
        JPG, PNG, WEBP up to 10 MB each · First photo becomes the cover image
      </p>

      {/* URL fallback for cover image */}
      <div className="flex gap-2">
        <input
          type="url"
          value={images[0] ?? ''}
          onChange={(e) => {
            const next = [...images]
            next[0] = e.target.value
            onChange(next.filter(Boolean))
          }}
          placeholder="…or paste cover image URL"
          className="flex-1 border border-border rounded-btn px-3 py-2 text-xs text-text-muted focus:outline-none focus:border-[#1A1A1A] dark:focus:border-white/50 transition-colors bg-transparent"
        />
      </div>
    </div>
  )
}
