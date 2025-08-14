"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, ImageIcon, Link, FileImage, AlertCircle } from "lucide-react"

interface ImageUploadProps {
  onImageAdd: (imageUrl: string, caption: string) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

interface UploadedFile {
  file: File
  preview: string
  error?: string
}

export default function ImageUpload({ onImageAdd, onCancel, loading = false }: ImageUploadProps) {
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload")
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [caption, setCaption] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [urlPreview, setUrlPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "Please select an image file"
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return "File size must be less than 10MB"
    }

    // Check file type specifically
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, GIF, and WebP images are allowed"
    }

    return null
  }

  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file)

    if (error) {
      setUploadedFile({ file, preview: "", error })
      return
    }

    const preview = URL.createObjectURL(file)
    setUploadedFile({ file, preview })
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0])
      }
    },
    [handleFileSelect],
  )

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUrlPreview = async () => {
    if (!imageUrl.trim()) return

    try {
      // Create a temporary image to test if URL is valid
      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageUrl
      })

      setUrlPreview(imageUrl)
    } catch (error) {
      setUrlPreview(null)
      console.error("Invalid image URL:", error)
    }
  }

  const handleSubmit = async () => {
    let finalImageUrl = ""

    if (uploadMethod === "upload" && uploadedFile && !uploadedFile.error) {
      // In a real app, you would upload the file to a server/cloud storage
      // For now, we'll use the blob URL (this won't persist after page refresh)
      finalImageUrl = uploadedFile.preview
    } else if (uploadMethod === "url" && imageUrl.trim()) {
      finalImageUrl = imageUrl.trim()
    }

    if (!finalImageUrl || !caption.trim()) {
      return
    }

    try {
      await onImageAdd(finalImageUrl, caption)

      // Reset form
      setUploadedFile(null)
      setImageUrl("")
      setCaption("")
      setUrlPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Failed to add image:", error)
    }
  }

  const handleCancel = () => {
    // Clean up blob URLs
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview)
    }
    if (urlPreview) {
      setUrlPreview(null)
    }

    setUploadedFile(null)
    setImageUrl("")
    setCaption("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onCancel()
  }

  const removeUploadedFile = () => {
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview)
    }
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const canSubmit =
    caption.trim() &&
    ((uploadMethod === "upload" && uploadedFile && !uploadedFile.error) || (uploadMethod === "url" && imageUrl.trim()))

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Upload Method Toggle */}
          <div>
            <label className="text-sm font-medium mb-3 block">Choose Upload Method</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={uploadMethod === "upload" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadMethod("upload")}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
              <Button
                type="button"
                variant={uploadMethod === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadMethod("url")}
                className="gap-2"
              >
                <Link className="h-4 w-4" />
                Image URL
              </Button>
            </div>
          </div>

          {/* File Upload Section */}
          {uploadMethod === "upload" && (
            <div>
              <label className="text-sm font-medium mb-3 block">Upload Image</label>

              {!uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drop your image here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-4">Supports JPEG, PNG, GIF, WebP • Max 10MB</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    {uploadedFile.error ? (
                      <div className="border border-destructive rounded-lg p-4 bg-destructive/5">
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">{uploadedFile.error}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative border rounded-lg overflow-hidden">
                        <img
                          src={uploadedFile.preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button type="button" variant="destructive" size="sm" onClick={removeUploadedFile}>
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{uploadedFile.file.name}</span>
                    <span>{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>

                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Choose Different File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}

          {/* URL Input Section */}
          {uploadMethod === "url" && (
            <div>
              <label className="text-sm font-medium mb-3 block">Image URL</label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onBlur={handleUrlPreview}
                  />
                  <Button type="button" variant="outline" onClick={handleUrlPreview} disabled={!imageUrl.trim()}>
                    Preview
                  </Button>
                </div>

                {urlPreview && (
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={urlPreview || "/placeholder.svg"}
                      alt="URL Preview"
                      className="w-full h-48 object-cover"
                      onError={() => setUrlPreview(null)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Caption Input */}
          <div>
            <label className="text-sm font-medium mb-3 block">Caption</label>
            <Textarea
              placeholder="Enter a descriptive caption for this image"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={!canSubmit || loading} className="gap-2">
              <ImageIcon className="h-4 w-4" />
              {loading ? "Adding..." : "Add Image"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
