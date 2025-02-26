export const formatNameToSafeId = (name: string) => {
    return name.toLowerCase().replace(/\s/g, '-');
  }