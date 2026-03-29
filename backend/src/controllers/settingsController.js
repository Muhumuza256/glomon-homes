const prisma = require('../lib/prisma')

const ALLOWED_KEYS = ['hero_image']

async function getSettings(req, res, next) {
  try {
    const rows = await prisma.siteSetting.findMany()
    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    res.json(settings)
  } catch (err) {
    next(err)
  }
}

async function updateSetting(req, res, next) {
  try {
    const { key } = req.params
    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ error: `Unknown setting key: ${key}` })
    }
    const { value } = req.body
    if (typeof value !== 'string') {
      return res.status(400).json({ error: 'value must be a string' })
    }
    const row = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
    res.json(row)
  } catch (err) {
    next(err)
  }
}

module.exports = { getSettings, updateSetting }
