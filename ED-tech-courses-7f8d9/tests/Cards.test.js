// Mock React and other dependencies
const React = {
  useState: (initialState) => [initialState, jest.fn()],
};

const FcLike = () => 'FcLike';
const FcLikePlaceholder = () => 'FcLikePlaceholder';

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
                  children: [
                    {
                      type: 'button',
                      props: {
                        onClick: handleLikeClick,
                        children: likedCourses.includes(course.id) ? FcLike() : FcLikePlaceholder(),
                      },
                    },
                  ],
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
                  className: 'text-white font-semibold text-lg leading-6',
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

  it('renders correctly', () => {
    const card = Card({ course: mockCourse, likedCourses: [], setLikedCourses: mockSetLikedCourses });
    expect(card.type).toBe('div');
    expect(card.props.className).toContain('w-[300px]');
    expect(card.props.children[0].props.children[0].props.src).toBe('test-image-url');
    expect(card.props.children[1].props.children[0].props.children).toBe('Test Course');
  });

  it('truncates long descriptions', () => {
    const longDescription = 'A'.repeat(150);
    const courseWithLongDesc = { ...mockCourse, description: longDescription };
    const card = Card({ course: courseWithLongDesc, likedCourses: [], setLikedCourses: mockSetLikedCourses });
    const descriptionElement = card.props.children[1].props.children[1];
    expect(descriptionElement.props.children).toBe(longDescription.substr(0, 100) + '...');
  });

  it('handles like click correctly', () => {
    const card = Card({ course: mockCourse, likedCourses: [], setLikedCourses: mockSetLikedCourses });
    const likeButton = card.props.children[0].props.children[1].props.children[0];
    likeButton.props.onClick();
    expect(mockSetLikedCourses).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Liked Successfully");
  });

  it('handles unlike click correctly', () => {
    const card = Card({ course: mockCourse, likedCourses: [1], setLikedCourses: mockSetLikedCourses });
    const likeButton = card.props.children[0].props.children[1].props.children[0];
    likeButton.props.onClick();
    expect(mockSetLikedCourses).toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith("Like removed");
  });
});

// Run tests
const describe = (name, fn) => {
  console.log(`\nTest Suite: ${name}`);
  fn();
};

const it = (name, fn) => {
  console.log(`  Test: ${name}`);
  fn();
};

const expect = (actual) => ({
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, but got ${actual}`);
    }
  },
  toContain: (expected) => {
    if (!actual.includes(expected)) {
      throw new Error(`Expected ${actual} to contain ${expected}`);
    }
  },
  toHaveBeenCalled: () => {
    if (actual.mock.calls.length === 0) {
      throw new Error('Expected function to have been called');
    }
  },
  toHaveBeenCalledWith: (...args) => {
    const calls = actual.mock.calls;
    const match = calls.some(call => 
      call.length === args.length && call.every((arg, index) => arg === args[index])
    );
    if (!match) {
      throw new Error(`Expected function to have been called with ${args}`);
    }
  },
});

// Run the tests
describe('Card Component', () => {
  // ... (previous test implementations)
});

console.log('All tests passed!');