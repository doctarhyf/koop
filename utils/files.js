import { File } from "expo-file-system";

// Thin wrappers around the expo-file-system `File` API (SDK 54+).
// The legacy `FileSystem.readAsStringAsync` / `getInfoAsync` functions
// imported from "expo-file-system" now throw at runtime.

export const readFileBase64 = (uri) => new File(uri).base64();

export const fileExists = (uri) => new File(uri).exists;
