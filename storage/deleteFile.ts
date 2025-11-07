import { remove } from 'aws-amplify/storage';
import { client } from 'aws-amplify/api';
import { deleteMediaItem as deleteMediaItemMutation } from '../api/graphql/mutations';

export const deleteFile = async (id: string, key: string): Promise<void> => {
  try {
    // First, delete the file object from S3.
    // The 'private' access level ensures the request is authenticated
    // and the correct user's file path is targeted.
    await remove({ key, options: { accessLevel: 'private' } });

    // After successfully deleting from S3, delete the metadata from DynamoDB.
    await client.graphql({
      query: deleteMediaItemMutation,
      variables: { input: { id: id } },
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
