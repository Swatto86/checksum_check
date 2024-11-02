import { useState, useEffect } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { Upload, Loader2 } from 'lucide-react';
import { listen } from '@tauri-apps/api/event';

interface DropZoneProps {
  onFileDrop: (filePath: string) => void;
  isLoading: boolean;
}

export function DropZone({ onFileDrop, isLoading }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up Tauri file drop listeners');

    const unlisten = listen('tauri://file-drop', (event: any) => {
      console.log('Tauri file drop event:', event);
      const paths = event.payload as string[];
      
      if (paths.length > 0) {
        console.log('File dropped:', paths[0]);
        onFileDrop(paths[0]);
      }
    });

    const unlistenHover = listen('tauri://file-drop-hover', () => {
      console.log('File hover detected');
      setIsDragging(true);
    });

    const unlistenCancelled = listen('tauri://file-drop-cancelled', () => {
      console.log('File drop cancelled');
      setIsDragging(false);
    });

    return () => {
      unlisten.then(f => f());
      unlistenHover.then(f => f());
      unlistenCancelled.then(f => f());
    };
  }, [onFileDrop]);

  const handleFileSelect = async () => {
    console.log('File picker clicked');
    try {
      const selected = await open({
        multiple: false,
        filters: [
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (selected && typeof selected === 'string') {
        console.log('File selected:', selected);
        onFileDrop(selected);
      }
    } catch (err) {
      console.error('Error in file select:', err);
      setError(typeof err === 'string' ? err : 'Failed to open file dialog');
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={!isLoading ? handleFileSelect : undefined}
        className={`
          relative overflow-hidden rounded-xl
          transition-all duration-300 ease-in-out
          ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.01]'}
        `}
      >
        {/* Background layer */}
        <div className={`
          absolute inset-0 transition-opacity duration-300
          ${isDragging 
            ? 'opacity-100 bg-gradient-to-b from-blue-500/10 to-purple-500/10' 
            : 'opacity-0 bg-gray-800/50'
          }
        `} />

        {/* Border layer */}
        <div className={`
          absolute inset-0 transition-opacity duration-300
          border-2 rounded-xl
          ${isDragging 
            ? 'border-blue-400/50 opacity-100' 
            : 'border-gray-700 opacity-50 hover:opacity-100 hover:border-gray-600'
          }
        `} />

        {/* Content */}
        <div className="relative px-8 py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            {isLoading ? (
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            ) : (
              <Upload 
                className={`w-12 h-12 transition-colors duration-300 
                  ${isDragging ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'}`} 
              />
            )}
            <div className="text-center">
              <p className={`
                text-lg font-medium mb-2 transition-colors duration-300
                ${isDragging ? 'text-blue-300' : 'text-gray-300'}
              `}>
                {isLoading ? 'Processing...' : 'Drop your file here'}
              </p>
              <p className="text-sm text-gray-500">
                {isLoading ? 'Please wait while we calculate checksums' : 'or click to browse'}
              </p>
            </div>
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