import React, { useState, useEffect, useCallback } from 'react';
import { User, MediaItem, FolderType } from '../types';
import FolderView from '../components/FolderView';
import UploadModal from '../components/UploadModal';
import { PlusIcon } from '../components/icons/PlusIcon';
import { listFiles } from '../storage/listFiles';
import { deleteFile } from '../storage/deleteFile';

interface DashboardPageProps {
  user: User;
  onSignOut: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onSignOut }) => {
  const [files, setFiles] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const allFiles = await listFiles();
      setFiles(allFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);
  
  const handleDelete = async (id: string, key: string) => {
    try {
      await deleteFile(id, key);
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (error) {
        console.error('Failed to delete file', error);
        alert('Failed to delete file. Please try again.');
    }
  };
  
  const photos = files.filter(f => f.folder === 'photos');
  const videos = files.filter(f => f.folder === 'videos');
  const documents = files.filter(f => f.folder === 'documents');

  return (
    <div className="min-h-screen relative pb-24">
      <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-1 flex justify-center">
                 <h1 className="text-2xl font-bold text-gray-800">Safe Locker</h1>
            </div>
            <div className="absolute right-4">
              <button
                onClick={onSignOut}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Welcome, {user.attributes.name}!</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading files...</p>
        ) : (
          <div className="space-y-12">
            <FolderView title="Photos" files={photos} onDelete={handleDelete} />
            <FolderView title="Videos" files={videos} onDelete={handleDelete} />
            <FolderView title="Documents" files={documents} onDelete={handleDelete} />
          </div>
        )}
      </main>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-110 z-20"
        aria-label="Upload file"
      >
        <PlusIcon className="w-8 h-8"/>
      </button>

      {isModalOpen && (
        <UploadModal
          onClose={() => setIsModalOpen(false)}
          onUploadComplete={fetchFiles}
        />
      )}
    </div>
  );
};

export default DashboardPage;
