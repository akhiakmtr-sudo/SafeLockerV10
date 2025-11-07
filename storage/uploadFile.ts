import { uploadData } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { createMediaItem as createMediaItemMutation } from '../api/graphql/mutations';
import { v4 as uuid } from 'uuid';

const client = generateClient();

export const uploadFile = async (
  file: File,
  progressCallback: (progress: { loaded: number; total: number }) => void
): Promise<void> => {
  const getFolderPath = (fileType: string): string => {
    if (fileType.startsWith('image/')) return 'photos';
    if (fileType.startsWith('video/')) return 'videos';
    return 'documents';
  };

  try {
    const folder = getFolderPath(file.type);
    const extension = file.name.split('.').pop();
    // Use a unique ID for the filename to prevent overwrites in S3.
    const uniqueFileName = `${uuid()}.${extension}`;
    const key = `${folder}/${uniqueFileName}`;

    // 1. Upload file to S3
    const uploadTask = uploadData({
      key,
      data: file,
      options: {
        accessLevel: 'private',
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            progressCallback({ loaded: transferredBytes, total: totalBytes });
          }
        },
      },
    });

    const result = await uploadTask.result;
    
    // 2. Create metadata record in DynamoDB via GraphQL
    const mediaItemInput = {
      filename: file.name, // Store original filename for display
      key: result.key, // Store the full S3 key
      fileType: file.type,
      folder: folder,
      size: file.size,
    };

    await client.graphql({
      query: createMediaItemMutation,
      variables: { input: mediaItemInput },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};