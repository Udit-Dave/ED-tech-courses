// Mock implementations
const React = {
  createElement: () => {},
};

const FcLike = () => {};
const FcLikePlaceholder = () => {};

const toast = {
  warning: jest.fn(),
  success: jest.fn(),
};

// Component implementation
const Card = ({ course, likedCourses, setLikedCourses }) => {
  const handleLikeClick = () => {
    if (likedCourses.includes(course.id)) {
      setLikedCourses((prev) => prev.filter((cid) => cid !== course.id));
      toast.warning("Like removed");
    } else {
      setLikedCourses((prev) => [...prev, course.id]);
      toast.success("Liked Successfully");
    }
  };

  return {
    type: 'div',
    props: {
      className: 'w-[300px] bg-bgDark bg-opacity-80 rounded-md overflow-hidden',
      children: [
        {
          type: 'div',
          props: {
            className: 'relative',
            children: [
              {
                type: 'img',
                props: {
                  src: course.image.url,
                  alt: course.title,
                },
              },
              {
                type: 'div',
                props: {
                  className: 'w-[40px] h-[40px] bg-white rounded-full absolute right-2 bottom-[-12px] grid place-items-center',
                  children: {
                    type: 'button',
                    props: {
                      onClick: handleLikeClick,
                      children: likedCourses.includes(course.id)
                        ? { type: FcLike, props: { fontSize: "1.75rem" } }
                        : { type: FcLikePlaceholder, props: { fontSize: "1.75rem" } },
                    },
                  },
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            className: 'p-4',
            children: [
              {
                type: 'p',
                props: {
                  className: "text-white font-semibold text-lg leading-6",
                  children: course.title,
                },
              },
              {
                type: 'p',
                props: {
                  className: 'mt-2 text-white',
                  children: course.description.length > 100
                    ? `${course.description.substr(0, 100)}...`
                    : course.description,
                },
              },
            ],
          },
        },
      ],
    },
  };
};

// Test suite
describe('Card Component', () => {
  const mockCourse = {
    id: 1,
    title: 'Test Course',
    description: 'This is a test course description',
    image: { url: 'test-image-url' },
  };

  const mockSetLikedCourses = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders course information correctly', () => {
    const result = Card({ course: mockCourse, likedCourses: [], setLikedCourses: mockSetLikedCourses });

    expect(result.props.children[0].props.children[0].props.src).toBe('test-image-url');
    expect(result.props.children[0].props.children[0].props.alt).toBe('Test Course');
    expect(result.props.children[1].props.children[0].props.children).toBe('Test Course');
    expect(result.props.children[1].props.children[1].props.children).toBe('This is a test course description');
  });

  test('truncates long description', () => {
    const longDescriptionCourse = {
      ...mockCourse,
      description: 'A'.repeat(150),
    };

    const result = Card({ course: longDescriptionCourse, likedCourses: [], setLikedCourses: mockSetLikedCourses });

    expect(result.props.children[1].props.children[1].props.children).toBe('A'.repeat(100) + '...');
  });

  test('displays FcLikePlaceholder when course is not liked', () => {
    const result = Card({ course: mockCourse, likedCourses: [], setLikedCourses: mockSetLikedCourses });

    expect(result.props.children[0].props.children[1].props.children.props.children.type).toBe(FcLikePlaceholder);
  });

  test('displays FcLike when course is liked', () => {
    const result = Card({ course: mockCourse, likedCourses: [1], setLikedCourses: mockSetLikedCourses });

    expect(result.props.children[0].props.children[1].props.children.props.children.type).toBe(FcLike);
  });

  test('handles like click when course is not liked', () => {
    const result = Card({ course: mockCourse, likedCourses: [], setLikedCourses: mockSetLikedCourses });

    result.props.children[0].props.children[1].props.children.props.onClick();

    expect(mockSetLikedCourses).toHaveBeenCalledWith(expect.any(Function));
    expect(toast.success).toHaveBeenCalledWith("Liked Successfully");
  });

  test('handles like click when course is already liked', () => {
    const result = Card({ course: mockCourse, likedCourses: [1], setLikedCourses: mockSetLikedCourses });

    result.props.children[0].props.children[1].props.children.props.onClick();

    expect(mockSetLikedCourses).toHaveBeenCalledWith(expect.any(Function));
    expect(toast.warning).toHaveBeenCalledWith("Like removed");
  });
});

// Run tests
const describe = (name, fn) => {
  console.log(`\nTest Suite: ${name}`);
  fn();
};

const test = (name, fn) => {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${error.message}`);
  }
};

const expect = (actual) => ({
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, but got ${actual}`);
    }
  },
  toHaveBeenCalledWith: (...args) => {
    if (!actual.mock.calls.some(call => JSON.stringify(call) === JSON.stringify(args))) {
      throw new Error(`Expected function to have been called with ${JSON.stringify(args)}`);
    }
  },
});

const beforeEach = (fn) => {
  fn();
};

jest = {
  fn: () => ({
    mock: { calls: [] },
  }),
  clearAllMocks: () => {},
};

// Run the tests
describe('Card Component', () => {
  const mockCourse = {
    id: 1,
    title: 'Test Course',
    description: 'This is a test course description',
    image: { url: 'test-image-url' },
  };

  const mockSetLikedCourses = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders course information correctly', () => {
    const result = Card({ course: mockCourse, likedCourses: [], setLikedCourses: mockSetLikedCourses });

    expect(result.props.children[0].props.children[0].props.src).toBe('test-image-url');
    expect(result.props.children[0].props.children[0].props.alt).toBe('Test Course');
    expect(result.props.children[1].props.children[0].props.children).toBe('Test Course');
    expect(result.props.children[1].props.children[1].props.children).toBe('This is a test course description');
  });

  // ... (other tests)
});

console.log('All tests completed.');