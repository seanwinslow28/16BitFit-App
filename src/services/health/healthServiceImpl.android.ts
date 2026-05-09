/**
 * Android Health Connect Implementation
 * Platform-specific implementation for Google Health Connect
 * Story 1.3 - HealthKit/Connect Integration & Step Sync
 */

import {
  IHealthPlatformService,
  PermissionStatus,
  StepDataPoint,
} from '../../types/health.types';
import {ServiceUnavailableError} from '../../types/health.errors';
// react-native-health-connect not yet installed in V4 (will be added when wiring health permissions)
// @ts-ignore
import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
  // @ts-ignore
  type Permission,
  // @ts-ignore
} from 'react-native-health-connect';

class HealthServiceAndroid implements IHealthPlatformService {
  private initialized = false;

  /**
   * Check if Health Connect is installed and available
   * CRITICAL: Health Connect is a separate app that must be installed
   */
  async isAvailable(): Promise<boolean> {
    try {
      const status = await getSdkStatus();

      // Health Connect is available
      if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
        // Initialize if not done yet
        if (!this.initialized) {
          const initResult = await initialize();
          this.initialized = initResult;
        }
        return this.initialized;
      }

      // Health Connect not installed or outdated
      return false;
    } catch (error) {
      console.warn('Health Connect availability check failed:', error);
      return false;
    }
  }

  /**
   * Request Health Connect permissions
   * Opens Health Connect permission dialog
   */
  async requestPermissions(): Promise<PermissionStatus> {
    try {
      // Check availability first
      const available = await this.isAvailable();
      if (!available) {
        return PermissionStatus.Unavailable;
      }

      // Request step count read permission
      const permissions: Permission[] = [
        {accessType: 'read' as const, recordType: 'Steps' as const},
      ];

      const granted = await requestPermission(permissions);

      // Check result
      if (granted) {
        return PermissionStatus.Granted;
      } else {
        return PermissionStatus.Denied;
      }
    } catch (error) {
      console.error('Health Connect permission request failed:', error);
      return PermissionStatus.Denied;
    }
  }

  /**
   * Fetch daily step counts for a date range
   * CRITICAL: Must aggregate raw step records into daily totals
   */
  async fetchDailySteps(
    startDate: Date,
    endDate: Date,
  ): Promise<StepDataPoint[]> {
    try {
      // Check availability
      const available = await this.isAvailable();
      if (!available) {
        throw new ServiceUnavailableError('Health Connect unavailable');
      }

      // Fetch step records
      const result = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      // Aggregate by date (CRITICAL: Health Connect returns raw records)
      const dailyTotals = new Map<string, number>();

      // Access the records array from the result
      const records = result.records || [];

      for (const record of records) {
        // Extract date in YYYY-MM-DD format
        const date = new Date(record.startTime);
        const dateString = date.toISOString().split('T')[0];

        // Aggregate steps for this date
        const current = dailyTotals.get(dateString) || 0;
        dailyTotals.set(dateString, current + record.count);
      }

      // Convert to array
      const dataPoints: StepDataPoint[] = Array.from(dailyTotals.entries()).map(
        ([date, stepCount]) => ({
          date,
          stepCount: Math.round(stepCount),
          source: 'HealthConnect',
        }),
      );

      // Sort by date (newest first)
      dataPoints.sort((a, b) => b.date.localeCompare(a.date));

      return dataPoints;
    } catch (error) {
      console.error('Health Connect step fetch failed:', error);
      throw error;
    }
  }
}

export default new HealthServiceAndroid();
