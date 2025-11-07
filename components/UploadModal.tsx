import React, { useState, ChangeEvent } from 'react';
import { uploadFile } from '../storage/uploadFile';

interface UploadModalProps {
  onClose: () => void;
  onUploadComplete: () => void;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  
  const totalProgress = files.length > 0
    ? Math.round(Object.values(progress).reduce((acc, p) => acc + p, 0) / files.length)
    : 0;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length === 0) return;

      if (selectedFiles.length > 30) {
        setError('You can select a maximum of 30 files.');
        return;
      }

      const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > 1 * 1024 * 1024 * 1024) { // 1 GB
        setError('Total file size cannot exceed 1 GB.');
        return;
      }
      
      setFiles(selectedFiles);
      setProgress({});
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setStatus('uploading');
    
    const uploadPromises = files.map(file => 
        uploadFile(file, (prog) => {
            setProgress(prev => ({ 
                ...prev, 
                [file.name]: Math.round((prog.loaded / prog.total) * 100) 
            }));
        })
    );

    try {
        await Promise.all(uploadPromises);
        setStatus('success');
        onUploadComplete();
    } catch (err) {
        setStatus('error');
        setError('An error occurred during upload.');
        console.error(err);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Successfully Uploaded</h3>
            <div className="mt-4">
              <button onClick={onClose} className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700">Close</button>
            </div>
          </div>
        );
      case 'uploading':
        return (
            <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Uploading...</h3>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                    <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${totalProgress}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{totalProgress}% complete</p>
            </div>
        );
      default:
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Files</h3>
            <p className="text-sm text-gray-500 mb-4">Select 1 to 30 items (max 1GB total). Files will be sorted automatically.</p>
            <div className="mb-4">
                <label htmlFor="file-upload" className="cursor-pointer w-full inline-flex justify-center items-center px-4 py-6 bg-white text-blue-600 rounded-lg shadow-md tracking-wide border border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                   <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3v-3h2v3z" />
                    </svg>
                   <span className="mt-2 text-base leading-normal ml-2">{files.length > 0 ? `${files.length} file(s) selected` : "Select files"}</span>
                   <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                </label>
            </div>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
              {/* FIX: Removed redundant `status === 'uploading'` check from disabled prop as it's always false in this code path. */}
              <button onClick={handleUpload} disabled={files.length === 0} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
                {/* FIX: Removed redundant `status === 'uploading'` check from button text. */}
                Upload
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all">
        {renderContent()}
      </div>
    </div>
  );
};

export default UploadModal;