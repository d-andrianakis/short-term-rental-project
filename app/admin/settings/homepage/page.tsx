import { ImageUploadForm } from '@/components/admin/settings/homepage/imageUploadForm'

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
            <ImageUploadForm />
          </section>
        </div>
      </div>
    </div>
  )
}
