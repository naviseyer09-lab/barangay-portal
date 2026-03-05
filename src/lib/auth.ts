// Authentication utilities

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string, user?: any): void {
  localStorage.setItem('authToken', token);
  if (user) {
    localStorage.setItem('authUser', JSON.stringify(user));
  }
}

export function getAuthUser(): any {
  const userStr = localStorage.getItem('authUser');
  return userStr ? JSON.parse(userStr) : null;
}

export function removeAuthToken(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
}