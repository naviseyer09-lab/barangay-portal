// Authentication utilities

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string, user?: any): void {
  localStorage.setItem('authToken', token);
  if (user) {
    localStorage.setItem('authUser', JSON.stringify(user));
    // Store user type based on user properties
    const userType = user.role ? 'admin' : 'resident';
    localStorage.setItem('userType', userType);
  }
}

export function getAuthUser(): any {
  const userStr = localStorage.getItem('authUser');
  return userStr ? JSON.parse(userStr) : null;
}

export function getUserType(): 'admin' | 'resident' | null {
  return localStorage.getItem('userType') as 'admin' | 'resident' | null;
}

export function removeAuthToken(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  localStorage.removeItem('userType');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function isAdmin(): boolean {
  return getUserType() === 'admin';
}

export function isResident(): boolean {
  return getUserType() === 'resident';
}

export const clearAuth = removeAuthToken;