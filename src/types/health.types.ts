/**
 * Health Data Types
 * Type definitions for health data integration with HealthKit (iOS) and Health Connect (Android)
 * Story 1.3 - HealthKit/Connect Integration & Step Sync
 */

// Health data source types
export type HealthSource = 'HealthKit' | 'HealthConnect';

// Permission status enum
export enum PermissionStatus {
  Unknown = 'Unknown',
  Granted = 'Granted',
  Denied = 'Denied',
  Unavailable = 'Unavailable', // iPad or Health Connect not installed
}

// Single data point for daily steps
export interface StepDataPoint {
  date: string; // YYYY-MM-DD format
  stepCount: number;
  source: HealthSource;
}

// Platform service interface (both iOS and Android must implement)
export interface IHealthPlatformService {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<PermissionStatus>;
  fetchDailySteps(startDate: Date, endDate: Date): Promise<StepDataPoint[]>;
}

// Sync status for UI
export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncError: string | null;
}
