export interface GalleryItem {
  id: string
  imageUrl: string
  caption: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateGalleryItemInput {
  imageUrl: string
  caption: string
}

export interface UpdateGalleryItemInput {
  id: string
  imageUrl?: string
  caption?: string
  order?: number
}
