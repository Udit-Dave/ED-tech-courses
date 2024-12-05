// Mock React and ReactDOM
const React = {
  createElement: (type, props, ...children) => ({ type, props, children }),
  useState: (initial) => [initial, jest.fn()],
};

const ReactDOM = {
  render: jest.fn(),
};

// Mock react-icons
const FcLike = () => 'FcLike';
const FcLikePlaceholder = () => 'FcLikePlaceholder';

// Mock react-toastify
const toast = {
  warning: jest.fn(),
  success: jest.fn(),
};

// Component implementation
const Navbar = () => {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'nav',
      { className: 'bg-bgDark py-4' },
      React.createElement(
        'h1',
        { className: 'text-3xl font-bold text-center text-white' },
        'Top Courses'
      )
    )
  );
};

// Test suite
describe('Navbar Component', () => {
  it('renders correctly', () => {
    const navbar = Navbar();
    expect(navbar.type).toBe('div');
    expect(navbar.children[0].type).toBe('nav');
    expect(navbar.children[0].props.className).toBe('bg-bgDark py-4');
    expect(navbar.children[0].children[0].type).toBe('h1');
    expect(navbar.children[0].children[0].props.className).toBe('text-3xl font-bold text-center text-white');
    expect(navbar.children[0].children[0].children[0]).toBe('Top Courses');
  });
});

// Test runner
const runTests = () => {
  const tests = [];
  let beforeEachFn = () => {};

  const describe = (name, fn) => {
    console.log(`\nTest Suite: ${name}`);
    fn();
  };

  const it = (name, fn) => {
    tests.push({ name, fn });
  };

  const beforeEach = (fn) => {
    beforeEachFn = fn;
  };

  const expect = (actual) => ({
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    },
    toEqual: (expected) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
  });

  describe('Navbar Component', () => {
    it('renders correctly', () => {
      const navbar = Navbar();
      expect(navbar.type).toBe('div');
      expect(navbar.children[0].type).toBe('nav');
      expect(navbar.children[0].props.className).toBe('bg-bgDark py-4');
      expect(navbar.children[0].children[0].type).toBe('h1');
      expect(navbar.children[0].children[0].props.className).toBe('text-3xl font-bold text-center text-white');
      expect(navbar.children[0].children[0].children[0]).toBe('Top Courses');
    });
  });

  console.log('\nRunning tests...');
  tests.forEach(({ name, fn }) => {
    try {
      beforeEachFn();
      fn();
      console.log(`✓ ${name}`);
    } catch (error) {
      console.error(`✗ ${name}`);
      console.error(error);
    }
  });
};

// Run the tests
runTests();