'use client';

import { useState } from 'react';

interface ImportAreaProps {
  onImportClick: () => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function ImportArea({ onImportClick, onDrop }: ImportAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e);
  };

  return (
    <div
      className={`import-area ${isDragOver ? 'drag-over' : ''}`}
      onClick={onImportClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="import-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div className="import-text">
        {isDragOver ? 'Drop your folder here' : 'Import Project Folder'}
      </div>
      <div className="import-subtitle">
        Click to browse or drag and drop a folder
      </div>
    </div>
  );
}