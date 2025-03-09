export const formatNameToSafeId = (name: string | undefined) => {
  if (!name) {
    return '';
  }
  return name.toLowerCase().replace(/\s/g, '-');
}