export const getToken = () => localStorage.getItem('token');

// Small fetch wrapper: adds the JWT and turns server errors into thrown Errors
export async function api(path, method = 'GET', body) {
  const res = await fetch('/api' + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: 'Bearer ' + getToken() } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && getToken()) {
    localStorage.removeItem('token');
    location.reload();
  }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
