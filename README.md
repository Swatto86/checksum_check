# Checksum Check

A modern, cross-platform desktop application for verifying file checksums, built with Tauri and React. This tool provides a user-friendly interface for calculating and verifying file hashes, essential for ensuring file integrity.

## Features

- **Multiple Hash Algorithms:** MD5, SHA-1, SHA-256, SHA-512
- **User-Friendly Interface:** Native file picker dialog and drag and drop support, copy hash results to clipboard, clear visual feedback for hash verification.
- **Performance:** Fast hash calculation using Rust's native cryptography libraries, efficient handling of large files, non-blocking UI during hash calculations.

## Version Information

Application Version: 1.2.0 (Current release version)
Tauri Version: ^1.5.4
React Version: ^18.2.0
Vite Version: ^5.0.0

## Installation

### Build from Source

#### Prerequisites

- Node.js ≥ 18.0.0
- Rust ≥ 1.75.0
- npm ≥ 10.0.0

#### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Swatto86/checksum_check.git
   cd checksum_check
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run in development mode:

   ```bash
   npm run tauri dev
   ```

4. Build for production:

   ```bash
   npm run tauri build
   ```

   Find the built application in `src-tauri/target/release`

## Usage

1. Launch the application.
2. Select your preferred hash algorithm.
3. Either drag and drop a file or use the file picker.
4. View the calculated hash.
5. (Optional) Paste an expected hash to verify the match.

## Tech Stack

- **Frontend:** React 18 with TypeScript
- **Backend:** Rust (Tauri)
- **Build Tool:** Vite
- **Styling:** CSS Modules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tauri](https://tauri.app/) for the framework.
- [React](https://reactjs.org/) for the UI library.
- The Rust and JavaScript communities for their excellent tools and libraries.
