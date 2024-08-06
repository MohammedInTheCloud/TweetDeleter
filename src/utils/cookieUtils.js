// src/utils/cookieUtils.js

export async function getCookies(domain, names) {
  const cookies = {};
  for (const name of names) {
    try {
      const cookie = await chrome.cookies.get({ url: domain, name: name });
      if (cookie) {
        cookies[name] = cookie.value;
      }
    } catch (error) {
      console.error(`Error getting cookie ${name}:`, error);
    }
  }
  return cookies;
}

export async function getTwitterCookies() {
  const domain = "https://x.com";
  const cookieNames = ['ct0', 'twid'];
  return getCookies(domain, cookieNames);
}

// New functions

export function parseCookies(cookieString) {
  return cookieString.split(';').reduce((cookies, cookie) => {
      const parts = cookie.trim().split('=');
      if (parts.length === 2) {
          cookies[parts[0]] = parts[1];
      }
      return cookies;
  }, {});
}

export function extractUserIdFromCookies(cookies) {
  if (cookies['twid']) {
      const twidParts = cookies['twid'].split('%3D');
      return twidParts.length > 1 ? twidParts[1] : null;
  }
  return null;
}