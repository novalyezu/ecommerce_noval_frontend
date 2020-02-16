export const truncateString = text => {
  let newText = `${text.substring(0, 100)}...`;
  return newText;
};
