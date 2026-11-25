export const capitalizeFirst = (word: string): string => {
  if (isNaN(parseInt(word))) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  return word.charAt(0) + " " + word.charAt(1).toUpperCase() + word.slice(2);
};
