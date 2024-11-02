import { ChecksumDisplay } from './components/ChecksumDisplay';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 inline-block">
              Checksum Check
            </h1>
            <div className="space-y-2">
              <p className="text-gray-300 text-lg">
                Select or drop a file to calculate its checksums
              </p>
              <p className="text-gray-400 text-sm">
                Supports MD5, SHA1, SHA256, and SHA512
              </p>
            </div>
          </div>
          <ChecksumDisplay />
          <footer className="text-center text-gray-500 text-sm mt-8">
            <p>All calculations are performed locally on your device</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;