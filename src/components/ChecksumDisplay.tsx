import { useState } from 'react';
import { invoke } from '@tauri-apps/api';
import type { ChecksumResult } from '../types';
import { DropZone } from './DropZone';

export function ChecksumDisplay(): JSX.Element {
  const [result, setResult] = useState<ChecksumResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFilePath = async (filePath: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const checksumResult = await invoke<ChecksumResult>('calculate_checksum', {
        filePath
      });
      setResult(checksumResult);
    } catch (err) {
      console.error('Error:', err);
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <DropZone onFileDrop={handleFilePath} isLoading={loading} />
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold mb-4 text-white">File Information</h2>
          
          <div className="space-y-2 text-gray-300">
            <p><span className="font-medium">Path:</span> {result.file_path}</p>
            <p><span className="font-medium">Size:</span> {result.file_size.toLocaleString()} bytes</p>
            <p>
              <span className="font-medium">Modified:</span>{' '}
              {new Date(result.modified * 1000).toLocaleString()}
            </p>
          </div>

          <div className="pt-4">
            <h3 className="font-bold mb-3 text-white">Checksums:</h3>
            <div className="space-y-2 font-mono text-sm text-gray-300">
              <p><span className="font-medium text-gray-400">MD5:</span> {result.md5}</p>
              <p><span className="font-medium text-gray-400">SHA1:</span> {result.sha1}</p>
              <p><span className="font-medium text-gray-400">SHA256:</span> {result.sha256}</p>
              <p><span className="font-medium text-gray-400">SHA512:</span> {result.sha512}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}