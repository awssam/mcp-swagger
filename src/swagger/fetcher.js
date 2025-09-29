import { API_URL } from '../config.js';

let cachedSwaggerDoc = null;

export async function fetchSwaggerDoc() {
  if (cachedSwaggerDoc) {
    return cachedSwaggerDoc;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch Swagger doc: ${response.statusText}`);
    }
    cachedSwaggerDoc = await response.json();
    return cachedSwaggerDoc;
  } catch (error) {
    console.error('Error fetching swagger:', error.message);
    throw error;
  }
}