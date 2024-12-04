'use client'
import { useState, useEffect } from 'react';

const PDFReader = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfjsLib, setPdfjsLib] = useState(null);

  useEffect(() => {
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
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
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

    setError('');

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setIsLoading(true);
    try {
      const text = await extractText(file);
      if (onComplete) {
        onComplete(text);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-xl font-semibold text-gray-200 mb-2">
          Choose a PDF file
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full p-4 rounded-lg border border-gray-600 
            hover:border-purple-700
            hover:bg-purple-900/50 bg-gray-800 text-gray-200
            transition-all duration-300"
        />
      </div>

      {isLoading && (
        <div className="text-purple-400">Loading PDF content...</div>
      )}

      {error && (
        <div className="p-4 rounded-lg border border-red-800 
          bg-red-900/50 text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default PDFReader;