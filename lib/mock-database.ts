import type { GalleryItem, CreateGalleryItemInput, UpdateGalleryItemInput } from "./types"

// Mock database storage
const mockGalleryItems: GalleryItem[] = [
  {
    id: "1",
    imageUrl: "/modern-architecture-building.png",
    caption: "Modern Architecture Showcase",
    order: 1,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    imageUrl: "/beautiful-landscape-sunset.png",
    caption: "Stunning Landscape Views",
    order: 2,
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    imageUrl: "/placeholder-jikhv.png",
    caption: "Creative Design Process",
    order: 3,
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
]

// Simulate database operations
export const galleryDatabase = {
  // Get all gallery items ordered by order field
  async getAll(): Promise<GalleryItem[]> {
    return [...mockGalleryItems].sort((a, b) => a.order - b.order)
  },

  // Get single gallery item by ID
  async getById(id: string): Promise<GalleryItem | null> {
    return mockGalleryItems.find((item) => item.id === id) || null
  },

  // Create new gallery item
  async create(input: CreateGalleryItemInput): Promise<GalleryItem> {
    const maxOrder = Math.max(...mockGalleryItems.map((item) => item.order), 0)
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      imageUrl: input.imageUrl,
      caption: input.caption,
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockGalleryItems.push(newItem)
    return newItem
  },

  // Update existing gallery item
  async update(input: UpdateGalleryItemInput): Promise<GalleryItem | null> {
    const index = mockGalleryItems.findIndex((item) => item.id === input.id)
    if (index === -1) return null

    const updatedItem = {
      ...mockGalleryItems[index],
      ...input,
      updatedAt: new Date(),
    }

    mockGalleryItems[index] = updatedItem
    return updatedItem
  },

  // Delete gallery item
  async delete(id: string): Promise<boolean> {
    const index = mockGalleryItems.findIndex((item) => item.id === id)
    if (index === -1) return false

    mockGalleryItems.splice(index, 1)
    return true
  },

  // Reorder gallery items
  async reorder(itemIds: string[]): Promise<GalleryItem[]> {
    const reorderedItems = itemIds
      .map((id, index) => {
        const item = mockGalleryItems.find((item) => item.id === id)
        if (item) {
          return {
            ...item,
            order: index + 1,
            updatedAt: new Date(),
          }
        }
        return null
      })
      .filter(Boolean) as GalleryItem[]

    // Update the mock database
    reorderedItems.forEach((updatedItem) => {
      const index = mockGalleryItems.findIndex((item) => item.id === updatedItem.id)
      if (index !== -1) {
        mockGalleryItems[index] = updatedItem
      }
    })

    return reorderedItems
  },
}
