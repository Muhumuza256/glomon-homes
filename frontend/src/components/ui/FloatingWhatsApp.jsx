import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const WA_NUMBER = '256781106837'
const WA_MSG = encodeURIComponent('Hi Glomon Homes, I have a question about your properties.')

export default function FloatingWhatsApp() {
  const [tooltip, setTooltip] = useState(false)
  const { pathname } = useLocation()

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-2">
      {tooltip && (
        <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap mb-1 animate-fade-in">
          Chat with us on WhatsApp
        </div>
      )}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 bg-green-500 hover:bg-green-600 active:scale-95 rounded-full flex items-center justify-center shadow-xl transition-all duration-200"
      >
        <MessageCircle size={28} className="text-white" fill="white" />
      </a>
    </div>
  )
}
