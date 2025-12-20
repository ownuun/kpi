---
name: file-upload-builder
description: File Upload 전문가. Drag & Drop, 미리보기, 진행률.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# File Upload Builder

## 🔍 Start
```typescript
await webSearch("file upload drag drop best practices 2025");
await webSearch("react-dropzone accessibility 2025");
```

## 🎯 Implementation
```tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function FileUploadBuilder({
  onUpload,
  accept = { 'image/*': [] },
  maxSize = 5 * 1024 * 1024,
  multiple = false
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    setFiles(acceptedFiles);
    setUploading(true);

    const formData = new FormData();
    acceptedFiles.forEach(file => formData.append('files', file));

    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress((e.loaded / e.total) * 100);
        }
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);

      xhr.onload = () => {
        if (xhr.status === 200) {
          onUpload(JSON.parse(xhr.response));
        }
        setUploading(false);
      };
    } catch (error) {
      console.error('[UPLOAD_ERROR]', error);
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p>Drop files here...</p>
        ) : (
          <div>
            <p className="font-medium">Click or drag files to upload</p>
            <p className="text-sm text-muted-foreground mt-2">
              Max size: {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="mt-4">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}%</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 p-2 border rounded">
              <FileIcon className="h-4 w-4" />
              <span className="text-sm flex-1">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </span>
              <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```
