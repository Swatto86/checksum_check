import { ChecksumDisplay } from './components/ChecksumDisplay';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">
          Checksum Check
        </h1>
        <div className="text-center text-gray-400 mb-4">
          Select or drop a file to calculate its checksums
        </div>
        <div className="text-center text-gray-500 text-sm mb-8">
          Supports MD5, SHA1, SHA256, and SHA512
        </div>
        <ChecksumDisplay />
      </div>
    </div>
  );
}

export default App;