export const onCreateMediaItem = /* GraphQL */ `
  subscription OnCreateMediaItem($owner: String) {
    onCreateMediaItem(owner: $owner) {
      id
      owner
      filename
      key
      fileType
      folder
      createdAt
      size
    }
  }
`;

export const onDeleteMediaItem = /* GraphQL */ `
  subscription OnDeleteMediaItem($owner: String) {
    onDeleteMediaItem(owner: $owner) {
      id
    }
  }
`;
