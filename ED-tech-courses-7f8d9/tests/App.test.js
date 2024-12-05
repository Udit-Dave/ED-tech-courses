// Mock implementations
const React = {
  useState: jest.fn(),
  useEffect: jest.fn(),
};

const ReactDOM = {
  render: jest.fn(),
};

// Mock components
const Navbar = () => <div data-testid="navbar"></div>;
const Cards = ({ courses, category }) => <div data-testid="cards"></div>;
const Filter = ({ filterData, category, setCategory }) => <div data-testid="filter"></div>;
const Spinner = () => <div data-testid="spinner"></div>;

// Mock data
const mockApiUrl = 'https://api.example.com/courses';
const mockFilterData = [
  { id: 1, title: 'All' },
  { id: 2, title: 'Development' },
  { id: 3, title: 'Business' },
];

const mockCourses = [
  { id: 1, title: 'React Course', category: 'Development' },
  { id: 2, title: 'Node.js Course', category: 'Development' },
  { id: 3, title: 'Marketing Course', category: 'Business' },
];

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: mockCourses }),
  })
);

// Mock toast function
const toast = {
  error: jest.fn(),
};

// App component
const App = () => {
  const [courses, setCourses] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [category, setCategory] = React.useState(mockFilterData[0].title);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(mockApiUrl);
      const output = await response.json();
      setCourses(output.data);
    } catch (error) {
      toast.error("Network Error: API is not responding");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bgDark2">
      <Navbar />
      <div className="bg-bgDark2">
        <Filter
          filterData={mockFilterData}
          category={category}
          setCategory={setCategory}
        />
        <div className="w-11/12 max-w-[1200px] mx-auto flex flex-wrap justify-center items-center min-h-[50vh]">
          {loading ? (
            <Spinner />
          ) : (
            <Cards courses={courses} category={category} />
          )}
        </div>
      </div>
    </div>
  );
};

// Test suite
describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('fetches courses on mount', () => {
    React.useState.mockReturnValueOnce([null, jest.fn()]);
    React.useState.mockReturnValueOnce([true, jest.fn()]);
    React.useState.mockReturnValueOnce(['All', jest.fn()]);

    const { getByTestId } = render(<App />);

    expect(fetch).toHaveBeenCalledWith(mockApiUrl);
    expect(getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays courses after loading', async () => {
    React.useState.mockReturnValueOnce([mockCourses, jest.fn()]);
    React.useState.mockReturnValueOnce([false, jest.fn()]);
    React.useState.mockReturnValueOnce(['All', jest.fn()]);

    const { getByTestId } = render(<App />);

    await waitFor(() => {
      expect(getByTestId('cards')).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    React.useState.mockReturnValueOnce([null, jest.fn()]);
    React.useState.mockReturnValueOnce([true, jest.fn()]);
    React.useState.mockReturnValueOnce(['All', jest.fn()]);

    render(<App />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network Error: API is not responding');
    });
  });
});

// Run tests
const { render, waitFor } = require('@testing-library/react');
require('@testing-library/jest-dom/extend-expect');

describe('App', () => {
  // ... (previous test cases)

  // Add more test cases as needed
});

// Execute tests
test();

function test() {
  describe('App Component', () => {
    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<App />, div);
      ReactDOM.unmountComponentAtNode(div);
      console.log('Test passed: App renders without crashing');
    });

    it('fetches courses on mount', () => {
      React.useState.mockReturnValueOnce([null, jest.fn()]);
      React.useState.mockReturnValueOnce([true, jest.fn()]);
      React.useState.mockReturnValueOnce(['All', jest.fn()]);

      render(<App />);

      expect(fetch).toHaveBeenCalledWith(mockApiUrl);
      console.log('Test passed: App fetches courses on mount');
    });

    it('displays courses after loading', async () => {
      React.useState.mockReturnValueOnce([mockCourses, jest.fn()]);
      React.useState.mockReturnValueOnce([false, jest.fn()]);
      React.useState.mockReturnValueOnce(['All', jest.fn()]);

      const { getByTestId } = render(<App />);

      await waitFor(() => {
        expect(getByTestId('cards')).toBeTruthy();
      });
      console.log('Test passed: App displays courses after loading');
    });

    it('handles API error', async () => {
      fetch.mockRejectedValueOnce(new Error('API Error'));

      React.useState.mockReturnValueOnce([null, jest.fn()]);
      React.useState.mockReturnValueOnce([true, jest.fn()]);
      React.useState.mockReturnValueOnce(['All', jest.fn()]);

      render(<App />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Network Error: API is not responding');
      });
      console.log('Test passed: App handles API error');
    });
  });

  console.log('All tests completed');
}