import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../components/common/Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Test Modal',
    children: 'Modal Content',
  };

  test('renders nothing when isOpen is false', () => {
    render(
      <Modal {...defaultProps} isOpen={false}>
        Test Content
      </Modal>
    );
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  test('renders modal with correct content when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    
    // Check title
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    
    // Check content
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });

  test('calls onClose when Cancel button is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when clicking outside modal', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    // Click the backdrop (the area outside the modal)
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm when OK button is clicked', () => {
    const onConfirm = jest.fn();
    render(<Modal {...defaultProps} onConfirm={onConfirm} />);
    
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('renders custom button labels when provided', () => {
    render(
      <Modal
        {...defaultProps}
        cancelText="Go Back"
        confirmText="Continue"
      />
    );
    
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  test('prevents event propagation when clicking modal content', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    // Click the modal content
    const modalContent = screen.getByText('Modal Content');
    fireEvent.click(modalContent);
    
    // onClose should not be called when clicking inside the modal
    expect(onClose).not.toHaveBeenCalled();
  });
}); 