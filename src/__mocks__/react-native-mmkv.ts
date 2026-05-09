/**
 * Mock for react-native-mmkv
 *
 * Provides an in-memory implementation for testing the Combat Isolation Pattern.
 * This mock is synchronous like the real MMKV, unlike AsyncStorage.
 *
 * IMPORTANT: Uses a shared module-level storage so all MMKV instances see the same data.
 * This simulates the real MMKV behavior where all instances access the same underlying store.
 */

// Shared storage across all MockMMKV instances (simulates real MMKV behavior)
const sharedStorage: Map<string, string | number | boolean> = new Map();

class MockMMKV {
  set(key: string, value: string | number | boolean): void {
    sharedStorage.set(key, value);
  }

  getString(key: string): string | undefined {
    const value = sharedStorage.get(key);
    return typeof value === 'string' ? value : undefined;
  }

  getNumber(key: string): number | undefined {
    const value = sharedStorage.get(key);
    return typeof value === 'number' ? value : undefined;
  }

  getBoolean(key: string): boolean | undefined {
    const value = sharedStorage.get(key);
    return typeof value === 'boolean' ? value : undefined;
  }

  delete(key: string): void {
    sharedStorage.delete(key);
  }

  contains(key: string): boolean {
    return sharedStorage.has(key);
  }

  clearAll(): void {
    sharedStorage.clear();
  }

  getAllKeys(): string[] {
    return Array.from(sharedStorage.keys());
  }
}

export const MMKV = MockMMKV;
export const createMMKV = () => new MockMMKV();
export default MockMMKV;
