import {IBackendClient} from './types';

export * from './types';

/**
 * Backend client — not yet implemented. Throws on any call. When the user
 * picks a provider, replace this object with a real implementation and the
 * rest of the app keeps working unchanged.
 */
export const backend: IBackendClient = new Proxy({} as IBackendClient, {
  get() {
    throw new Error(
      'V4 backend not configured. Wire up a real IBackendClient implementation before using backend.* calls.',
    );
  },
});
