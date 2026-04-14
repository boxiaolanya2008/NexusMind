const cache = new Map();
const TTL = 5 * 60 * 1000;

export function getCacheKey(model, messages, system) {
  const content = JSON.stringify({ model, messages, system });
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${model}_${hash}`;
}

export function get(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

export function set(key, data) {
  cache.set(key, {
    data,
    expiry: Date.now() + TTL
  });
}

export function clear() {
  cache.clear();
}
