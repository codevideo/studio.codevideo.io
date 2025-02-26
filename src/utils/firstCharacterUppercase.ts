export const firstCharacterUppercase = (input: string): string => {
    if (!input) return input; // Handle empty strings
    return input.charAt(0).toUpperCase() + input.slice(1);
};
