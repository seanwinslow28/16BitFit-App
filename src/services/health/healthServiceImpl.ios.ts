/**
 * iOS HealthKit Implementation
 * Platform-specific implementation for Apple HealthKit
 * Story 1.3 - HealthKit/Connect Integration & Step Sync
 */

import {
  IHealthPlatformService,
  PermissionStatus,
  StepDataPoint,
} from '../../types/health.types';
import {ServiceUnavailableError} from '../../types/health.errors';
// @ts-ignore - react-native-health not yet installed in V4 (will be added when wiring health permissions)
import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';

class HealthServiceIOS implements IHealthPlatformService {
  private readonly permissions: HealthKitPermissions = {
    permissions: {
      read: [AppleHealthKit.Constants.Permissions.StepCount],
      write: [], // Empty array - 16BitFit is read-only, no write permissions needed
    },
  };

  /**
   * Check if HealthKit is available on this device
   * NOTE: HealthKit is unavailable on iPads
   */
  async isAvailable(): Promise<boolean> {
    try {
      return new Promise(resolve => {
        AppleHealthKit.isAvailable((error: Error | null, available: boolean) => {
          if (error) {
            console.warn('HealthKit availability check failed:', error);
            resolve(false);
          } else {
            resolve(available);
          }
        });
      });
    } catch (error) {
      console.warn('HealthKit availability check failed:', error);
      return false;
    }
  }

  /**
   * Request HealthKit permissions from user
   * CRITICAL: User may approve/deny individual permissions
   */
  async requestPermissions(): Promise<PermissionStatus> {
    try {
      // Check availability first
      const available = await this.isAvailable();
      if (!available) {
        return PermissionStatus.Unavailable;
      }

      // Request permissions
      return new Promise(resolve => {
        AppleHealthKit.initHealthKit(this.permissions, (error: string) => {
          if (error) {
            console.error('HealthKit permission request failed:', error);
            resolve(PermissionStatus.Denied);
          } else {
            resolve(PermissionStatus.Granted);
          }
        });
      });
    } catch (error) {
      console.error('HealthKit permission request failed:', error);
      return PermissionStatus.Denied;
    }
  }

  /**
   * Fetch daily step counts for a date range
   * @param startDate - Start of range (inclusive)
   * @param endDate - End of range (inclusive)
   * @returns Array of daily step data points
   */
  async fetchDailySteps(
    startDate: Date,
    endDate: Date,
  ): Promise<StepDataPoint[]> {
    try {
      // Check availability and permissions first
      const available = await this.isAvailable();
      if (!available) {
        throw new ServiceUnavailableError(
          'HealthKit unavailable on this device',
        );
      }

      // Fetch step samples - getDailyStepCountSamples for daily aggregation
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      return new Promise((resolve, reject) => {
        AppleHealthKit.getDailyStepCountSamples(
          options,
          (error: string, results: any[]) => {
            if (error) {
              console.error('HealthKit step fetch failed:', error);
              reject(new Error(error));
              return;
            }

            // Transform to our data format
            const dataPoints: StepDataPoint[] = results.map(sample => {
              // Extract date in YYYY-MM-DD format
              const date = new Date(sample.startDate);
              const dateString = date.toISOString().split('T')[0];

              return {
                date: dateString,
                stepCount: Math.round(sample.value),
                source: 'HealthKit' as const,
              };
            });

            resolve(dataPoints);
          },
        );
      });
    } catch (error) {
      console.error('HealthKit step fetch failed:', error);
      throw error;
    }
  }
}

export default new HealthServiceIOS();
