
import React from 'react';
import { SparklesIcon, XMarkIcon } from './Icons';

interface HelpModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  content: string;
  isLoading: boolean;
}

const HelpModal: React.FC<HelpModalProps> = ({ show, onClose, title, content, isLoading }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-11/12 md:w-1/2 max-w-lg transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center">
            <SparklesIcon className="w-6 h-6 mr-2 text-yellow-500" />
            {title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>
        <div className="text-gray-700 space-y-4 max-h-80 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
            </div>
          ) : (
            content.split('\n').map((line, index) => <p key={index}>{line}</p>)
          )}
        </div>
        <div className="mt-6 text-right">
            <button
                onClick={onClose}
                className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
            >
                Got it!
            </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
