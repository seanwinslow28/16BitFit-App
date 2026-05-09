// REWORK-V4: backend writes stubbed out — implement once V4 backend is chosen.
/**
 * Health Data Sync Service
 * Orchestrates fetching health data and syncing to backend
 * Story 1.3 - HealthKit/Connect Integration & Step Sync
 */

import {StepDataPoint} from '../../types/health.types';

/**
 * Upload step data to backend
 * Uses UPSERT to handle duplicates (idempotent)
 */
export async function uploadStepsToSupabase(
  _dataPoints: StepDataPoint[],
): Promise<void> {
  throw new Error('REWORK-V4: backend integration pending');
}

/**
 * Sync recent health data (last 7 days)
 */
export async function syncRecentData(): Promise<void> {
  throw new Error('REWORK-V4: backend integration pending');
}
