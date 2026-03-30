import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown, ChevronUp, AlertCircle, ChevronLeft, ChevronRight,
  Mail, Phone, ExternalLink, Calendar, Clock,
} from 'lucide-react'
import AdminLayout from './AdminLayout'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import api from '../services/api'
import { formatDate } from '../utils/formatters'

const STATUS_BADGE  = { PENDING: 'accent', CONFIRMED: 'active', CANCELLED: 'sold' }
const STATUS_LABEL  = { PENDING: 'Pending', CONFIRMED: 'Confirmed', CANCELLED: 'Cancelled' }
const NEXT_STATUS   = { PENDING: 'CONFIRMED', CONFIRMED: 'CONFIRMED', CANCELLED: 'CANCELLED' }
const NEXT_LABEL    = { PENDING: 'Confirm Visit', CONFIRMED: 'Confirmed ✓', CANCELLED: 'Cancelled' }

export default function AdminVisits() {
  const [visits, setVisits]         = useState([])
  const [total, setTotal]           = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage]             = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [expanded, setExpanded]     = useState(null)
  const [updating, setUpdating]     = useState(null)

  const fetchVisits = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page, limit: 20 })
      if (statusFilter) params.set('status', statusFilter)
      const res = await api.get(`/api/visits?${params}`)
      setVisits(res.data.data)
      setTotal(res.data.total)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Failed to load visit bookings. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => { fetchVisits() }, [fetchVisits])

  const handleStatusUpdate = async (visit, newStatus) => {
    if (newStatus === visit.status) return
    setUpdating(visit.id)
    try {
      await api.patch(`/api/visits/${visit.id}/status`, { status: newStatus })
      setVisits((prev) =>
        prev.map((v) => (v.id === visit.id ? { ...v, status: newStatus } : v))
      )
    } catch {
      // silent
    } finally {
      setUpdating(null)
    }
  }

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id))

  return (
    <AdminLayout title="Visit Bookings">
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-text-muted text-sm">
            {loading ? '…' : <><span className="font-medium text-text-main">{total}</span> bookings</>}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {['', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((s) => (
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

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-btn">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : visits.length === 0 ? (
          <div className="bg-white rounded-card shadow-card py-20 text-center">
            <p className="text-text-muted text-sm">
              No visit bookings{statusFilter ? ` with status "${statusFilter}"` : ''} yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-card shadow-card overflow-hidden divide-y divide-border">
            {visits.map((visit) => {
              const isOpen = expanded === visit.id

              return (
                <div key={visit.id} className={visit.status === 'PENDING' ? 'bg-accent/3' : ''}>
                  {/* Row */}
                  <div
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-bg/60 transition-colors"
                    onClick={() => toggleExpand(visit.id)}
                  >
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text-main text-sm truncate">{visit.name}</p>
                        {visit.status === 'PENDING' && (
                          <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-muted truncate">{visit.email}</p>
                    </div>

                    {/* Property */}
                    <div className="hidden sm:block w-40 shrink-0">
                      {visit.property ? (
                        <p className="text-xs text-text-muted truncate">{visit.property.title}</p>
                      ) : (
                        <p className="text-xs text-text-muted italic">General visit</p>
                      )}
                    </div>

                    {/* Date + time */}
                    <div className="hidden md:flex items-center gap-1.5 text-xs text-text-muted shrink-0">
                      <Calendar size={12} className="text-accent" />
                      {new Date(visit.visitDate).toLocaleDateString('en-UG', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </div>
                    <div className="hidden lg:flex items-center gap-1.5 text-xs text-text-muted shrink-0 w-36">
                      <Clock size={12} className="text-accent" />
                      {visit.timeSlot}
                    </div>

                    {/* Status badge */}
                    <Badge variant={STATUS_BADGE[visit.status]} className="shrink-0">
                      {STATUS_LABEL[visit.status]}
                    </Badge>

                    <div className="text-text-muted shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="px-5 pb-5 bg-bg/40 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {/* Contact */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                            Contact Details
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-text-main">
                            <Mail size={13} className="text-accent shrink-0" />
                            <a href={`mailto:${visit.email}`} className="hover:text-primary transition-colors">
                              {visit.email}
                            </a>
                          </div>
                          {visit.phone && (
                            <div className="flex items-center gap-2 text-sm text-text-main">
                              <Phone size={13} className="text-accent shrink-0" />
                              <a href={`tel:${visit.phone}`} className="hover:text-primary transition-colors">
                                {visit.phone}
                              </a>
                            </div>
                          )}
                          {visit.property && (
                            <div className="flex items-center gap-2 text-sm text-text-main">
                              <ExternalLink size={13} className="text-accent shrink-0" />
                              <Link
                                to={`/listings/${visit.property.id}`}
                                target="_blank"
                                className="hover:text-primary transition-colors truncate"
                              >
                                {visit.property.title}
                              </Link>
                            </div>
                          )}
                          <p className="text-xs text-text-muted pt-1">
                            Submitted {formatDate(visit.createdAt)}
                          </p>
                        </div>

                        {/* Visit details */}
                        <div>
                          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                            Visit Details
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-text-main">
                              <Calendar size={13} className="text-accent shrink-0" />
                              {new Date(visit.visitDate).toLocaleDateString('en-UG', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                              })}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-main">
                              <Clock size={13} className="text-accent shrink-0" />
                              {visit.timeSlot}
                            </div>
                            {visit.notes && (
                              <p className="text-sm text-text-main leading-relaxed whitespace-pre-wrap bg-white border border-border rounded-btn p-3 mt-2">
                                {visit.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border flex-wrap">
                        <button
                          disabled={visit.status !== 'PENDING' || updating === visit.id}
                          onClick={() => handleStatusUpdate(visit, 'CONFIRMED')}
                          className="flex items-center gap-2 bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-btn text-xs font-semibold transition-colors"
                        >
                          {updating === visit.id && <Spinner size="sm" className="border-white/30 border-t-white" />}
                          {NEXT_LABEL[visit.status]}
                        </button>
                        {visit.status === 'PENDING' && (
                          <button
                            disabled={updating === visit.id}
                            onClick={() => handleStatusUpdate(visit, 'CANCELLED')}
                            className="flex items-center gap-2 px-4 py-2 rounded-btn text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            Cancel Visit
                          </button>
                        )}
                        <a
                          href={`mailto:${visit.email}?subject=Your Visit Booking — Glomon Homes`}
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
