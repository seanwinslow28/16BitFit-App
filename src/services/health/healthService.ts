/**
 * Health Service Facade
 * Platform-agnostic entry point for health data operations
 * Automatically selects the correct platform implementation
 * Story 1.3 - HealthKit/Connect Integration & Step Sync
 */

import {Platform} from 'react-native';
import {
  IHealthPlatformService,
  PermissionStatus,
  StepDataPoint,
} from '../../types/health.types';

// React Native automatically imports the correct platform file
let platformService: IHealthPlatformService;

if (Platform.OS === 'ios') {
  platformService = require('./healthServiceImpl.ios').default;
} else if (Platform.OS === 'android') {
  platformService = require('./healthServiceImpl.android').default;
} else {
  // Fallback for unsupported platforms
  platformService = {
    isAvailable: async () => false,
    requestPermissions: async () => PermissionStatus.Unavailable,
    fetchDailySteps: async () => [],
  };
}

// Public health service facade
class HealthService implements IHealthPlatformService {
  isAvailable = platformService.isAvailable;
  requestPermissions = platformService.requestPermissions;
  fetchDailySteps = platformService.fetchDailySteps;
}

export const healthService = new HealthService();
