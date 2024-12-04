'use client'
import { useState, useEffect } from 'react';

const PDFReader = ({ onComplete }) => {
  const [pdfText, setPdfText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfjsLib, setPdfjsLib] = useState(null);

  // Keep existing useEffect and extractText functions

  const handleFileChange = async (event) => {
    // Keep existing handleFileChange logic
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Choose a PDF file
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 
            hover:border-purple-300 dark:hover:border-purple-700 
            hover:bg-purple-50 dark:hover:bg-purple-900/50
            dark:bg-gray-800 dark:text-gray-200
            transition-all duration-300"
        />
      </div>

      {isLoading && (
        <div className="text-purple-600 dark:text-purple-400">Loading PDF content...</div>
      )}

      {error && (
        <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 
          bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {pdfText && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">PDF Content:</h3>
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 
            bg-gray-50 dark:bg-gray-900/50 whitespace-pre-wrap overflow-auto max-h-96">
            {pdfText}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFReader;