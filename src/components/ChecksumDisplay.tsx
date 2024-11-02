import { useState } from 'react';
import { invoke } from '@tauri-apps/api';
import type { ChecksumResult } from '../types';
import { DropZone } from './DropZone';
import { Copy, Check } from 'lucide-react';

function ChecksumRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors group">
      <div className="w-20 flex-shrink-0">
        <span className="font-medium text-gray-400">{label}:</span>
      </div>
      <div className="flex-grow font-mono text-sm text-gray-300 break-all">
        {value}
      </div>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-600"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
    </div>
  );
}

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
        <div className="p-4 bg-red-900/50 rounded-lg animate-fade-in">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 space-y-6 animate-fade-in shadow-xl">
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">File Information</h2>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center">
                <span className="font-medium w-20">Path:</span>
                <span className="break-all">{result.file_path}</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium w-20">Size:</span>
                <span>{result.file_size.toLocaleString()} bytes</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium w-20">Modified:</span>
                <span>{new Date(result.modified * 1000).toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="font-bold mb-4 text-white">Checksums</h3>
            <div className="space-y-2 bg-gray-800/50 rounded-lg p-2">
              <ChecksumRow label="MD5" value={result.md5} />
              <ChecksumRow label="SHA1" value={result.sha1} />
              <ChecksumRow label="SHA256" value={result.sha256} />
              <ChecksumRow label="SHA512" value={result.sha512} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}