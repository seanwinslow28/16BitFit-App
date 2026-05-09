export class Asset {
  static loadAsync = jest.fn(() => Promise.resolve());
  static fromModule = jest.fn(() => ({
    downloadAsync: jest.fn(() => Promise.resolve()),
  }));
}

export default {
  Asset,
};
