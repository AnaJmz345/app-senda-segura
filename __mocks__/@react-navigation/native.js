const actual = jest.requireActual('@react-navigation/native');
module.exports = {
  ...actual,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
  }),
};
