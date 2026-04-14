import { Transform } from 'stream';

const userQueues = new Map();

function processQueue(userId) {
  const queue = userQueues.get(userId);
  if (!queue || queue.running || queue.items.length === 0) return;

  queue.running = true;
  const { task, resolve, reject } = queue.items.shift();

  task()
    .then(resolve)
    .catch(reject)
    .finally(() => {
      queue.running = false;
      if (queue.items.length > 0) {
        processQueue(userId);
      } else {
        userQueues.delete(userId);
      }
    });
}

export function enqueue(userId, task, timeout = 60000) {
  if (!userQueues.has(userId)) {
    userQueues.set(userId, { items: [], running: false });
  }
  const queue = userQueues.get(userId);

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
      running: queue.running
    };
  }
  return stats;
}
