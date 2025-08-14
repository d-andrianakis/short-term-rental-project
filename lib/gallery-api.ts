import { galleryDatabase } from "./mock-database"
import type { CreateGalleryItemInput, UpdateGalleryItemInput } from "./gallery-types"

// API functions that simulate server-side operations
export const galleryApi = {
  async fetchGalleryItems() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return galleryDatabase.getAll()
  },

  async createGalleryItem(input: CreateGalleryItemInput) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return galleryDatabase.create(input)
  },

  async updateGalleryItem(input: UpdateGalleryItemInput) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return galleryDatabase.update(input)
  },

  async deleteGalleryItem(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return galleryDatabase.delete(id)
  },

  async reorderGalleryItems(itemIds: string[]) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return galleryDatabase.reorder(itemIds)
  },
}
