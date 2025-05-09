import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

// Mock fetch
global.fetch = jest.fn();

// Reset all mocks after each test
afterEach(() => {
  jest.resetAllMocks();
});

const renderRegisterForm = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <RegisterForm />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('RegisterForm', () => {
  test('renders register form with all elements', () => {
    renderRegisterForm();
    
    // Check title
    expect(screen.getByText('Register')).toBeInTheDocument();
    
    // Check input fields
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('shows error when passwords do not match', async () => {
    renderRegisterForm();
    
    // Fill in the form with mismatched passwords
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password456' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Check for error message
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test('successful registration calls API with correct data', async () => {
    const mockResponse = {
      token: 'fake-token',
      userId: '123',
      email: 'test@example.com',
    };

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    renderRegisterForm();
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // Verify API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/auth/register'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('test@example.com'),
        })
      );
    });
  });

  test('cancel button redirects to login page', () => {
    renderRegisterForm();
    
    // Click cancel button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    // Verify we're redirected to login page
    expect(window.location.pathname).toBe('/login');
  });
}); 