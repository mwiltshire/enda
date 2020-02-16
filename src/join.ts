export function join(...parts: string[]): string {
  return parts
    .map(part => part.replace(/^\/+(.*?)/, '$1'))
    .filter(part => part !== '')
    .join('/');
}
