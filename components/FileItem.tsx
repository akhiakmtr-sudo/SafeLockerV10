
import React from 'react';
import { FileItem } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface FileItemProps {
  file: FileItem;
  onDelete: (key: string) => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const FileItemComponent: React.FC<FileItemProps> = ({ file, onDelete }) => {
  const fileName = file.key.split('/').pop() || 'Untitled';

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="font-semibold text-gray-800 truncate" title={fileName}>{fileName}</p>
        <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
        <p className="text-xs text-gray-400 mt-1">
          {file.lastModified.toLocaleDateString()}
        </p>
      </div>
      <div className="flex justify-end items-center mt-3 space-x-2">
        <button className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors" title="View/Download">
          <DownloadIcon className="w-5 h-5" />
        </button>
        <button onClick={() => onDelete(file.key)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors" title="Delete">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FileItemComponent;
   