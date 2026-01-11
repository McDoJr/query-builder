import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

export function encodeQuery(query: unknown): string {
  return compressToEncodedURIComponent(JSON.stringify(query));
}

export function decodeQuery<T = unknown>(value: string): T | null {
  try {
    const json = decompressFromEncodedURIComponent(value);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}
