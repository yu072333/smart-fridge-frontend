// src/utils/api.js
const BASE_URL = process.env.REACT_APP_API_URL;

export async function apiGet(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("❌ GET 失敗:", err.message);
    return { error: err.message };
  }
}

export async function apiPost(path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("❌ POST 失敗:", err.message);
    return { error: err.message };
  }
}

