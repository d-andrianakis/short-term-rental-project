"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Upload, X, CheckCircle, AlertCircle, ImageIcon } from "lucide-react"

import { createUpdateSetting } from "../../actions/createUpdateSetting";

interface UploadedFile {
  file: File
  preview: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  id: string
}

export function ImageUploadForm() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadedFile[] = []

    Array.from(selectedFiles).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast("Invalid file type")
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast("File too large")
        return
      }

      const preview = URL.createObjectURL(file)
      newFiles.push({
        file,
        preview,
        status: "pending",
        progress: 0,
        id: Math.random().toString(36).substr(2, 9),
      })
    })

    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const uploadFile = async (id: string) => {
    const fileIndex = files.findIndex((f) => f.id === id)
    if (fileIndex === -1) return

    const file = files[fileIndex]

    // Update status to uploading
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "uploading" as const, progress: 0 } : f)))

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress } : f)))
      }

      const formData = new FormData()
      formData.append("image", file.file)

      const response = await fetch("/api/admin/settings/homepage", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      // Update status to success
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "success" as const, progress: 100 } : f)))

      

      toast("Upload successful")
    } catch (error) {
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "error" as const } : f)))

      toast("Upload failed")
    }
  }

  const uploadAllFiles = async () => {
    const pendingFiles = files.filter((file) => file.status === "pending")

    for (const file of pendingFiles) {
      await uploadFile(file.id)
    }
  }

  const clearAllFiles = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview))
    setFiles([])
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image Upload
        </CardTitle>
        <CardDescription>
          Upload images for your content. Supported formats: JPG, PNG, GIF, WebP (max 5MB each)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
            isDragOver
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full transition-colors ${isDragOver ? "bg-primary/10" : "bg-muted"}`}>
              <Upload className={`h-8 w-8 ${isDragOver ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-lg font-medium">{isDragOver ? "Drop images here" : "Drop images here"}</p>
              <p className="text-sm text-muted-foreground">or click to browse files</p>
            </div>
            <Button type="button" variant="outline" size="sm">
              Choose Files
            </Button>
          </div>
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Selected Files ({files.length})</Label>
              <div className="flex gap-2">
                {files.some((f) => f.status === "pending") && (
                  <Button onClick={uploadAllFiles} size="sm">
                    Upload All
                  </Button>
                )}
                <Button onClick={clearAllFiles} variant="outline" size="sm">
                  Clear All
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/abstract-colorful-swirls.png"
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>

                    {file.status === "uploading" && (
                      <div className="mt-2 space-y-1">
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">Uploading... {file.progress}%</p>
                      </div>
                    )}

                    {file.status === "success" && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Upload complete
                      </p>
                    )}

                    {file.status === "error" && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Upload failed
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === "pending" && (
                      <Button size="sm" onClick={() => uploadFile(file.id)}>
                        Upload
                      </Button>
                    )}

                    {file.status === "error" && (
                      <Button size="sm" variant="outline" onClick={() => uploadFile(file.id)}>
                        Retry
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(file.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
