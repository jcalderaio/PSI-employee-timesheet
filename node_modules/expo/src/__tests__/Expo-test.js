import Expo from '../Expo';

// This list lets us skip over exports that throw an error when we import them,
// which can happen when we add or change a native module and haven't yet
// updated the mocks in jest-expo. This list is a temporary workaround, not a
// way to indefinitely avoid testing modules.
const skippedExports = ['Camera'];

const exportNames = Object.keys(Expo);
for (const exportName of exportNames) {
  const testName = `exports "${exportName}"`;
  const test = () => {
    expect(() => Expo[exportName]).not.toThrow();

    // Ensure we export the default export instead of the module record itself
    const module = Expo[exportName];
    if (module && module.__esModule) {
      expect(module).not.toHaveProperty('default');
    }
  };

  if (skippedExports.includes(exportName)) {
    it.skip(testName, test);
  } else {
    it(testName, test);
  }
}
