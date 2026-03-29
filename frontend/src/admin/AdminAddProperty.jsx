import AdminLayout from './AdminLayout'
import PropertyForm from './PropertyForm'

export default function AdminAddProperty() {
  return (
    <AdminLayout title="Add New Property">
      <PropertyForm />
    </AdminLayout>
  )
}
