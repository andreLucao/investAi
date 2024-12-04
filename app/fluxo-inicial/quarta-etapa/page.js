'use client'
import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import PDFReader from '@/app/components/pdfReader'
import ExcelReader from '@/app/components/excelReader'

const people = [
  { 
    name: 'Open Finance', 
    imageUrl: 'https://yt3.googleusercontent.com/bEBe176AkMzGL5Vz4UnCzIUpwdalwdM7be46p37X4HGlqe3I2myqHUnz-P_DHvNbtqD6_yE_KYA=s900-c-k-c0x00ffffff-no-rj', 
    locked: true,
    comingSoon: true
  },
  { 
    name: 'PDF', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY-jiJI_9KDn1jubSI3QILvUqhju7Kd3aLPA&s' 
  },
  { 
    name: 'Excel', 
    imageUrl: 'https://img.odcdn.com.br/wp-content/uploads/2017/02/20170213174437.jpg' 
  },
]

export default function ImageModal() {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedOption, setSelectedOption] = useState(null)
  const [pdfContent, setPdfContent] = useState(null)
  const [excelContent, setExcelContent] = useState(null)

  useEffect(() => {
    document.documentElement.classList.add('dark');

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleImageClick = (person) => {
    if (!person.locked) {
      setSelectedOption(person.name)
      setPdfContent(null)
      setExcelContent(null)
    }
  }

  const handlePdfComplete = (content) => {
    setPdfContent(content)
  }

  const handleExcelComplete = (content) => {
    setExcelContent(content)
  }

  const handleSubmit = () => {
    if ((selectedOption === 'PDF' && !pdfContent) || 
        (selectedOption === 'Excel' && !excelContent)) {
      return;
    }
    
    if (selectedOption) {
      console.log('Form submitted with option:', selectedOption)
      if (pdfContent) {
        console.log('PDF Content:', pdfContent)
      }
      if (excelContent) {
        console.log('Excel Content:', excelContent)
      }
      window.location.href = '/fluxo-inicial/quinta-etapa';
    }
  }

  const isSubmitDisabled = !selectedOption || 
    (selectedOption === 'PDF' && !pdfContent) ||
    (selectedOption === 'Excel' && !excelContent)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[#111827] flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-3xl w-full">
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 mt-4">
          {people.map((person) => (
            <div 
              key={person.name} 
              className={`flex flex-col items-center ${!person.locked ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={() => handleImageClick(person)}
            >
              <div 
                className={`relative w-24 h-24 rounded-full overflow-hidden ${person.locked ? 'grayscale' : ''} 
                  ${selectedOption === person.name ? 'ring-4 ring-purple-500' : ''}`}
              >
                <img
                  src={person.imageUrl}
                  alt={person.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {person.locked && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Lock className="text-white w-8 h-8" aria-hidden="true" />
                  </div>
                )}
              </div>
              <p className={`mt-2 text-sm font-medium text-center 
                ${person.locked ? 'text-gray-500' : 'text-gray-200'} 
                ${selectedOption === person.name ? 'text-purple-400' : ''}`}
              >
                {person.name}
              </p>
              {person.comingSoon && (
                <span className="text-xs text-gray-500">em breve</span>
              )}
            </div>
          ))}
        </div>

        {selectedOption === 'PDF' && (
          <div className="mt-6 border-t border-gray-700 pt-6">
            <PDFReader onComplete={handlePdfComplete} hidePreview />
          </div>
        )}

        {selectedOption === 'Excel' && (
          <div className="mt-6 border-t border-gray-700 pt-6">
            <ExcelReader onComplete={handleExcelComplete} hidePreview />
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`w-full max-w-xs p-4 rounded-lg border border-gray-600 
              hover:border-purple-700 hover:bg-purple-900/50 
              bg-gray-800 text-gray-200 transition-all duration-300
              ${!isSubmitDisabled ? '' : 'opacity-50 cursor-not-allowed'}`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}