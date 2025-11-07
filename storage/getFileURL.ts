import { getUrl } from 'aws-amplify/storage';

export const getFileURL = async (key: string): Promise<string> => {
  try {
    const getUrlResult = await getUrl({
      key: key,
      options: {
        accessLevel: 'private',
        validateObjectExistence: true,
      },
    });
    return getUrlResult.url.toString();
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};
