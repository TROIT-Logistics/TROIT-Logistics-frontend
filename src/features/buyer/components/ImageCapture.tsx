import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, Sparkles, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import { ALLOWED_MIME_TYPES, validateSearchImage } from '@/services/visualSearch';

interface ImageCaptureProps {
  onImageSelected: (file: File | Blob, previewUrl: string) => void;
  onStartAnalysis: () => void;
  selectedPreviewUrl: string | null;
  onClearImage: () => void;
}

export const ImageCapture: React.FC<ImageCaptureProps> = ({
  onImageSelected,
  onStartAnalysis,
  selectedPreviewUrl,
  onClearImage,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up camera stream on unmount or when camera turns off
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const handleStartCamera = async () => {
    setCameraError(null);
    setValidationError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Fall back to native camera input on mobile devices
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
        return;
      }
      setCameraError('Camera access is not supported by your browser. Please upload an image file instead.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);

      // Attach stream to video element once rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {
            // Video autoplay error fallback
          });
        }
      }, 100);
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      const domErr = err as DOMException;
      if (domErr.name === 'NotAllowedError' || domErr.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please grant camera access in your browser settings, or upload an image file.');
      } else if (domErr.name === 'NotFoundError' || domErr.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on your device. Please upload an image file instead.');
      } else {
        setCameraError('Unable to open camera. Please upload an image file instead.');
      }
      setIsCameraActive(false);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          stopCameraStream();
          const previewUrl = URL.createObjectURL(blob);
          onImageSelected(blob, previewUrl);
        }
      },
      'image/jpeg',
      0.9
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    setCameraError(null);
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const error = validateSearchImage(file);
    if (error) {
      setValidationError(error.message);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    onImageSelected(file, previewUrl);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setValidationError(null);
    setCameraError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // 1. IMAGE PREVIEW MODE
  if (selectedPreviewUrl) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '340px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--color-orange-primary)',
          }}
        >
          <img
            src={selectedPreviewUrl}
            alt="Selected product preview for AI analysis"
            style={{
              maxWidth: '100%',
              maxHeight: '340px',
              objectFit: 'contain',
            }}
          />

          <button
            type="button"
            onClick={onClearImage}
            title="Remove image"
            aria-label="Remove image"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', width: '100%', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onClearImage}
            className="btn btn-dark"
            style={{ flex: '1 1 140px', justifyContent: 'center' }}
          >
            <RefreshCw size={16} /> Choose Another / Retake
          </button>

          <button
            type="button"
            onClick={onStartAnalysis}
            className="btn btn-orange"
            style={{ flex: '1 1 180px', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 700 }}
          >
            <Sparkles size={18} /> Analyze Product
          </button>
        </div>
      </div>
    );
  }

  // 2. LIVE CAMERA STREAM MODE
  if (isCameraActive) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '320px',
            backgroundColor: '#000000',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--color-orange-primary)',
          }}
        >
          <video
            ref={videoRef}
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Viewfinder Overlay Lines */}
          <div
            style={{
              position: 'absolute',
              inset: '20px',
              border: '2px dashed rgba(255, 255, 255, 0.5)',
              borderRadius: '12px',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button
            type="button"
            onClick={stopCameraStream}
            className="btn btn-dark"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCapturePhoto}
            className="btn btn-orange"
            style={{ flex: 2, justifyContent: 'center', fontWeight: 700 }}
          >
            <Camera size={18} /> Snap Photo
          </button>
        </div>
      </div>
    );
  }

  // 3. DEFAULT CAPTURE & UPLOAD INITIAL SELECTION STATE
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Error Banners */}
      {cameraError && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            color: '#EF4444',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{cameraError}</span>
        </div>
      )}

      {validationError && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            color: '#EF4444',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Primary Capture Action Options */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <button
          type="button"
          onClick={handleStartCamera}
          className="btn btn-orange"
          style={{
            padding: '24px 16px',
            flexDirection: 'column',
            gap: '10px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Camera size={28} />
          <span style={{ fontSize: '1rem', fontWeight: 700 }}>Take Photo</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.9 }}>
            Use device camera to snap item
          </span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-dark"
          style={{
            padding: '24px 16px',
            flexDirection: 'column',
            gap: '10px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Upload size={28} style={{ color: 'var(--color-yellow-accent)' }} />
          <span style={{ fontSize: '1rem', fontWeight: 700 }}>Upload Image</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.8 }}>
            JPG, PNG, or WEBP (Max 10MB)
          </span>
        </button>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragOver ? 'var(--color-orange-primary)' : 'var(--color-border-light)'}`,
          backgroundColor: isDragOver ? 'rgba(255,77,0,0.05)' : 'var(--color-surface-card)',
          borderRadius: 'var(--radius-md)',
          padding: '28px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <ImageIcon size={32} style={{ color: 'var(--color-text-light)', marginBottom: '10px' }} />
        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>
          Drag & drop product image here, or click to browse
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Supports JPG, JPEG, PNG, WEBP files
        </p>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_MIME_TYPES.join(',')}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {/* Mobile Camera Input Fallback */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageCapture;
