export interface ChecksumResult {
    file_path: string;
    md5: string;
    sha1: string;
    sha256: string;
    sha512: string;
    file_size: number;
    modified: number;
  }