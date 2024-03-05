
/**
 * Trim and replace white spaces by dashes.
 * 
 * @param path a path string (e.g. a/b/some file ) 
 * @returns the sanitized path (e.g. a/b/some-file )
 */
export function sanitizePath(path: string): string {
  return path.trim().replace(/\s+/g, '-')
}

/**
 * Remove leading and tailing slashes from path
 * 
 * @param path a path string (e.g. /a/b/c/ ) 
 * @returns the formatted path (e.g. a/b/c )
 */
export function trimSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, '')
}
