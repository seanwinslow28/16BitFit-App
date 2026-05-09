/**
 * Backend abstraction.
 *
 * V4 has no backend yet — the user will pick (new Supabase project, or a
 * different provider). This file defines the contracts the rest of the app
 * codes against, so swapping providers is a single-file change.
 */

export interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  spriteUrl?: string;
  createdAt: string;
}

export interface IAuthService {
  signUp(email: string, password: string, username: string): Promise<UserProfile>;
  signIn(email: string, password: string): Promise<UserProfile>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
}

export interface IProfileRepository {
  get(userId: string): Promise<UserProfile | null>;
  update(userId: string, patch: Partial<UserProfile>): Promise<UserProfile>;
}

export interface IStepsRepository {
  recordSteps(userId: string, date: string, steps: number): Promise<void>;
  getRange(userId: string, from: string, to: string): Promise<{date: string; steps: number}[]>;
}

export interface IBackendClient {
  auth: IAuthService;
  profile: IProfileRepository;
  steps: IStepsRepository;
}
