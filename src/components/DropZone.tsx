import { useState, DragEvent, useCallback } from 'react';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { Upload, Loader2 } from 'lucide-react';

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
          relative border-2 border-dashed rounded-xl p-12
          transition-all duration-300 ease-in-out
          ${isLoading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:scale-[1.01]'}
          ${isDragging 
            ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' 
            : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          ) : (
            <Upload className={`w-12 h-12 transition-colors duration-200 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
          )}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-300 mb-2">
              {isLoading ? 'Processing...' : 'Drop your file here'}
            </p>
            <p className="text-sm text-gray-500">
              {isLoading ? 'Please wait while we calculate checksums' : 'or click to browse'}
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-900/50 rounded-lg animate-fade-in">
          <p className="text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
}