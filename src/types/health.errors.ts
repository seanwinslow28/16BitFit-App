/**
 * Health Error Types
 * Custom error classes for health operations
 * Story 1.3 - HealthKit/Connect Integration & Step Sync
 */

// Custom error types for health operations
export class HealthError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = 'HealthError';
  }
}

export class PermissionDeniedError extends HealthError {
  constructor(message: string = 'Health permissions denied by user') {
    super(message, 'PERMISSION_DENIED');
  }
}

export class ServiceUnavailableError extends HealthError {
  constructor(message: string = 'Health service unavailable on this device') {
    super(message, 'SERVICE_UNAVAILABLE');
  }
}

export class SyncFailedError extends HealthError {
  constructor(message: string = 'Failed to sync health data') {
    super(message, 'SYNC_FAILED');
  }
}
