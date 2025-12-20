/**
 * Adapter Factory
 *
 * Central registry for all social media platform adapters.
 * Provides a unified interface to get the appropriate adapter for any platform.
 */

import type { ISocialAdapter } from './base.adapter';
import { SocialPlatform } from '@prisma/client';

/**
 * Adapter registry type
 */
type AdapterRegistry = {
  [K in SocialPlatform]?: ISocialAdapter;
};

/**
 * Adapter Factory class
 */
class AdapterFactory {
  private adapters: AdapterRegistry = {};

  /**
   * Register a platform adapter
   *
   * @param platform - The social media platform
   * @param adapter - The adapter instance
   */
  register(platform: SocialPlatform, adapter: ISocialAdapter): void {
    this.adapters[platform] = adapter;
  }

  /**
   * Get adapter for a platform
   *
   * @param platform - The social media platform
   * @returns The adapter instance
   * @throws Error if adapter is not registered
   */
  getAdapter(platform: SocialPlatform): ISocialAdapter {
    const adapter = this.adapters[platform];

    if (!adapter) {
      throw new Error(
        `No adapter registered for platform: ${platform}. ` +
        `Available platforms: ${this.getAvailablePlatforms().join(', ')}`
      );
    }

    return adapter;
  }

  /**
   * Check if a platform adapter is registered
   *
   * @param platform - The social media platform
   * @returns True if adapter is registered
   */
  hasAdapter(platform: SocialPlatform): boolean {
    return !!this.adapters[platform];
  }

  /**
   * Get all available platforms
   *
   * @returns List of registered platform names
   */
  getAvailablePlatforms(): SocialPlatform[] {
    return Object.keys(this.adapters) as SocialPlatform[];
  }

  /**
   * Get all registered adapters
   *
   * @returns Map of platform to adapter
   */
  getAllAdapters(): AdapterRegistry {
    return { ...this.adapters };
  }

  /**
   * Unregister a platform adapter
   *
   * @param platform - The social media platform
   */
  unregister(platform: SocialPlatform): void {
    delete this.adapters[platform];
  }

  /**
   * Clear all registered adapters
   */
  clear(): void {
    this.adapters = {};
  }
}

// Export singleton instance
export const adapterFactory = new AdapterFactory();

/**
 * Helper function to get adapter
 *
 * @param platform - The social media platform
 * @returns The adapter instance
 */
export function getAdapter(platform: SocialPlatform): ISocialAdapter {
  return adapterFactory.getAdapter(platform);
}

/**
 * Helper function to check if platform is supported
 *
 * @param platform - The social media platform
 * @returns True if platform is supported
 */
export function isPlatformSupported(platform: SocialPlatform): boolean {
  return adapterFactory.hasAdapter(platform);
}

/**
 * Get platform limits for a platform
 *
 * @param platform - The social media platform
 * @returns Platform limits or null if not supported
 */
export function getPlatformLimits(platform: SocialPlatform) {
  if (!adapterFactory.hasAdapter(platform)) {
    return null;
  }

  const adapter = adapterFactory.getAdapter(platform);
  return adapter.getPlatformLimits();
}
