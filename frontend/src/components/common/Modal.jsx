import React from 'react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  confirmText = 'Confirm',
  onConfirm,
  cancelText = 'Cancel',
  variant = 'primary'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {title && (
            <h2 className="text-xl font-semibold mb-4">
              {title}
            </h2>
          )}
          <div className="mb-6">
            {children}
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              variant="secondary" 
              onClick={onClose}
            >
              {cancelText}
            </Button>
            {onConfirm && (
              <Button 
                variant={variant}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
