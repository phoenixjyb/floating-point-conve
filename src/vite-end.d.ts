/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

declare module "@github/spark/spark" {
  // This module provides GitHub Spark runtime functionality
}

declare module "@github/spark/hooks" {
  export function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void];
}