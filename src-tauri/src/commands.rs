use std::path::PathBuf;
use std::{fs::File, io::Read};
use sha2::{Sha256, Sha512, Digest};
use sha1::Sha1;
use md5::Context as Md5Context;
use std::time::SystemTime;
use serde::Serialize;

#[derive(Serialize)]
pub struct ChecksumResult {
    file_path: String,
    md5: String,
    sha1: String,
    sha256: String,
    sha512: String,
    file_size: u64,
    modified: u64,
}

#[tauri::command]
pub fn calculate_checksum(file_path: String) -> Result<ChecksumResult, String> {
    let path = PathBuf::from(&file_path);
    
    if !path.exists() {
        return Err(format!("File does not exist: {}", file_path));
    }
    
    // Read file with proper error handling
    let mut file = File::open(&path)
        .map_err(|e| format!("Failed to open file: {}", e))?;
    
    // Get file metadata using standard fs
    let metadata = file.metadata()
        .map_err(|e| format!("Failed to read file info: {}", e))?;
    
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)
        .map_err(|e| format!("Failed to read file: {}", e))?;
    
    // Calculate checksums
    let mut md5_hasher = Md5Context::new();
    md5_hasher.consume(&buffer);
    let md5 = format!("{:x}", md5_hasher.compute());
    
    let sha1 = format!("{:x}", Sha1::digest(&buffer));
    let sha256 = format!("{:x}", Sha256::digest(&buffer));
    let sha512 = format!("{:x}", Sha512::digest(&buffer));
    
    // Get modification time
    let modified = metadata
        .modified()
        .map_err(|e| format!("Failed to get modification time: {}", e))?
        .duration_since(SystemTime::UNIX_EPOCH)
        .map_err(|e| format!("Failed to calculate timestamp: {}", e))?
        .as_secs();
    
    Ok(ChecksumResult {
        file_path,
        md5,
        sha1,
        sha256,
        sha512,
        file_size: metadata.len(),
        modified,
    })
}