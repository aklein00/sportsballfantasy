// Simple localStorage cache with TTL
// Usage: cache.get(key) / cache.set(key, value, ttlMs)

const DEFAULT_TTL = 4 * 60 * 60 * 1000; // 4 hours

export const cache = {
  get(key) {
    try {
      const raw = localStorage.getItem(`sbf_${key}`);
      if (!raw) return null;
      const { value, expires } = JSON.parse(raw);
      if (Date.now() > expires) {
        localStorage.removeItem(`sbf_${key}`);
        return null;
      }
      return value;
    } catch {
      return null;
    }
  },

  set(key, value, ttl = DEFAULT_TTL) {
    try {
      localStorage.setItem(`sbf_${key}`, JSON.stringify({
        value,
        expires: Date.now() + ttl,
      }));
    } catch {
      // localStorage full or unavailable — fail silently
    }
  },

  clear(key) {
    localStorage.removeItem(`sbf_${key}`);
  },

  clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith('sbf_'))
      .forEach(k => localStorage.removeItem(k));
  },
};
