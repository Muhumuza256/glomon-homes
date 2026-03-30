const { z } = require('zod')
const prisma = require('../lib/prisma')

const createSchema = z.object({
  name:       z.string().trim().min(2, 'Name is required'),
  email:      z.string().email('Valid email required'),
  phone:      z.string().trim().optional(),
  propertyId: z.string().optional().nullable(),
  visitDate:  z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  timeSlot:   z.string().min(1, 'Please select a time slot'),
  notes:      z.string().trim().optional(),
})

async function createVisit(req, res, next) {
  try {
    const parsed = createSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message })
    }
    const { visitDate, ...rest } = parsed.data
    const visit = await prisma.visitBooking.create({
      data: { ...rest, visitDate: new Date(visitDate) },
    })
    res.status(201).json(visit)
  } catch (err) {
    next(err)
  }
}

async function getVisits(req, res, next) {
  try {
    const page  = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, parseInt(req.query.limit) || 20)
    const status = req.query.status || undefined

    const where = status ? { status } : {}
    const total = await prisma.visitBooking.count({ where })
    const data  = await prisma.visitBooking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { property: { select: { id: true, title: true } } },
    })

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
}

async function updateVisitStatus(req, res, next) {
  try {
    const { status } = req.body
    if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    const visit = await prisma.visitBooking.update({
      where: { id: req.params.id },
      data: { status },
    })
    res.json(visit)
  } catch (err) {
    next(err)
  }
}

module.exports = { createVisit, getVisits, updateVisitStatus }
