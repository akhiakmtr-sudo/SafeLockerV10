export const listMediaItems = /* GraphQL */ `
  query ListMediaItems(
    $filter: ModelMediaItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMediaItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        filename
        key
        fileType
        folder
        createdAt
        size
      }
      nextToken
    }
  }
`;
