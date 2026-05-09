/**
 * Health Store
 * Manages health data state using Zustand
 * Tracks availability, permissions, sync status, and daily steps
 * Story 1.3 - HealthKit/Connect Integration & Step Sync
 */

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PermissionStatus, SyncStatus} from '../types/health.types';

interface HealthState extends SyncStatus {
  // Availability and permissions
  isAvailable: boolean;
  permissionStatus: PermissionStatus;

  // Data
  dailySteps: number;
  lastSyncDate: string | null; // YYYY-MM-DD

  // Actions
  setAvailability: (available: boolean) => void;
  setPermissionStatus: (status: PermissionStatus) => void;
  setDailySteps: (steps: number, date: string) => void;
  startSync: () => void;
  finishSync: (error?: string) => void;
  clearError: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    set => ({
      // Initial state
      isAvailable: false,
      permissionStatus: PermissionStatus.Unknown,
      dailySteps: 0,
      lastSyncDate: null,
      isSyncing: false,
      lastSyncTime: null,
      syncError: null,

      // Actions
      setAvailability: available => set({isAvailable: available}),

      setPermissionStatus: status => set({permissionStatus: status}),

      setDailySteps: (steps, date) =>
        set({dailySteps: steps, lastSyncDate: date}),

      startSync: () => set({isSyncing: true, syncError: null}),

      finishSync: error =>
        set({
          isSyncing: false,
          lastSyncTime: error ? null : new Date().toISOString(),
          syncError: error || null,
        }),

      clearError: () => set({syncError: null}),
    }),
    {
      name: '16bitfit-health-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
