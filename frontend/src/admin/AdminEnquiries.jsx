import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, AlertCircle, ChevronLeft, ChevronRight, Mail, Phone, ExternalLink } from 'lucide-react'
import AdminLayout from './AdminLayout'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import api from '../services/api'
import { formatDate } from '../utils/formatters'

const STATUS_BADGE = { NEW: 'accent', READ: 'primary', REPLIED: 'active' }
const STATUS_LABEL = { NEW: 'New', READ: 'Read', REPLIED: 'Replied' }

const NEXT_STATUS = { NEW: 'READ', READ: 'REPLIED', REPLIED: 'REPLIED' }
const NEXT_LABEL  = { NEW: 'Mark Read', READ: 'Mark Replied', REPLIED: 'Replied ✓' }

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)

  const fetchEnquiries = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page, limit: 20 })
      if (statusFilter) params.set('status', statusFilter)
      const res = await api.get(`/api/enquiries?${params}`)
      setEnquiries(res.data.data)
      setTotal(res.data.total)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Failed to load enquiries. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => {
    fetchEnquiries()
  }, [fetchEnquiries])

  const handleStatusUpdate = async (enquiry, newStatus) => {
    if (newStatus === enquiry.status) return
    setUpdating(enquiry.id)
    try {
      await api.patch(`/api/enquiries/${enquiry.id}/status`, { status: newStatus })
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiry.id ? { ...e, status: newStatus } : e))
      )
    } catch {
      // silent
    } finally {
      setUpdating(null)
    }
  }

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id))

  return (
    <AdminLayout title="Enquiries">
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-text-muted text-sm">
            {loading ? '…' : <><span className="font-medium text-text-main">{total}</span> enquiries</>}
          </p>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            {['', 'NEW', 'READ', 'REPLIED'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1) }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  statusFilter === s
                    ? 'bg-primary border-primary text-white'
                    : 'border-border text-text-muted hover:border-primary hover:text-primary'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-btn">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Enquiries list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-surface rounded-card shadow-card py-20 text-center">
            <p className="text-text-muted text-sm">No enquiries{statusFilter ? ` with status "${statusFilter}"` : ''} yet.</p>
          </div>
        ) : (
          <div className="bg-surface rounded-card shadow-card overflow-hidden divide-y divide-border">
            {enquiries.map((enq) => {
              const isOpen = expanded === enq.id
              const nextStatus = NEXT_STATUS[enq.status]

              return (
                <div key={enq.id} className={`transition-colors ${enq.status === 'NEW' ? 'bg-accent/3' : ''}`}>
                  {/* Row summary */}
                  <div
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-bg/60 transition-colors"
                    onClick={() => toggleExpand(enq.id)}
                  >
                    {/* Name + email */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text-main text-sm truncate">{enq.name}</p>
                        {enq.status === 'NEW' && (
                          <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-muted truncate">{enq.email}</p>
                    </div>

                    {/* Property */}
                    <div className="hidden sm:block w-40 shrink-0">
                      {enq.property ? (
                        <p className="text-xs text-text-muted truncate">{enq.property.title}</p>
                      ) : (
                        <p className="text-xs text-text-muted italic">General enquiry</p>
                      )}
                    </div>

                    {/* Message preview */}
                    <div className="hidden md:block flex-1 min-w-0">
                      <p className="text-xs text-text-muted truncate">{enq.message}</p>
                    </div>

                    {/* Date */}
                    <p className="hidden lg:block text-xs text-text-muted shrink-0 w-24 text-right">
                      {formatDate(enq.createdAt)}
                    </p>

                    {/* Status badge */}
                    <Badge variant={STATUS_BADGE[enq.status]} className="shrink-0">
                      {STATUS_LABEL[enq.status]}
                    </Badge>

                    {/* Expand icon */}
                    <div className="text-text-muted shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="px-5 pb-5 bg-bg/40 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {/* Contact info */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                            Contact Details
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-text-main">
                            <Mail size={13} className="text-accent shrink-0" />
                            <a href={`mailto:${enq.email}`} className="hover:text-primary transition-colors">
                              {enq.email}
                            </a>
                          </div>
                          {enq.phone && (
                            <div className="flex items-center gap-2 text-sm text-text-main">
                              <Phone size={13} className="text-accent shrink-0" />
                              <a href={`tel:${enq.phone}`} className="hover:text-primary transition-colors">
                                {enq.phone}
                              </a>
                            </div>
                          )}
                          {enq.property && (
                            <div className="flex items-center gap-2 text-sm text-text-main">
                              <ExternalLink size={13} className="text-accent shrink-0" />
                              <Link
                                to={`/listings/${enq.property.id}`}
                                target="_blank"
                                className="hover:text-primary transition-colors truncate"
                              >
                                {enq.property.title}
                              </Link>
                            </div>
                          )}
                          <p className="text-xs text-text-muted pt-1">{formatDate(enq.createdAt)}</p>
                        </div>

                        {/* Message */}
                        <div>
                          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                            Message
                          </h4>
                          <p className="text-sm text-text-main leading-relaxed whitespace-pre-wrap bg-bg border border-border rounded-btn p-3">
                            {enq.message}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                        <button
                          disabled={enq.status === 'REPLIED' || updating === enq.id}
                          onClick={() => handleStatusUpdate(enq, nextStatus)}
                          className="flex items-center gap-2 bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-btn text-xs font-semibold transition-colors"
                        >
                          {updating === enq.id && <Spinner size="sm" className="border-white/30 border-t-white" />}
                          {NEXT_LABEL[enq.status]}
                        </button>
                        <a
                          href={`mailto:${enq.email}?subject=Re: Your enquiry — Glomon Homes`}
                          className="flex items-center gap-2 px-4 py-2 rounded-btn text-xs font-medium border border-border text-text-muted hover:text-text-main hover:border-gray-400 transition-colors"
                        >
                          <Mail size={13} />
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-9 h-9 flex items-center justify-center rounded-btn border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-9 h-9 flex items-center justify-center rounded-btn border text-sm font-medium transition-colors ${
                  n === page ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary hover:text-primary'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-btn border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
