export const createMediaItem = /* GraphQL */ `
  mutation CreateMediaItem(
    $input: CreateMediaItemInput!
    $condition: ModelMediaItemConditionInput
  ) {
    createMediaItem(input: $input, condition: $condition) {
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

export const deleteMediaItem = /* GraphQL */ `
  mutation DeleteMediaItem(
    $input: DeleteMediaItemInput!
    $condition: ModelMediaItemConditionInput
  ) {
    deleteMediaItem(input: $input, condition: $condition) {
      id
    }
  }
`;
