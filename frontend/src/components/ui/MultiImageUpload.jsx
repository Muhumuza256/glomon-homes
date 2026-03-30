import { useRef, useState } from 'react'
import { Upload, X, ImageIcon, Loader2, Star } from 'lucide-react'
import api from '../../services/api'

const MAX = 4

/**
 * MultiImageUpload
 * Props:
 *   images     — string[]  (array of image URLs, max 4)
 *   onChange   — (urls: string[]) => void
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

  const remove = (idx) => {
    onChange(images.filter((_, i) => i !== idx))
  }

  const slots = Array.from({ length: MAX })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-text-main">
          Property Images <span className="text-text-muted font-normal">({images.length}/{MAX})</span>
        </p>
        <p className="text-[11px] text-text-muted">First image is the cover</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {slots.map((_, idx) => {
          const url = images[idx]
          const isCover = idx === 0

          return (
            <div key={idx} className="relative">
              {url ? (
                <div className="relative h-32 rounded-card overflow-hidden border border-border group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {/* Cover badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star size={9} fill="white" /> Cover
                    </div>
                  )}
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => triggerUpload(idx)}
                      disabled={uploading}
                      className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                      title="Replace"
                    >
                      <Upload size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => images.length < MAX && triggerUpload()}
                  disabled={uploading || images.length >= MAX || idx > images.length}
                  className={`w-full h-32 rounded-card border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors
                    ${idx <= images.length && images.length < MAX
                      ? 'border-border hover:border-primary/50 cursor-pointer'
                      : 'border-border/40 cursor-not-allowed opacity-40'
                    }`}
                >
                  {uploading && idx === images.length ? (
                    <Loader2 size={20} className="text-primary animate-spin" />
                  ) : (
                    <>
                      <ImageIcon size={20} className="text-border" />
                      <span className="text-[11px] text-text-muted">
                        {isCover ? 'Add cover' : `Add image ${idx + 1}`}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          )
        })}
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

      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}

      <p className="text-[11px] text-text-muted">
        JPG, PNG, WEBP up to 10 MB each · Or paste URLs directly below
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
          className="flex-1 border border-border rounded-btn px-3 py-2 text-xs text-text-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>
    </div>
  )
}
