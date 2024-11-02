declare module '@tauri-apps/api' {
  export function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
}

declare module '@tauri-apps/api/dialog' {
  export function open(options: {
    multiple?: boolean;
    filters?: Array<{
      name: string;
      extensions: string[];
    }>;
  }): Promise<string | string[] | null>;
}

declare module '@tauri-apps/api/tauri' {
  export function convertFileSrc(filePath: string): string;
}