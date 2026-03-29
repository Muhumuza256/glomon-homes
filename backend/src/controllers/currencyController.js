const https = require('https')

let cachedRate = null
let cacheTime = 0
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

function fetchUsdToUgx() {
  return new Promise((resolve, reject) => {
    https.get('https://open.er-api.com/v6/latest/USD', (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          const rate = json?.rates?.UGX
          if (!rate) return reject(new Error('UGX rate not found in response'))
          resolve(rate)
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

async function getRate(req, res, next) {
  try {
    const now = Date.now()
    if (cachedRate && now - cacheTime < CACHE_TTL_MS) {
      return res.json({ rate: cachedRate, cached: true })
    }

    const rate = await fetchUsdToUgx()
    cachedRate = rate
    cacheTime = now
    res.json({ rate, cached: false })
  } catch (err) {
    // Fall back to a reasonable static rate if the API is unreachable
    res.json({ rate: 3700, cached: false, fallback: true })
  }
}

module.exports = { getRate }
