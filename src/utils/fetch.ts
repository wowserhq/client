export default async (path, bodyType = 'text') => {
  // TODO: Does this path need to be normalized?
  const response = await fetch(path);
  if (response.status === 200) {
    return response[bodyType]();
  } else {
    throw new Error(`Could not load ${path}: ${response.statusText}`);
  }
};
