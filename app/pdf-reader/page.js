"use client"
import React, { useState, useEffect } from 'react';

const PdfReader = () => {
  const [pdfText, setPdfText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfjsLib, setPdfjsLib] = useState(null);

  useEffect(() => {
    // Load PDF.js library from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setPdfjsLib(pdfjsLib);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const extractText = async (file) => {
    if (!pdfjsLib) {
      throw new Error('PDF.js library not loaded');
    }

    try {
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `Page ${i}:\n${pageText}\n\n`;
      }
      
      return fullText;
    } catch (err) {
      throw new Error('Failed to read PDF: ' + err.message);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPdfText('');
    setError('');

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setIsLoading(true);
    try {
      const text = await extractText(file);
      setPdfText(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Choose a PDF file
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full p-2 border rounded"
        />
      </div>

      {isLoading && (
        <div className="text-blue-600">Loading PDF content...</div>
      )}

      {error && (
        <div className="text-red-600 p-2 mb-4 border border-red-200 rounded bg-red-50">
          {error}
        </div>
      )}

      {pdfText && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">PDF Content:</h3>
          <div className="p-4 border rounded bg-gray-50 whitespace-pre-wrap max-h-96 overflow-y-auto">
            {pdfText}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfReader;