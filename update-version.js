import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

// Get new version from command line argument
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Please provide a version number');
  process.exit(1);
}

try {
  // Update Cargo.toml (in src-tauri directory)
  const cargoPath = join(__dirname, 'src-tauri', 'Cargo.toml');
  let cargoContent = readFileSync(cargoPath, 'utf8');
  cargoContent = cargoContent.replace(
    /version = "(.*?)"/,
    `version = "${newVersion}"`
  );
  writeFileSync(cargoPath, cargoContent);
  console.log('Updated Cargo.toml');

  // Update tauri.conf.json (in src-tauri directory)
  const tauriConfigPath = join(__dirname, 'src-tauri', 'tauri.conf.json');
  const tauriConfig = JSON.parse(readFileSync(tauriConfigPath, 'utf8'));
  tauriConfig.package.version = newVersion;
  writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2));
  console.log('Updated tauri.conf.json');

  // Update package.json (in root directory)
  const packagePath = join(__dirname, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  packageJson.version = newVersion;
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json');

  console.log(`\nSuccessfully updated version to ${newVersion} in all configuration files`);
} catch (error) {
  console.error('Error updating version numbers:', error.message);
  console.error('Error details:', error);
  process.exit(1);
}