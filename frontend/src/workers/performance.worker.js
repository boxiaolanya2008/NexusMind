self.onmessage = function(e) {
  const { type, data } = e.data

  switch (type) {
    case 'calculate-stats':
      const result = calculateStats(data)
      self.postMessage({ type: 'stats-result', data: result })
      break

    case 'process-data':
      const processed = processData(data)
      self.postMessage({ type: 'data-result', data: processed })
      break

    case 'format-large-number':
      const formatted = formatLargeNumber(data)
      self.postMessage({ type: 'format-result', data: formatted })
      break

    default:
      self.postMessage({ type: 'error', data: 'Unknown task type' })
  }
}

function calculateStats(data) {
  const startTime = performance.now()
  
  const stats = {
    total: data.length,
    sum: data.reduce((a, b) => a + b, 0),
    avg: data.length > 0 ? data.reduce((a, b) => a + b, 0) / data.length : 0,
    min: Math.min(...data),
    max: Math.max(...data),
    median: calculateMedian(data)
  }

  const endTime = performance.now()
  
  return {
    ...stats,
    processingTime: endTime - startTime
  }
}

function calculateMedian(data) {
  if (data.length === 0) return 0
  const sorted = [...data].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function processData(data) {
  const startTime = performance.now()
  
  const result = data.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }))

  const endTime = performance.now()
  
  return {
    data: result,
    count: result.length,
    processingTime: endTime - startTime
  }
}

function formatLargeNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toString()
}
