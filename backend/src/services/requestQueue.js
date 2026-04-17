import { Transform } from 'stream';

const userQueues = new Map();
const QUEUE_IDLE_TIMEOUT = 5 * 60 * 1000;
const CLEANUP_INTERVAL = 10 * 60 * 1000;

function processQueue(userId) {
  const queue = userQueues.get(userId);
  if (!queue || queue.running || queue.items.length === 0) return;

  queue.running = true;
  queue.lastActivity = Date.now();
  const { task, resolve, reject } = queue.items.shift();

  task()
    .then(resolve)
    .catch(reject)
    .finally(() => {
      queue.running = false;
      queue.lastActivity = Date.now();
      if (queue.items.length > 0) {
        processQueue(userId);
      } else {
        queue.lastActivity = Date.now();
      }
    });
}

export function enqueue(userId, task, timeout = 60000) {
  if (!userQueues.has(userId)) {
    userQueues.set(userId, { items: [], running: false, lastActivity: Date.now() });
  }
  const queue = userQueues.get(userId);
  queue.lastActivity = Date.now();

  return Promise.race([
    new Promise((resolve, reject) => {
      queue.items.push({ task, resolve, reject });
      if (!queue.running) {
        processQueue(userId);
      }
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

export function cleanupIdleQueues() {
  const now = Date.now();
  let cleaned = 0;

  for (const [userId, queue] of userQueues) {
    if (!queue.running && queue.items.length === 0) {
      const idleTime = now - (queue.lastActivity || 0);
      if (idleTime > QUEUE_IDLE_TIMEOUT) {
        userQueues.delete(userId);
        cleaned++;
      }
    }
  }

  return cleaned;
}

setInterval(cleanupIdleQueues, CLEANUP_INTERVAL);

export class SSEFlushStream extends Transform {
  constructor(res) {
    super({ objectMode: false });
    this.res = res;
  }

  _transform(chunk, encoding, callback) {
    this.res.write(chunk);
    if (typeof this.res.flush === 'function') {
      this.res.flush();
    }
    callback();
  }

  _flush(callback) {
    callback();
  }
}

export class TokenBuffer extends Transform {
  constructor(res, bufferSize = 5) {
    super({ objectMode: false });
    this.res = res;
    this.bufferSize = bufferSize;
    this.buffer = [];
    this.flushScheduled = false;
  }

  _transform(chunk, encoding, callback) {
    this.buffer.push(chunk);

    if (this.buffer.length >= this.bufferSize) {
      this.flushBuffer();
    }

    callback();
  }

  _flush(callback) {
    this.flushBuffer();
    callback();
  }

  flushBuffer() {
    if (this.buffer.length === 0) return;

    const combined = Buffer.concat(this.buffer);
    this.res.write(combined);
    if (typeof this.res.flush === 'function') {
      this.res.flush();
    }

    this.buffer = [];
  }
}

export function getQueueStats() {
  const stats = {};
  for (const [userId, queue] of userQueues) {
    stats[userId] = {
      pending: queue.items.length,
      running: queue.running,
      idleTime: Date.now() - (queue.lastActivity || Date.now())
    };
  }
  return stats;
}
