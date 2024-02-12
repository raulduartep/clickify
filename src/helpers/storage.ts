import { EnvHelper } from "./env";

class ExtensionStorageHelper {
  static async get<T extends Record<string, any> = Record<string, any>>(
    key: string | string[]
  ): Promise<T> {
    const storage = await chrome.storage.local.get(key);
    const values = Object.entries(storage).reduce((acc, [key, value]) => {
      acc[key] = value ?? undefined;
      return acc;
    }, {} as Record<string, any>);

    return values as T;
  }

  static async set(data: Record<string, any>): Promise<void> {
    await chrome.storage.local.set(data);
  }

  static async remove(key: string | string[]): Promise<void> {
    await chrome.storage.local.remove(key);
  }

  static listen(callback: (newValues: Record<string, any>) => void) {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName !== "local") return;

      const newValues = Object.entries(changes).reduce((acc, [key, value]) => {
        acc[key] = value.newValue ?? undefined;
        return acc;
      }, {} as Record<string, any>);

      callback(newValues);
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }
}

class WindowStorageHelper {
  static async get<T extends Record<string, any> = Record<string, any>>(
    key: string | string[]
  ): Promise<T> {
    const keys = Array.isArray(key) ? key : [key];

    const storage = keys.reduce((acc, key) => {
      const value = window.localStorage.getItem(key);
      acc[key] = value ? JSON.parse(value) : undefined;
      return acc;
    }, {} as Record<string, any>);

    return storage as T;
  }

  static async set(data: Record<string, any>): Promise<void> {
    Object.entries(data).forEach(([key, value]) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    });
  }

  static async remove(key: string | string[]): Promise<void> {
    const keys = Array.isArray(key) ? key : [key];
    keys.forEach((key) => window.localStorage.removeItem(key));
  }

  static listen() {
    // Window storage doesn't have a listener for changes
    return () => { };
  }
}

export const StorageHelper = EnvHelper.DEV
  ? WindowStorageHelper
  : ExtensionStorageHelper;
