
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
    <div className="fixed inset-0 z-[200] flex items-end justify-center animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-t-[3rem] shadow-2xl animate-in slide-in-from-bottom duration-500 ease-out overflow-hidden max-h-[92vh] flex flex-col">
        {/* Drag Indicator */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-5 mb-2 shrink-0" />
        
        {/* Header */}
        <div className="px-8 py-4 flex justify-between items-center border-b border-gray-50 shrink-0">
          <h2 className="text-2xl font-black tracking-tight text-[#1d1d1f]">{title}</h2>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-90 transition-transform"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area - Added significant pb-24 to clear the app's navigation bar */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar pb-32">
          {children}
        </div>
      </div>
    </div>
  );
};
