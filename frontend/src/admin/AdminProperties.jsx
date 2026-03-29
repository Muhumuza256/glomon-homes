import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminLayout from './AdminLayout'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import api from '../services/api'
import { formatPrice, getPropertyImage } from '../utils/formatters'

const STATUS_CYCLE = { ACTIVE: 'INACTIVE', INACTIVE: 'ACTIVE' }

const STATUS_BADGE = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SOLD: 'sold',
  RENTED: 'rented',
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-card shadow-2xl p-6 max-w-sm w-full mx-4">
        <h3 className="font-display font-semibold text-text-main text-lg mb-2">Are you sure?</h3>
        <p className="text-text-muted text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-btn text-sm border border-border text-text-muted hover:text-text-main transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-btn text-sm bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [actionLoading, setActionLoading] = useState(null) // id of property being acted on

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/api/properties/admin/all?page=${page}&limit=15`)
      setProperties(res.data.data)
      setTotal(res.data.total)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Failed to load. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const handleToggleStatus = async (property) => {
    const next = STATUS_CYCLE[property.status]
    if (!next) return // SOLD/RENTED — edit form only
    setActionLoading(property.id)
    try {
      await api.patch(`/api/properties/${property.id}/status`, { status: next })
      setProperties((prev) =>
        prev.map((p) => (p.id === property.id ? { ...p, status: next } : p))
      )
    } catch {
      // silent — user can retry
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setActionLoading(deleteTarget.id)
    try {
      await api.delete(`/api/properties/${deleteTarget.id}`)
      setDeleteTarget(null)
      fetchProperties()
    } catch {
      setDeleteTarget(null)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <AdminLayout title="Properties">
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <p className="text-text-muted text-sm">
            {loading ? '…' : <><span className="font-medium text-text-main">{total}</span> total properties</>}
          </p>
          <Link
            to="/admin/properties/new"
            className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-btn text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            Add Property
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-btn">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted text-sm mb-3">No properties yet.</p>
              <Link to="/admin/properties/new" className="text-sm text-primary font-medium hover:underline">
                Add your first property →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Property</th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Type</th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Price</th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">District</th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-bg/60 transition-colors">
                      {/* Property name + image */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getPropertyImage(p.coverImage)}
                            alt=""
                            className="w-12 h-9 object-cover rounded-lg shrink-0 bg-gray-100"
                          />
                          <div>
                            <p className="font-medium text-text-main line-clamp-1 max-w-[200px]">{p.title}</p>
                            {p.featured && (
                              <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">Featured</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {p.propertyType.charAt(0) + p.propertyType.slice(1).toLowerCase()}
                      </td>
                      <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">
                        {formatPrice(p.price, p.currency)}
                        {p.priceType === 'RENT' && <span className="text-text-muted font-normal">/mo</span>}
                      </td>
                      <td className="px-4 py-3 text-text-muted">{p.district}</td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_BADGE[p.status] ?? 'default'}>
                          {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          {/* Toggle active/inactive */}
                          <button
                            onClick={() => handleToggleStatus(p)}
                            disabled={actionLoading === p.id || !STATUS_CYCLE[p.status]}
                            title={
                              STATUS_CYCLE[p.status]
                                ? `Set ${STATUS_CYCLE[p.status].toLowerCase()}`
                                : 'Change status via edit'
                            }
                            className={`p-2 rounded-btn transition-colors disabled:opacity-40 ${
                              p.status === 'ACTIVE'
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-text-muted hover:bg-gray-100'
                            }`}
                          >
                            {actionLoading === p.id ? (
                              <Spinner size="sm" />
                            ) : p.status === 'ACTIVE' ? (
                              <ToggleRight size={18} />
                            ) : (
                              <ToggleLeft size={18} />
                            )}
                          </button>

                          {/* Edit */}
                          <Link
                            to={`/admin/properties/${p.id}/edit`}
                            className="p-2 rounded-btn text-text-muted hover:text-primary hover:bg-primary/5 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-2 rounded-btn text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AdminLayout>
  )
}
