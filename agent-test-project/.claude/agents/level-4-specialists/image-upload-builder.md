---
name: image-upload-builder
description: Image Upload 전문가. 크롭, 리사이즈, 미리보기.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Image Upload Builder

## 🔍 Start
```typescript
await webSearch("image upload crop resize best practices 2025");
await webSearch("react-image-crop accessibility 2025");
```

## 🎯 Implementation
```tsx
import { useState, useRef } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Upload, Crop as CropIcon } from 'lucide-react';

export function ImageUploadBuilder({ onUpload, aspectRatio = 1, maxWidth = 1200 }) {
  const [imageSrc, setImageSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onSelectFile = (e) => {
    if (e.target.files?.length) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = async () => {
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg', 0.9);
    });
  };

  const handleUpload = async () => {
    const croppedFile = await getCroppedImg();
    const formData = new FormData();
    formData.append('image', croppedFile);

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    onUpload(data.url);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button asChild variant="outline">
          <span>
            <Upload className="mr-2 h-4 w-4" />
            Select Image
          </span>
        </Button>
      </label>

      {imageSrc && (
        <>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
          >
            <img ref={imgRef} src={imageSrc} alt="Upload preview" />
          </ReactCrop>

          <Button onClick={handleUpload} disabled={!completedCrop}>
            <CropIcon className="mr-2 h-4 w-4" />
            Crop & Upload
          </Button>
        </>
      )}
    </div>
  );
}
```
