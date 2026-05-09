export const loadAsync = jest.fn(() => Promise.resolve());
export const isLoaded = jest.fn(() => true);
export const isLoading = jest.fn(() => false);

export default {
  loadAsync,
  isLoaded,
  isLoading,
};
