import React, { useState } from 'react';
import Button from './Button';

const CopyLink = ({ link, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Game Link</h3>
        <p className="text-sm text-gray-600 mb-2">
          Share this link with players to join the game:
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={link}
            readOnly
            className="flex-1 p-2 border rounded bg-gray-50"
          />
          <Button
            onClick={handleCopy}
            variant="primary"
            className="whitespace-nowrap"
          >
            {copied ? 'copied' : 'copy link'}
          </Button>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} variant="secondary">
            close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CopyLink; 