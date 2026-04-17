class WorkerPool {
  constructor(workerPath, poolSize = navigator.hardwareConcurrency || 4) {
    this.workerPath = workerPath
    this.poolSize = poolSize
    this.workers = []
    this.taskQueue = []
    this.activeWorkers = 0
    this.init()
  }

  init() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerPath, { type: 'module' })
      worker.onmessage = this.handleMessage.bind(this)
      this.workers.push({ worker, busy: false })
    }
  }

  handleMessage(e) {
    const { type, data } = e.data
    const worker = this.workers.find(w => w.worker === e.target)
    
    if (worker) {
      worker.busy = false
      this.activeWorkers--
      
      if (worker.currentResolve) {
        worker.currentResolve(data)
        worker.currentResolve = null
      }
      
      this.processQueue()
    }
  }

  async execute(type, data) {
    return new Promise((resolve) => {
      this.taskQueue.push({ type, data, resolve })
      this.processQueue()
    })
  }

  processQueue() {
    if (this.taskQueue.length === 0) return

    const availableWorker = this.workers.find(w => !w.busy)
    if (!availableWorker) return

    const task = this.taskQueue.shift()
    availableWorker.busy = true
    availableWorker.currentResolve = task.resolve
    availableWorker.worker.postMessage({ type: task.type, data: task.data })
    this.activeWorkers++
  }

  terminate() {
    this.workers.forEach(({ worker }) => worker.terminate())
    this.workers = []
  }
}

class FPSMonitor {
  constructor() {
    this.fps = 0
    this.frameCount = 0
    this.lastTime = performance.now()
    this.isMonitoring = false
    this.callbacks = []
    this.rafId = null
  }

  start() {
    if (this.isMonitoring) return
    this.isMonitoring = true
    this.measure()
  }

  stop() {
    this.isMonitoring = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
  }

  measure() {
    if (!this.isMonitoring) return

    const currentTime = performance.now()
    this.frameCount++

    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastTime = currentTime
      this.notifyCallbacks()
    }

    this.rafId = requestAnimationFrame(this.measure.bind(this))
  }

  onFPSChange(callback) {
    this.callbacks.push(callback)
  }

  notifyCallbacks() {
    this.callbacks.forEach(cb => cb(this.fps))
  }

  getFPS() {
    return this.fps
  }
}

function rafThrottle(fn) {
  let lastArgs = null
  let rafId = null

  return function(...args) {
    lastArgs = args
    
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        fn.apply(this, lastArgs)
        rafId = null
        lastArgs = null
      })
    }
  }
}

function debounce(fn, delay = 300) {
  let timeoutId = null

  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

function scheduleIdleCallback(callback, timeout = 5000) {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, { timeout })
  } else {
    return setTimeout(callback, 1)
  }
}

function cancelIdleCallback(handle) {
  if ('cancelIdleCallback' in window) {
    cancelIdleCallback(handle)
  } else {
    clearTimeout(handle)
  }
}

function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            observer.unobserve(img)
          }
        }
      })
    })

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
  }
}

class VirtualScroll {
  constructor(options) {
    this.itemHeight = options.itemHeight || 50
    this.containerHeight = options.containerHeight || 600
    this.buffer = options.buffer || 5
    this.items = options.items || []
    this.renderCallback = options.renderCallback
  }

  getVisibleRange(scrollTop) {
    const start = Math.floor(scrollTop / this.itemHeight)
    const end = Math.ceil((scrollTop + this.containerHeight) / this.itemHeight)
    
    return {
      start: Math.max(0, start - this.buffer),
      end: Math.min(this.items.length, end + this.buffer),
      offset: (start - this.buffer) * this.itemHeight
    }
  }

  render(scrollTop = 0) {
    const { start, end, offset } = this.getVisibleRange(scrollTop)
    const visibleItems = this.items.slice(start, end)
    
    return this.renderCallback(visibleItems, offset)
  }
}

class PerformanceMetrics {
  constructor() {
    this.metrics = new Map()
    this.observers = []
  }

  startMeasure(name) {
    performance.mark(`${name}-start`)
  }

  endMeasure(name) {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    
    const measure = performance.getEntriesByName(name)[0]
    if (measure) {
      this.metrics.set(name, measure.duration)
    }
    
    return this.metrics.get(name)
  }

  getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  clearMetrics() {
    this.metrics.clear()
    performance.clearMarks()
    performance.clearMeasures()
  }

  observePaint() {
    if ('PerformanceObserver' in window) {
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          console.log(`${entry.name}: ${entry.startTime}ms`)
        })
      })
      paintObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(paintObserver)
    }
  }

  observeLayoutShift() {
    if ('PerformanceObserver' in window) {
      const clsObserver = new PerformanceObserver((list) => {
        let clsScore = 0
        list.getEntries().forEach(entry => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value
          }
        })
        console.log(`Cumulative Layout Shift: ${clsScore}`)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)
    }
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
  }
}

export {
  WorkerPool,
  FPSMonitor,
  rafThrottle,
  debounce,
  scheduleIdleCallback,
  cancelIdleCallback,
  lazyLoadImages,
  VirtualScroll,
  PerformanceMetrics
}
