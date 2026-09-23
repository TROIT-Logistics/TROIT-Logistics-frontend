import React, { useState } from 'react';
import { Product, ProductImage } from '@/lib/api/types';
import {
  uploadProductImage,
  deleteProductImage,
  reorderProductImages,
  fetchProductById,
} from '@/lib/api/products';
import { X, Image as ImageIcon, Trash2, ArrowUp, ArrowDown, UploadCloud, AlertCircle } from 'lucide-react';

interface SellerProductImagesModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: (updatedProduct: Product) => void;
}

export const SellerProductImagesModal: React.FC<SellerProductImagesModalProps> = ({
  product,
  onClose,
  onSuccess,
}) => {
  const [images, setImages] = useState<ProductImage[]>(
    [...(product.images || [])].sort((a, b) => a.sort_order - b.sort_order)
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const refreshProductData = async () => {
    try {
      const refreshed = await fetchProductById(product.id);
      setImages([...(refreshed.images || [])].sort((a, b) => a.sort_order - b.sort_order));
      onSuccess(refreshed);
    } catch {
      // ignore
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setError(null);
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed per product.');
      return;
    }

    setIsUploading(true);

    try {
      for (const file of files) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          setError(`File ${file.name} format is unsupported. Allowed: JPEG, PNG, WEBP.`);
          break;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} exceeds maximum 5 MB limit.`);
          break;
        }
        await uploadProductImage(product.id, file);
      }
      await refreshProductData();
    } catch (err) {
      setError((err as Error).message || 'Failed to upload product image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    setError(null);
    setIsDeleting(imageId);

    try {
      await deleteProductImage(product.id, imageId);
      await refreshProductData();
    } catch (err) {
      setError((err as Error).message || 'Failed to delete image');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleMoveImage = async (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    setError(null);
    setIsReordering(true);

    const reorderedList = [...images];
    const [movedItem] = reorderedList.splice(index, 1);
    if (movedItem) {
      reorderedList.splice(targetIndex, 0, movedItem);
    }

    setImages(reorderedList);

    try {
      const newImageIds = reorderedList.map((img) => img.id);
      const updatedImages = await reorderProductImages(product.id, newImageIds);
      setImages([...updatedImages].sort((a, b) => a.sort_order - b.sort_order));
      await refreshProductData();
    } catch (err) {
      setError((err as Error).message || 'Failed to reorder images');
      // Rollback to previous order
      setImages([...(product.images || [])].sort((a, b) => a.sort_order - b.sort_order));
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={20} style={{ color: 'var(--color-orange-primary)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Manage Product Images</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Manage photos for <strong>{product.name}</strong> ({images.length}/5 images attached).
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              color: '#EF4444',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Existing Images List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {images.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '24px',
                border: '1px dashed var(--color-border-light)',
                borderRadius: '8px',
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem',
              }}
            >
              No images attached to this product yet.
            </div>
          ) : (
            images.map((img, idx) => (
              <div
                key={img.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  backgroundColor: 'var(--color-surface-card)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                }}
              >
                <img
                  src={img.url}
                  alt={`Product img ${idx + 1}`}
                  style={{ width: '54px', height: '54px', borderRadius: '6px', objectFit: 'cover' }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Image {idx + 1}</span>
                    {idx === 0 && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--color-orange-primary)',
                          color: '#FFFFFF',
                          fontWeight: 800,
                        }}
                      >
                        Cover
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {img.mime_type} | {(img.file_size / 1024).toFixed(1)} KB
                  </div>
                </div>

                {/* Reorder Buttons */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => handleMoveImage(idx, 'UP')}
                    disabled={idx === 0 || isReordering}
                    className="btn btn-dark"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    title="Move image up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveImage(idx, 'DOWN')}
                    disabled={idx === images.length - 1 || isReordering}
                    className="btn btn-dark"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    title="Move image down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  disabled={isDeleting === img.id || isReordering}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: '#EF4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Upload Button */}
        {images.length < 5 && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleUploadFile}
              disabled={isUploading}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn btn-orange"
              style={{ width: '100%', fontSize: '0.85rem', padding: '10px' }}
            >
              <UploadCloud size={16} /> {isUploading ? 'Uploading Image...' : 'Upload Additional Image'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-dark"
            style={{ fontSize: '0.85rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProductImagesModal;
