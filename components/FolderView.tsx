import React, { useState, useMemo } from 'react';
import { MediaItem, FolderType } from '../types';
import FileItemComponent from './FileItem';

interface FolderViewProps {
  title: FolderType;
  files: MediaItem[];
  onDelete: (id: string, key: string) => void;
}

const FolderView: React.FC<FolderViewProps> = ({ title, files, onDelete }) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [files, sortOrder]);
  
  const FolderIcon = () => {
      let icon;
      switch(title){
          case 'Photos': icon = '📷'; break;
          case 'Videos': icon = '🎥'; break;
          case 'Documents': icon = '📄'; break;
          default: icon = '📁';
      }
      return <span className="mr-3 text-2xl">{icon}</span>;
  }

  return (
    <section className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center"><FolderIcon />{title}</h3>
        <div className="mt-2 sm:mt-0">
          <label htmlFor={`sort-${title}`} className="text-sm font-medium text-gray-700 mr-2">Sort by date:</label>
          <select
            id={`sort-${title}`}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
      {sortedFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFiles.map((file) => (
            <FileItemComponent key={file.id} file={file} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">This folder is empty.</p>
      )}
    </section>
  );
};

export default FolderView;
