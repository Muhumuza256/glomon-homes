import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import PropertyForm from './PropertyForm'
import Spinner from '../components/ui/Spinner'
import api from '../services/api'

export default function AdminEditProperty() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get(`/api/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch((err) => setError(err.response?.data?.error ?? 'Failed to load property.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <AdminLayout title="Edit Property">
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-btn">
          {error}
        </div>
      )}
      {property && (
        <PropertyForm
          initial={{
            ...property,
            price: String(property.price),
            bedrooms: property.bedrooms != null ? String(property.bedrooms) : '',
            bathrooms: property.bathrooms != null ? String(property.bathrooms) : '',
            area: property.area != null ? String(property.area) : '',
            coverImage: property.coverImage ?? '',
            amenities: property.amenities ?? [],
          }}
          isEdit
          propertyId={id}
        />
      )}
    </AdminLayout>
  )
}
