// src/__tests__/Header.test.jsx
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';
import React from 'react';

// --- Mock Dependencies ---

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  RefreshCw: () => <div data-testid="icon-refresh-cw" />,
  Archive: () => <div data-testid="icon-archive" />,
  ChevronDown: () => <div data-testid="icon-chevron-down" />,
  ChevronRight: () => <div data-testid="icon-chevron-right" />,
  Video: () => <div data-testid="icon-video" />,
  Image: () => <div data-testid="icon-image" />,
  FileText: () => <div data-testid="icon-file-text" />,
  Calculator: () => <div data-testid="icon-calculator" />,
  X: () => <div data-testid="icon-x" />,
  LogOut: () => <div data-testid="icon-log-out" />,
  LayoutDashboard: () => <div data-testid="icon-layout-dashboard" />,
}));

// Mock ThemeToggle component
jest.mock('../components/ThemeToggle', () => () => <div data-testid="mock-theme-toggle">Theme Toggle</div>);

// Mock useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../communication/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// --- Helper Component for wrapping Header ---
// NOTE: For tests needing specific mock return values, we'll set the mock directly
// in the test to avoid scope issues.
const Wrapper = ({ children }) => {
  return <Router>{children}</Router>;
};


// --- Tests ---

describe('Header Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the logo and site name', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null, logout: jest.fn() });
    render(<Header />, { wrapper: Wrapper });
    expect(screen.getByText('FileTools')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'FileTools' })).toHaveAttribute('href', '/');
  });

  test('renders navigation links for Convert and Compress on desktop', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null, logout: jest.fn() });
    render(<Header />, { wrapper: Wrapper });
    // Use `getAllByRole` because mobile buttons are also in the DOM tree
    const convertButtons = screen.getAllByRole('button', { name: /Convert/i });
    const compressButtons = screen.getAllByRole('button', { name: /Compress/i });
    expect(convertButtons.length).toBeGreaterThan(0);
    expect(compressButtons.length).toBeGreaterThan(0);
  });

  test('renders ThemeToggle', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null, logout: jest.fn() });
    render(<Header />, { wrapper: Wrapper });
    expect(screen.getByTestId('mock-theme-toggle')).toBeInTheDocument();
  });

  describe('when user is NOT authenticated', () => {
    beforeEach(() => {
        mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null, logout: jest.fn() });
    });

    test('renders Login and Sign Up buttons on desktop', () => {
        render(<Header />, { wrapper: Wrapper });
        // Find links within the desktop-only container
        const desktopNav = screen.getByText('Login').closest('div');
        expect(within(desktopNav).getByRole('link', { name: /Login/i })).toBeInTheDocument();
        expect(within(desktopNav).getByRole('link', { name: /SignUp/i })).toBeInTheDocument();
    });

    test('renders Login and Sign Up buttons in mobile menu', async () => {
        render(<Header />, { wrapper: Wrapper });

        // FIX: Use a more specific selector for the hamburger button to avoid ambiguity.
        const hamburgerButton = screen.getByRole('button', { name: /Open main menu/i });
        fireEvent.click(hamburgerButton);

        // FIX: Find the mobile menu container to search within it.
        // This requires adding a data-testid to your mobile menu div in Header.jsx:
        // <div id="mobile-menu" data-testid="mobile-menu" ...>
        const mobileMenu = await screen.findByTestId('mobile-menu');

        // FIX: Search for links specifically within the mobile menu.
        expect(within(mobileMenu).getByRole('link', { name: /Login/i })).toBeInTheDocument();
        expect(within(mobileMenu).getByRole('link', { name: /SignUp/i })).toBeInTheDocument();
    });

    test('does not render Dashboard or Profile dropdown', () => {
        render(<Header />, { wrapper: Wrapper });
        expect(screen.queryByRole('link', { name: /Dashboard/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Open user menu/i })).not.toBeInTheDocument();
    });
  });

  describe('when user IS authenticated', () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com', profilePictureUrl: null };

    test('renders Dashboard links for desktop and mobile', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true, user: mockUser, logout: jest.fn() });
        render(<Header />, { wrapper: Wrapper });

        // FIX: Query for all links and assert their presence individually.
        // The text link for desktop
        const desktopLink = screen.getByRole('link', { name: 'Dashboard' });
        expect(desktopLink).toBeInTheDocument();

        // The icon link for mobile (identified by its aria-label)
        const mobileLink = screen.getByRole('link', { name: /Go to Dashboard/i });
        expect(mobileLink).toBeInTheDocument();
    });

    test('renders user profile avatar/name', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true, user: mockUser, logout: jest.fn() });
        render(<Header />, { wrapper: Wrapper });
        expect(screen.getByText('J')).toBeInTheDocument();
    });

    test('opens profile dropdown on avatar click', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true, user: mockUser, logout: jest.fn() });
        render(<Header />, { wrapper: Wrapper });

        expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
        
        // FIX: Use the specific aria-label for the profile button.
        const avatarButton = screen.getByRole('button', { name: /Open user menu/i });
        fireEvent.click(avatarButton);

        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
        expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    });

    test('calls logout function and navigates home on Logout click', () => {
        // FIX: Define the mock function in the test's scope.
        const mockLogout = jest.fn();
        // FIX: Set the mock return value directly for this test.
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            user: mockUser,
            logout: mockLogout,
        });

        // FIX: Render the component within a Router without using the generic wrapper
        // to ensure our specific mock is used.
        render(
            <Router>
                <Header />
            </Router>
        );

        const avatarButton = screen.getByRole('button', { name: /Open user menu/i });
        fireEvent.click(avatarButton);
        const logoutButton = screen.getByRole('button', { name: /Logout/i });
        fireEvent.click(logoutButton);
        
        // Assertions will now work correctly.
        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    // --- Mobile Menu Tests (Authenticated) ---
    test('opens mobile menu on hamburger click', async () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true, user: mockUser, logout: jest.fn() });
        render(<Header />, { wrapper: Wrapper });
        
        // FIX: Use the specific selector for the main menu.
        const hamburgerButton = screen.getByRole('button', { name: /Open main menu/i });
        fireEvent.click(hamburgerButton);

        const mobileMenu = await screen.findByTestId('mobile-menu');
        expect(within(mobileMenu).getByRole('button', { name: /Convert/i })).toBeInTheDocument();
        expect(within(mobileMenu).getByRole('button', { name: /Compress/i })).toBeInTheDocument();
    });

    test('opens Convert section in mobile menu', async () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true, user: mockUser, logout: jest.fn() });
        render(<Header />, { wrapper: Wrapper });

        const hamburgerButton = screen.getByRole('button', { name: /Open main menu/i });
        fireEvent.click(hamburgerButton);
        
        const mobileMenu = await screen.findByTestId('mobile-menu');
        expect(within(mobileMenu).queryByText(/Video & Audio/i)).not.toBeInTheDocument();
        
        const mobileConvertButton = within(mobileMenu).getByRole('button', { name: /Convert/i });
        fireEvent.click(mobileConvertButton);
        
        expect(within(mobileMenu).getByText(/Video & Audio/i)).toBeInTheDocument();
    });

    test('opens Compress section in mobile menu', async () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true, user: mockUser, logout: jest.fn() });
        render(<Header />, { wrapper: Wrapper });

        const hamburgerButton = screen.getByRole('button', { name: /Open main menu/i });
        fireEvent.click(hamburgerButton);
        
        const mobileMenu = await screen.findByTestId('mobile-menu');
        const mobileCompressButton = within(mobileMenu).getByRole('button', { name: /Compress/i });
        
        // The sub-items are not visible yet
        expect(within(mobileMenu).queryByText(/Video Compressor/i)).not.toBeInTheDocument();

        fireEvent.click(mobileCompressButton);

        // Click the "Video & Audio" category inside the "Compress" section
        const videoCategoryButton = within(mobileMenu).getByRole('button', { name: /Video & Audio/i });
        fireEvent.click(videoCategoryButton);

        expect(await within(mobileMenu).findByText(/Video Compressor/i)).toBeInTheDocument();
    });
  });
});
