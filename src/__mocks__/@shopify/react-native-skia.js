module.exports = {
  Skia: {
    Color: jest.fn(),
    Paint: jest.fn(),
    Surface: jest.fn(),
  },
  Canvas: jest.fn(),
  Group: jest.fn(),
  Path: jest.fn(),
  RoundedRect: jest.fn(),
  Circle: jest.fn(),
  Text: jest.fn(),
  useFont: jest.fn(() => null),
  useFonts: jest.fn(() => ({})),
  makeImageFromEncoded: jest.fn(),
  useImage: jest.fn(() => null),
};
