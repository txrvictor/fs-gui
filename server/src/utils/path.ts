
/**
 *  Trim and replace white spaces by dashes
 */
export function sanitizePath(path: string): string {
  return path.trim().replace(/\s+/g, '-')
}

/**
 * Remove leading and tailing slashes from path
 */
export function trimSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, '')
}
