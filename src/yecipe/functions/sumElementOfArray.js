export const sumElementOfArray = (items, prop) => {
  if (items.length > 0) {
    return items.reduce(function(a, b) {
      return a + b[prop];
    }, 0);
  } else {
    return 0;
  }
};
