import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, CheckCircle, Mail, AlertCircle, Plus, ChevronRight } from 'lucide-react'
import AdminLayout from './AdminLayout'
import api from '../services/api'

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="bg-surface rounded-card shadow-card p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-text-muted text-sm">{label}</p>
        {loading ? (
          <div className="h-7 w-12 bg-border rounded animate-pulse mt-1" />
        ) : (
          <p className="font-display font-bold text-text-main text-2xl">{value ?? '—'}</p>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    async function fetchStats() {
      try {
        const [allPropsRes, activePropsRes, enquiriesRes, newEnquiriesRes] = await Promise.all([
          api.get('/api/properties/admin/all?limit=1'),
          api.get('/api/properties?limit=1'),
          api.get('/api/enquiries?limit=1'),
          api.get('/api/enquiries?status=NEW&limit=1'),
        ])
        setStats({
          total:        allPropsRes.data.total,
          active:       activePropsRes.data.total,
          enquiries:    enquiriesRes.data.total,
          newEnquiries: newEnquiriesRes.data.total,
        })
      } catch (err) {
        if (err.response?.status === 401) {
          setApiError('Session expired or no JWT — please log out and sign in again to see live stats.')
        }
        setStats({ total: null, active: null, enquiries: null, newEnquiries: null })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-5xl space-y-8">

        {apiError && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-btn">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            {apiError}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Building2}   label="Total Properties" value={stats?.total}        color="bg-primary"    loading={loading} />
          <StatCard icon={CheckCircle} label="Active Listings"  value={stats?.active}       color="bg-green-500"  loading={loading} />
          <StatCard icon={Mail}        label="Total Enquiries"  value={stats?.enquiries}    color="bg-blue-500"   loading={loading} />
          <StatCard icon={AlertCircle} label="New Enquiries"    value={stats?.newEnquiries} color="bg-accent"     loading={loading} />
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-display font-semibold text-text-main text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/admin/properties/new"
              className="flex items-center gap-4 bg-surface rounded-card shadow-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-10 h-10 bg-primary/10 group-hover:bg-primary rounded-xl flex items-center justify-center transition-colors">
                <Plus size={18} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-text-main text-sm">Add New Property</p>
                <p className="text-xs text-text-muted">Create a new listing</p>
              </div>
              <ChevronRight size={16} className="text-text-muted ml-auto" />
            </Link>

            <Link
              to="/admin/enquiries"
              className="flex items-center gap-4 bg-surface rounded-card shadow-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-50 group-hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors">
                <Mail size={18} className="text-blue-500 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-text-main text-sm">View Enquiries</p>
                <p className="text-xs text-text-muted">
                  {loading ? '…' : stats?.newEnquiries ? `${stats.newEnquiries} unread` : 'All caught up'}
                </p>
              </div>
              <ChevronRight size={16} className="text-text-muted ml-auto" />
            </Link>
          </div>
        </div>

        {/* Properties shortcut */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-text-main text-lg">Manage Listings</h2>
            <Link to="/admin/properties" className="text-sm text-primary hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="bg-surface rounded-card shadow-card p-5 text-center text-text-muted text-sm">
            <Link
              to="/admin/properties"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <Building2 size={16} />
              Go to Properties
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
