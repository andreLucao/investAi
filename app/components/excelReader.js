'use client'
import { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelReader = ({ onComplete }) => {
  const [excelData, setExcelData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Failed to read Excel file: ' + error.message));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setExcelData(null);
    setError('');

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setIsLoading(true);
    try {
      const data = await readExcelFile(file);
      setExcelData(data);
      if (onComplete) {
        onComplete(data);
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
          Choose an Excel file
        </label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="w-full p-4 rounded-lg border border-gray-600 
            hover:border-purple-700 
            hover:bg-purple-900/50 
            bg-gray-800 text-gray-200
            transition-all duration-300"
        />
      </div>

      {isLoading && (
        <div className="text-purple-400">Loading Excel content...</div>
      )}

      {error && (
        <div className="p-4 rounded-lg border border-red-800 
          bg-red-900/50 text-red-400">
          {error}
        </div>
      )}

      {excelData && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">Excel Content:</h3>
          <div className="p-4 rounded-lg border border-gray-700 
            bg-gray-900/50 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <tbody>
                {excelData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-800' : ''}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 whitespace-nowrap text-sm border border-gray-700 
                          text-gray-200"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelReader;