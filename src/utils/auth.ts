export function isLoggedIn(): boolean {
    if (typeof document === 'undefined') return false; // Prevent errors during SSR
    const cookies = document.cookie.split('; ').find((row) => row.startsWith('adminToken='));
    return !!cookies; // Return true if token exists
  }
  