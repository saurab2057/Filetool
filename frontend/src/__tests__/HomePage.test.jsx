// src/__tests__/HomePage.test.jsx
import { render, screen } from '@testing-library/react';
import HomePage from '../pages/Home'; // Ensure this path is correct relative to the test file
import React from 'react';

// --- Mock Critical Dependencies ---

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../components/Fileuploader', () => {
  return function MockFileUploader() {
    return <div data-testid="mock-file-uploader-simple">Mock File Uploader</div>;
  };
});

jest.mock('../components/AnimatedStats', () => ({
  AnimatedStats: () => <div data-testid="mock-animated-stats-simple">Mock Stats</div>,
}));

jest.mock('../components/AnimatedReview', () => ({
  AnimatedTestimonials: () => <div data-testid="mock-animated-testimonials-simple">Mock Testimonials</div>,
}));

jest.mock('lucide-react', () => ({
  Lock: () => <div data-testid="mock-icon-lock" />,
  Globe: () => <div data-testid="mock-icon-globe" />,
  CheckCircle: () => <div data-testid="mock-icon-check-circle" />,
}));

jest.mock('../components/AudioSetting', () => ({
  defaultAudioSettings: {},
}));
jest.mock('../components/PNGSetting', () => ({
  defaultImageSettings: {},
}));
jest.mock('../components/VideoSetting', () => ({
  defaultVideoSettings: {},
}));

// --- Tests ---

describe('HomePage', () => {
  test('renders without crashing', () => {
    render(<HomePage />);

    // --- FIX: Use a function matcher for fragmented text ---
    // This function checks if the combined text content of an element matches 'File Converter'
    expect(screen.getByText((content, element) => {
      // Check if the element itself contains the text
      const hasText = element => element.textContent && element.textContent.includes('File Converter');
      // Check if any of the element's children contain the text (recursively)
      const childrenDontHaveText = element => !element.children || Array.from(element.children).every(child => !hasText(child));

      // Return true if the element has the text AND none of its direct children have the full text
      // This handles the case where text is split like "File" and "Converter"
      return hasText(element) && childrenDontHaveText(element);
    })).toBeInTheDocument();
    // --- END FIX ---
  });

  // Example of adding another test that works now that rendering is fixed
  test('renders the hero section subtitle from FileUploader mock', () => {
    render(<HomePage />);
    // The mock FileUploader renders "Mock File Uploader"
    expect(screen.getByText(/Mock File Uploader/i)).toBeInTheDocument();
  });

  test('renders the security section heading', () => {
    render(<HomePage />);
    expect(screen.getByText(/Your Data, Our Priority/i)).toBeInTheDocument();
  });

  test('renders the CTA section heading', () => {
    render(<HomePage />);
    expect(screen.getByText(/Ready to Convert Your Files?/i)).toBeInTheDocument();
  });

  test('renders the CTA button', () => {
    render(<HomePage />);
    expect(screen.getByRole('button', { name: /Convert Now/i })).toBeInTheDocument();
  });

  // You can now add tests for the other mocked components using their test IDs
  test('renders the mocked FileUploader component area', () => {
    render(<HomePage />);
    expect(screen.getByTestId('mock-file-uploader-simple')).toBeInTheDocument();
  });

  test('renders the mocked stats component', () => {
    render(<HomePage />);
    expect(screen.getByTestId('mock-animated-stats-simple')).toBeInTheDocument();
  });

  test('renders the mocked testimonials component', () => {
    render(<HomePage />);
    expect(screen.getByTestId('mock-animated-testimonials-simple')).toBeInTheDocument();
  });

});
