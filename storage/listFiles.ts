import { client } from 'aws-amplify/api';
import { listMediaItems } from '../api/graphql/queries';
import { MediaItem } from '../types';

// Define a type for the expected GraphQL response structure.
interface ListMediaItemsGraphQLResult {
  data: {
    listMediaItems: {
      items: MediaItem[];
      nextToken: string | null;
    };
  };
}

export const listFiles = async (): Promise<MediaItem[]> => {
  try {
    const result = (await client.graphql({
      query: listMediaItems,
    })) as ListMediaItemsGraphQLResult;

    return result.data.listMediaItems.items || [];
  } catch (error) {
    console.error('Error listing files:', error);
    // It's better to return an empty array on failure to prevent UI crashes.
    return [];
  }
};
