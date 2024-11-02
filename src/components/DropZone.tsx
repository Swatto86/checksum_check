import { useState, DragEvent, useCallback } from 'react';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';

interface DropZoneProps {
  onFileDrop: (filePath: string) => void;
  isLoading: boolean;
}

export function DropZone({ onFileDrop, isLoading }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileSelect = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (selected && typeof selected === 'string') {
        onFileDrop(selected);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err as string);
    }
  };

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer?.files || []);
    
    if (files.length === 0) {
      return;
    }

    const file = files[0];
    
    try {
      if ('path' in file) {
        const filePath = (file as any).path;
        const tauriPath = await convertFileSrc(filePath);
        onFileDrop(tauriPath);
      } else {
        throw new Error('File path not available');
      }
    } catch (error) {
      console.error('Error handling file:', error);
      setError(typeof error === 'string' ? error : 'Could not process file');
    }
  }, [onFileDrop]);

  return (
    <div className="space-y-4">
      <div
        onClick={!isLoading ? handleFileSelect : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center
          transition-colors duration-200 
          ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-gray-700 hover:border-gray-600'
          }
        `}
      >
        <div className="text-4xl mb-4">📄</div>
        <p className="text-gray-400 mb-2">
          {isLoading ? 'Processing...' : 'Click or drop a file here to calculate its checksums'}
        </p>
        <p className="text-gray-500 text-sm">
          Files are processed locally - nothing is uploaded
        </p>
      </div>
      
      {error && (
        <div className="p-4 bg-red-900/50 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
}