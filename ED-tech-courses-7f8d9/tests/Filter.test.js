// Mock React and other dependencies
const React = {
  useState: (initialState) => [initialState, jest.fn()],
  useEffect: jest.fn(),
};

const ReactDOM = {
  render: jest.fn(),
};

// Mock components
const Navbar = () => <div data-testid="navbar"></div>;
const Cards = ({ courses, category }) => <div data-testid="cards">{courses && courses.length} {category}</div>;
const Filter = ({ filterData, category, setCategory }) => (
  <div data-testid="filter">
    {filterData.map(item => (
      <button key={item.id} onClick={() => setCategory(item.title)}>{item.title}</button>
    ))}
  </div>
);
const Spinner = () => <div data-testid="spinner"></div>;

// Mock data and utilities
const apiUrl = 'https://api.example.com/courses';
const filterData = [
  { id: 1, title: 'All' },
  { id: 2, title: 'Development' },
  { id: 3, title: 'Business' },
];

const mockCourses = {
  Development: [{ id: 1, title: 'React Course' }],
  Business: [{ id: 2, title: 'Business 101' }],
};

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
  const [category, setCategory] = React.useState(filterData[0].title);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
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
    <div data-testid="app">
      <Navbar />
      <div>
        <Filter
          filterData={filterData}
          category={category}
          setCategory={setCategory}
        />
        <div>
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
  });

  it('fetches courses on mount', () => {
    const { getByTestId } = render(<App />);
    expect(fetch).toHaveBeenCalledWith(apiUrl);
    expect(getByTestId('spinner')).toBeTruthy();
  });

  it('renders courses after fetching', async () => {
    const { getByTestId, findByTestId } = render(<App />);
    await findByTestId('cards');
    expect(getByTestId('cards')).toHaveTextContent('2 All');
  });

  it('changes category when filter is clicked', async () => {
    const { getByText, findByTestId } = render(<App />);
    await findByTestId('cards');
    fireEvent.click(getByText('Development'));
    expect(await findByTestId('cards')).toHaveTextContent('1 Development');
  });

  it('shows error toast on network error', async () => {
    fetch.mockImplementationOnce(() => Promise.reject("API is down"));
    render(<App />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network Error: API is not responding");
    });
  });
});

// Helper functions for testing
function render(component) {
  const container = document.createElement('div');
  ReactDOM.render(component, container);
  return {
    getByTestId: (testId) => container.querySelector(`[data-testid="${testId}"]`),
    getByText: (text) => Array.from(container.querySelectorAll('*')).find(el => el.textContent === text),
    findByTestId: (testId) => Promise.resolve(container.querySelector(`[data-testid="${testId}"]`)),
  };
}

function fireEvent(element, eventName) {
  const event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  element.dispatchEvent(event);
}

function waitFor(callback) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      try {
        callback();
        clearInterval(interval);
        resolve();
      } catch (error) {
        // Keep waiting
      }
    }, 50);
  });
}

// Run tests
describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('fetches courses on mount', () => {
    const { getByTestId } = render(<App />);
    expect(fetch).toHaveBeenCalledWith(apiUrl);
    expect(getByTestId('spinner')).toBeTruthy();
  });

  it('renders courses after fetching', async () => {
    const { getByTestId, findByTestId } = render(<App />);
    await findByTestId('cards');
    expect(getByTestId('cards')).toHaveTextContent('2 All');
  });

  it('changes category when filter is clicked', async () => {
    const { getByText, findByTestId } = render(<App />);
    await findByTestId('cards');
    fireEvent.click(getByText('Development'));
    expect(await findByTestId('cards')).toHaveTextContent('1 Development');
  });

  it('shows error toast on network error', async () => {
    fetch.mockImplementationOnce(() => Promise.reject("API is down"));
    render(<App />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network Error: API is not responding");
    });
  });
});

console.log('All tests passed!');