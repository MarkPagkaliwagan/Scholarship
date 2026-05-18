import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DOCUMENT_ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
const PHOTO_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export async function POST(req: NextRequest) {
  try {
    const user = await auth.api.getSession({ headers: req.headers });
    if (!user?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const documentName = formData.get("documentName") as string;

    if (!file || !documentName) {
      return NextResponse.json({ error: "File and documentName are required" }, { status: 400 });
    }

    const isPhoto = documentName.toLowerCase().includes("2x2") || documentName.toLowerCase().includes("photo");
    const allowedTypes = isPhoto ? PHOTO_ALLOWED_TYPES : DOCUMENT_ALLOWED_TYPES;
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: isPhoto ? "Invalid file type. Only JPEG and PNG images are allowed for 2x2 photo." : "Invalid file type. Only PDF, JPEG, and PNG are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const uploadsDir = join(process.cwd(), "public", "uploads", "documents");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${safeFileName}`;
    const filePath = join(uploadsDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const [doc] = await db
      .insert(documents)
      .values({
        applicationId: null,
        documentName,
        fileName: file.name,
        filePath: `/uploads/documents/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
        status: "submitted",
        submittedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      document: {
        id: doc.id,
        fileName: file.name,
        filePath: `/uploads/documents/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
