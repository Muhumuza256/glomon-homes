import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { getPropertyImage } from '../../utils/formatters'

export default function PropertyImageGallery({ images = [], coverImage, title = '' }) {
  const allImages = images.length ? images : [coverImage ?? '']
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const prev = (e) => {
    e?.stopPropagation()
    setCurrent((i) => (i - 1 + allImages.length) % allImages.length)
  }
  const next = (e) => {
    e?.stopPropagation()
    setCurrent((i) => (i + 1) % allImages.length)
  }

  return (
    <>
      <div className="rounded-card overflow-hidden shadow-card">
        {/* Main image */}
        <div
          className="relative h-72 md:h-[420px] bg-gray-100 group cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          <img
            src={getPropertyImage(allImages[current])}
            alt={`${title} — ${current + 1} of ${allImages.length}`}
            className="w-full h-full object-cover"
          />
          {/* Hover zoom hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow" size={30} />
          </div>

          {/* Prev / Next */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              {current + 1} / {allImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 p-3 bg-white overflow-x-auto scrollbar-thin">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === current
                    ? 'border-primary opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <img
                  src={getPropertyImage(img)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setLightbox(false)}
          >
            <X size={20} />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <img
            src={getPropertyImage(allImages[current])}
            alt={title}
            className="max-w-5xl max-h-[88vh] w-full object-contain px-20"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-5 text-white/50 text-sm">
            {current + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  )
}
