/**
 * Generates a random ID using a combination of random strings
 * @returns A random string ID
 */
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}; 