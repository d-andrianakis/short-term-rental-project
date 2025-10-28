import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { db } from "@/db/drizzle";
import { settings } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public/uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, ignore error
      console.log(error);
    }

    // Save the file to public/uploads directory
    const filePath = path.join(uploadsDir, filename)
    await writeFile(filePath, buffer)

    const dbResult = await db
      .insert(settings)
      .values({
        key: "hero_slider",
        fileName: filename,
        originalName: file.name,
        filePath: `/uploads/${filename}`,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
      })
      .returning()

    return NextResponse.json({
      success: true,
      filename,
      url: `/uploads/${filename}`,
      size: file.size,
      type: file.type,
      id: dbResult[0].id,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
