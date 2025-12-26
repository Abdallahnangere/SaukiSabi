
import React from 'react';
import { X } from 'lucide-react';

interface AppleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const AppleSheet: React.FC<AppleSheetProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-t-[2.5rem] shadow-2xl animate-in slide-in-from-bottom duration-500 ease-out overflow-hidden max-h-[92vh] flex flex-col">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2" />
        
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-xl font-bold text-[#1d1d1f]">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
