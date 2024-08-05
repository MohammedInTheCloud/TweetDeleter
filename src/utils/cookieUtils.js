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