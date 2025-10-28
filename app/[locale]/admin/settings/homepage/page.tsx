"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { galleryApi } from "@/lib/gallery-api"
import type { GalleryItem } from "@/lib/gallery-types"
import ImageUpload from "@/components/admin/image-upload"
import { Trash2, Edit3, Save, X, Plus, ChevronUp, ChevronDown, ImageIcon } from "lucide-react"
import Image from "next/image"

export default function HomepageGalleryAdmin() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [addingImage, setAddingImage] = useState(false)

  useEffect(() => {
    loadGalleryItems()
  }, [])

  const loadGalleryItems = async () => {
    try {
      setLoading(true)
      const items = await galleryApi.fetchGalleryItems()
      setGalleryItems(items)
    } catch (error) {
      console.error("Failed to load gallery items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      await galleryApi.deleteGalleryItem(id)
      setGalleryItems((items) => items.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Failed to delete item:", error)
    }
  }

  const handleEditStart = (item: GalleryItem) => {
    setEditingId(item.id)
    setEditCaption(item.caption)
  }

  const handleEditSave = async (id: string) => {
    try {
      const updatedItem = await galleryApi.updateGalleryItem({
        id,
        caption: editCaption,
      })

      if (updatedItem) {
        setGalleryItems((items) => items.map((item) => (item.id === id ? updatedItem : item)))
      }

      setEditingId(null)
      setEditCaption("")
    } catch (error) {
      console.error("Failed to update item:", error)
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditCaption("")
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return

    const newOrder = [...galleryItems]
    const [movedItem] = newOrder.splice(index, 1)
    newOrder.splice(index - 1, 0, movedItem)

    try {
      const reorderedItems = await galleryApi.reorderGalleryItems(newOrder.map((item) => item.id))
      setGalleryItems(reorderedItems)
    } catch (error) {
      console.error("Failed to reorder items:", error)
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index === galleryItems.length - 1) return

    const newOrder = [...galleryItems]
    const [movedItem] = newOrder.splice(index, 1)
    newOrder.splice(index + 1, 0, movedItem)

    try {
      const reorderedItems = await galleryApi.reorderGalleryItems(newOrder.map((item) => item.id))
      setGalleryItems(reorderedItems)
    } catch (error) {
      console.error("Failed to reorder items:", error)
    }
  }

  const handleAddImage = async (imageUrl: string, caption: string) => {
    try {
      setAddingImage(true)
      const newItem = await galleryApi.createGalleryItem({
        imageUrl,
        caption,
      })

      setGalleryItems((items) => [...items, newItem])
      setShowAddForm(false)
    } catch (error) {
      console.error("Failed to add item:", error)
      throw error // Re-throw to let ImageUpload handle the error
    } finally {
      setAddingImage(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homepage Gallery</h1>
          <p className="text-muted-foreground mt-2">Manage images and captions for your homepage gallery</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      </div>

      {/* Add New Image Form */}
      {showAddForm && (
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Add New Image
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a file or provide an image URL with a descriptive caption
            </p>
          </div>
          <ImageUpload onImageAdd={handleAddImage} onCancel={() => setShowAddForm(false)} loading={addingImage} />
        </div>
      )}

      {/* Gallery Items */}
      <div className="space-y-4">
        {galleryItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start building your homepage gallery by adding your first image
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Image
              </Button>
            </CardContent>
          </Card>
        ) : (
          galleryItems.map((item, index) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex">
                {/* Image Preview */}
                <div className="w-48 h-32 bg-muted flex-shrink-0">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=128&width=192&text=Image+Not+Found`
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-muted-foreground">Position {item.order}</span>
                        <span className="text-xs text-muted-foreground">• ID: {item.id}</span>
                      </div>

                      {editingId === item.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                            placeholder="Enter caption"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleEditSave(item.id)}>
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleEditCancel}>
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Caption:</p>
                          <p className="text-base leading-relaxed">{item.caption}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === galleryItems.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Edit/Delete Buttons */}
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStart(item)}
                          disabled={editingId !== null}
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                          disabled={editingId !== null}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {galleryItems.length > 0 && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Total images: {galleryItems.length} • Use the arrow buttons to reorder images • Changes are saved
            automatically
          </p>
        </div>
      )}
    </div>
  )
}
