const cache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

const stats = {
  hits: 0,
  misses: 0,
  sets: 0,
  deletes: 0
};

export function getCacheKey(model, messages, system) {
  const content = JSON.stringify({ model, messages, system });
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${model}_${Math.abs(hash)}`;
}

export function get(key) {
  const item = cache.get(key);
  if (!item) {
    stats.misses++;
    return null;
  }
  if (Date.now() > item.expiry) {
    cache.delete(key);
    stats.misses++;
    return null;
  }
  stats.hits++;
  return item.data;
}

export function set(key, data, ttl = DEFAULT_TTL) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl,
    createdAt: Date.now()
  });
  stats.sets++;
}

export function setWithCustomTTL(key, data, ttlSeconds) {
  return set(key, data, ttlSeconds * 1000);
}

export function deleteKey(key) {
  const deleted = cache.delete(key);
  if (deleted) {
    stats.deletes++;
  }
  return deleted;
}

export function clear() {
  cache.clear();
  stats.hits = 0;
  stats.misses = 0;
  stats.sets = 0;
  stats.deletes = 0;
}

export function getStats() {
  const totalRequests = stats.hits + stats.misses;
  const hitRate = totalRequests > 0 ? (stats.hits / totalRequests * 100).toFixed(2) : 0;
  
  return {
    size: cache.size,
    hits: stats.hits,
    misses: stats.misses,
    sets: stats.sets,
    deletes: stats.deletes,
    hitRate: `${hitRate}%`,
    totalRequests
  };
}

export function cleanup() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, item] of cache.entries()) {
    if (now > item.expiry) {
      cache.delete(key);
      cleaned++;
    }
  }
  
  return cleaned;
}
