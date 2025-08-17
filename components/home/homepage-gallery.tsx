"use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules"
import { galleryApi } from "@/lib/gallery-api"
import type { GalleryItem } from "@/lib/gallery-types"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

interface HomepageGalleryProps {
  className?: string
  autoplay?: boolean
  showCaptions?: boolean
  effect?: "slide" | "fade"
  slidesPerView?: number | "auto"
}

export default function HomepageGallery({
  className = "",
  autoplay = true,
  showCaptions = true,
  effect = "slide",
  slidesPerView = 1,
}: HomepageGalleryProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGalleryItems()
  }, [])

  const loadGalleryItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await galleryApi.fetchGalleryItems()
      setGalleryItems(items)
    } catch (err) {
      console.error("Failed to load gallery items:", err)
      setError("Failed to load gallery images")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || galleryItems.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">{error || "No gallery images available"}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={slidesPerView}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet-custom",
          bulletActiveClass: "swiper-pagination-bullet-active-custom",
        }}
        autoplay={
          autoplay
            ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        effect={effect}
        fadeEffect={{
          crossFade: true,
        }}
        loop={galleryItems.length > 1}
        className="rounded-lg overflow-hidden"
      >
        {galleryItems.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative aspect-[16/9] bg-muted">
              {/* <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.caption}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=400&width=800&text=Image+Not+Found`
                }}
              /> */}

              {showCaptions && item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                  <p className="text-white text-lg font-medium leading-relaxed">{item.caption}</p>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        {galleryItems.length > 1 && (
          <>
            <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </Swiper>

      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
        }
        
        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          margin: 0 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active-custom {
          background: white;
          transform: scale(1.2);
        }
        
        .swiper-pagination-bullet-custom:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}
