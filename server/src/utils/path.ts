
export function sanitizePath(path: string): string {
  // replace white spaces by dashes
  return path.trim().replace(/\s+/g, '-')
}
