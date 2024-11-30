import React, { useState } from 'react';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker - required for parsing PDFs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfReader = () => {
  const [pdfText, setPdfText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const extractText = async (file) => {
    try {
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText;
    } catch (err) {
      throw new Error('Failed to read PDF: ' + err.message);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset states
    setPdfText('');
    setError('');

    // Validate file type
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
        <div className="text-red-600 p-2 mb-4">
          {error}
        </div>
      )}

      {pdfText && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">PDF Content:</h3>
          <div className="p-4 border rounded bg-gray-50 whitespace-pre-wrap">
            {pdfText}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfReader;