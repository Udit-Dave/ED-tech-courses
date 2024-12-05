// Mock React and other dependencies
const React = {
  createElement: (type, props, ...children) => ({ type, props, children }),
  useState: (initialState) => [initialState, jest.fn()],
};

// Mock CSS modules
const spinnerCss = {
  spinner: 'spinner-class',
};

// Component to be tested
const Spinner = () => {
  return React.createElement(
    'div',
    { className: 'flex flex-col items-center space-y-2' },
    React.createElement('div', { className: spinnerCss.spinner }),
    React.createElement(
      'p',
      { className: 'text-bgDark text-lg font-semibold' },
      'Loading...'
    )
  );
};

// Mock testing library
const render = (component) => {
  const container = document.createElement('div');
  container.innerHTML = JSON.stringify(component, null, 2);
  return {
    container,
    getByText: (text) => container.innerHTML.includes(text) ? container : null,
    getByClassName: (className) => container.innerHTML.includes(className) ? container : null,
  };
};

// Test suite
describe('Spinner Component', () => {
  it('renders without crashing', () => {
    const { container } = render(Spinner());
    expect(container).toBeTruthy();
  });

  it('displays loading text', () => {
    const { getByText } = render(Spinner());
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('includes spinner element', () => {
    const { getByClassName } = render(Spinner());
    expect(getByClassName(spinnerCss.spinner)).toBeTruthy();
  });
});

// Mock Jest globals
const jest = {
  fn: () => {},
};

const expect = (received) => ({
  toBeTruthy: () => {
    if (!received) throw new Error('Expected truthy value');
  },
});

const describe = (name, fn) => {
  console.log(`\nTest Suite: ${name}`);
  fn();
};

const it = (name, fn) => {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${error.message}`);
  }
};

// Run tests
describe('Spinner Component', () => {
  it('renders without crashing', () => {
    const { container } = render(Spinner());
    expect(container).toBeTruthy();
  });

  it('displays loading text', () => {
    const { getByText } = render(Spinner());
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('includes spinner element', () => {
    const { getByClassName } = render(Spinner());
    expect(getByClassName(spinnerCss.spinner)).toBeTruthy();
  });
});