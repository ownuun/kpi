import { NextRequest, NextResponse } from 'next/server';
import { MediaType } from '@/types/posts';
import { put } from '@vercel/blob';
import crypto from 'crypto';

/**
 * POST /api/media/upload
 * Upload media file for posts
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as MediaType;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_FILE',
            message: 'No file provided',
          },
        },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: 'File size exceeds 50MB limit',
          },
        },
        { status: 400 }
      );
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'Only images and videos are supported',
          },
        },
        { status: 400 }
      );
    }

    // Generate unique filename with hash
    const fileExtension = file.name.split('.').pop();
    const hash = crypto.randomBytes(16).toString('hex');
    const uniqueFilename = `${hash}.${fileExtension}`;
    
    // Determine folder based on media type
    const folder = isImage ? 'images' : 'videos';
    const blobPath = `${folder}/${uniqueFilename}`;

    // Upload to storage
    let uploadedUrl: string;
    
    // Check if Vercel Blob storage is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Use Vercel Blob Storage
      const blob = await put(blobPath, file, {
        access: 'public',
        contentType: file.type,
      });
      uploadedUrl = blob.url;
    } else if (process.env.CLOUDINARY_URL) {
      // Use Cloudinary (alternative)
      uploadedUrl = await uploadToCloudinary(file, folder);
    } else {
      // Fallback: Save to local storage (development only)
      uploadedUrl = await saveToLocalStorage(file, blobPath);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrl,
      type,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: error instanceof Error ? error.message : 'Failed to upload media',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Upload file to Cloudinary
 */
async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) {
    throw new Error('CLOUDINARY_URL not configured');
  }

  // Parse Cloudinary URL (format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME)
  const matches = cloudinaryUrl.match(/cloudinary:\/\/(\w+):(\w+)@(\w+)/);
  if (!matches) {
    throw new Error('Invalid CLOUDINARY_URL format');
  }

  const [, apiKey, apiSecret, cloudName] = matches;
  const timestamp = Math.floor(Date.now() / 1000);

  // Convert File to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64File = buffer.toString('base64');
  const dataUri = `data:${file.type};base64,${base64File}`;

  // Generate signature
  const signature = crypto
    .createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  // Upload to Cloudinary
  const formData = new FormData();
  formData.append('file', dataUri);
  formData.append('folder', folder);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', apiKey);
  formData.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload to Cloudinary');
  }

  const result = await response.json();
  return result.secure_url;
}

/**
 * Save file to local storage (development only)
 */
async function saveToLocalStorage(file: File, path: string): Promise<string> {
  const fs = await import('fs/promises');
  const pathModule = await import('path');
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = pathModule.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  // Determine subdirectory
  const folder = path.split('/')[0];
  const subDir = pathModule.join(uploadsDir, folder);
  await fs.mkdir(subDir, { recursive: true });

  // Save file
  const filePath = pathModule.join(uploadsDir, path);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  // Return public URL
  return `/uploads/${path}`;
}
