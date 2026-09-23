import React, { useState, useRef } from 'react';
import { UploadCloud, X, AlertCircle } from 'lucide-react';

export interface SelectedFileItem {
  id: string;
  file: File;
  previewUrl: string;
}

interface ProductImageUploaderProps {
  selectedFiles: SelectedFileItem[];
  onChange: (files: SelectedFileItem[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
  isUploading?: boolean;
  uploadProgressText?: string | null;
  disabled?: boolean;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  selectedFiles,
  onChange,
  maxFiles = 5,
  maxSizeMb = 5,
  isUploading = false,
  uploadProgressText = null,
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (newFiles: File[]) => {
    setValidationError(null);

    if (selectedFiles.length + newFiles.length > maxFiles) {
      setValidationError(`Maximum ${maxFiles} images allowed per product.`);
      return;
    }

    const validItems: SelectedFileItem[] = [];

    for (const file of newFiles) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setValidationError(`Invalid format (${file.name}). Only JPEG, PNG, and WEBP are allowed.`);
        return;
      }

      const fileSizeMb = file.size / (1024 * 1024);
      if (fileSizeMb > maxSizeMb) {
        setValidationError(`File too large (${file.name}). Maximum size is ${maxSizeMb} MB.`);
        return;
      }

      validItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    onChange([...selectedFiles, ...validItems]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemove = (id: string) => {
    const fileToRemove = selectedFiles.find((f) => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }
    onChange(selectedFiles.filter((f) => f.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
          Product Images ({selectedFiles.length}/{maxFiles})
        </label>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          JPEG, PNG, WEBP (Max {maxSizeMb}MB each)
        </span>
      </div>

      {validationError && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            color: '#EF4444',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          {validationError}
        </div>
      )}

      {/* Drag and Drop Box */}
      {selectedFiles.length < maxFiles && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          style={{
            border: dragActive
              ? '2px dashed var(--color-orange-primary)'
              : '2px dashed var(--color-border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '24px 16px',
            textAlign: 'center',
            backgroundColor: dragActive
              ? 'rgba(255, 107, 0, 0.05)'
              : 'var(--color-surface-card)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            style={{ display: 'none' }}
          />

          <UploadCloud
            size={36}
            style={{
              margin: '0 auto 8px',
              color: dragActive ? 'var(--color-orange-primary)' : 'var(--color-text-muted)',
            }}
          />

          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            Click or drag product photos here
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Up to {maxFiles} images can be attached to this listing
          </div>
        </div>
      )}

      {/* Previews Grid */}
      {selectedFiles.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '12px',
            marginTop: '4px',
          }}
        >
          {selectedFiles.map((item, index) => (
            <div
              key={item.id}
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                aspectRatio: '1',
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'var(--color-surface-card)',
              }}
            >
              <img
                src={item.previewUrl}
                alt={`Preview ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {index === 0 && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    color: '#FFFFFF',
                  }}
                >
                  Cover
                </span>
              )}

              {!disabled && !isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-orange-primary)',
            fontWeight: 700,
            textAlign: 'center',
            padding: '8px',
          }}
        >
          {uploadProgressText || 'Uploading image data to backend storage...'}
        </div>
      )}
    </div>
  );
};

export default ProductImageUploader;
