/* Centralized REST client for the Spring Boot backend. Every page should call
   apiGet/apiPost/apiPut/apiDelete instead of using fetch() directly. */

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function apiRequest(method, path, body) {
  const token = await barazGetAccessToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BARAZ_CONFIG.API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.');
  }

  if (response.status === 204) return null;

  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (e) {
      payload = null;
    }
  }

  if (!response.ok) {
    const message = (payload && payload.message) || `Request failed (${response.status})`;

    if (response.status === 401) {
      await barazSignOut();
      showToast('Your session has expired — please sign in again.');
      const onAuthPage = /\/(login|register)\.html$/.test(window.location.pathname);
      if (!onAuthPage) {
        const inAdmin = window.location.pathname.includes('/admin/');
        window.location.href = inAdmin ? '../login.html' : 'login.html';
      }
      throw new ApiError(401, message);
    }

    if (response.status === 403) {
      showToast("You don't have permission to do that.");
      throw new ApiError(403, message);
    }

    throw new ApiError(response.status, message);
  }

  return payload;
}

function apiGet(path) {
  return apiRequest('GET', path);
}

function apiPost(path, body) {
  return apiRequest('POST', path, body);
}

function apiPut(path, body) {
  return apiRequest('PUT', path, body);
}

function apiDelete(path) {
  return apiRequest('DELETE', path);
}
