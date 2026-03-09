// RSS news feed parser — Rotowire baseball feed via Vite proxy
import { cache } from './dataCache.js';

const FEEDS = [
  { url: '/rss/rotowire', label: 'Rotowire' },
];

function parseRssXml(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');
  const items = Array.from(doc.querySelectorAll('item'));

  return items.map(item => ({
    title: item.querySelector('title')?.textContent?.trim() || '',
    description: item.querySelector('description')?.textContent?.trim() || '',
    pubDate: item.querySelector('pubDate')?.textContent?.trim() || '',
    link: item.querySelector('link')?.textContent?.trim() || '',
  }));
}

// Normalize a name for substring matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim();
}

export async function fetchPlayerNews() {
  const cacheKey = 'rss_baseball_news';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const allItems = [];

  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url);
      if (!res.ok) throw new Error(`RSS ${res.status}`);
      const xml = await res.text();
      const items = parseRssXml(xml);
      allItems.push(...items.map(i => ({ ...i, source: feed.label })));
    } catch (err) {
      console.warn(`RSS feed ${feed.url} unavailable:`, err.message);
    }
  }

  // Cache 4 hours
  cache.set(cacheKey, allItems);
  return allItems;
}

// Get the most recent news item for a given player name
export function getPlayerNews(playerName, allNews, maxItems = 2) {
  if (!allNews?.length) return [];
  const norm = normalizeName(playerName);
  // Split into first/last for flexible matching
  const parts = norm.split(' ').filter(p => p.length > 2);

  return allNews
    .filter(item => {
      const text = normalizeName(item.title + ' ' + item.description);
      return parts.every(part => text.includes(part));
    })
    .slice(0, maxItems)
    .map(item => ({
      ...item,
      age: formatAge(item.pubDate),
    }));
}

function formatAge(pubDateStr) {
  if (!pubDateStr) return '';
  const date = new Date(pubDateStr);
  if (isNaN(date)) return '';
  const diffMs = Date.now() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}
