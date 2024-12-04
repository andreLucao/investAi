'use client'
import { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelReader = ({ onComplete }) => {
  const [excelData, setExcelData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setExcelData(null);
    setError('');

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
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

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
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

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Choose an Excel file
        </label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="block w-full p-2 border rounded"
        />
      </div>

      {isLoading && (
        <div className="text-blue-600">Loading Excel content...</div>
      )}

      {error && (
        <div className="text-red-600 p-2 mb-4 border border-red-200 rounded bg-red-50">
          {error}
        </div>
      )}

      {excelData && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Excel Content:</h3>
          <div className="p-4 border rounded bg-gray-50 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody>
                {excelData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-100' : ''}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 whitespace-nowrap text-sm border"
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