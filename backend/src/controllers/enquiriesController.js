const { z } = require('zod')
const prisma = require('../lib/prisma')

// ─── Validation schemas ──────────────────────────────────────────────────────

const enquirySchema = z.object({
  name:       z.string().trim().min(2, 'Name must be at least 2 characters'),
  email:      z.string().trim().email('A valid email address is required'),
  phone:      z.string().trim().optional().nullable(),
  message:    z.string().trim().min(5, 'Message must be at least 5 characters'),
  propertyId: z.string().trim().optional().nullable(),
})

const generalEnquirySchema = enquirySchema.omit({ propertyId: true })

// ─── Public: POST /api/enquiries ────────────────────────────────────────────

async function submitEnquiry(req, res, next) {
  try {
    const parsed = enquirySchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message })
    }

    const { name, email, phone, message, propertyId } = parsed.data

    // If a propertyId is provided, verify it exists
    if (propertyId) {
      const property = await prisma.property.findUnique({ where: { id: propertyId } })
      if (!property) {
        return res.status(404).json({ error: 'Property not found.' })
      }
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        message,
        propertyId: propertyId ?? null,
      },
    })

    res.status(201).json({ ok: true, id: enquiry.id })
  } catch (err) {
    next(err)
  }
}

// ─── Public: POST /api/enquiries/general ────────────────────────────────────

async function submitGeneralEnquiry(req, res, next) {
  try {
    const parsed = generalEnquirySchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message })
    }

    const { name, email, phone, message } = parsed.data

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        message,
        propertyId: null,
      },
    })

    res.status(201).json({ ok: true, id: enquiry.id })
  } catch (err) {
    next(err)
  }
}

// ─── Admin: GET /api/enquiries ───────────────────────────────────────────────

async function adminGetEnquiries(req, res, next) {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1)
    const limit = Math.min(50, parseInt(req.query.limit) || 20)
    const status = req.query.status // optional filter: NEW | READ | REPLIED

    const where = status ? { status } : {}

    const total = await prisma.enquiry.count({ where })
    const data  = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        property: {
          select: { id: true, title: true },
        },
      },
    })

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
}

// ─── Admin: PATCH /api/enquiries/:id/status ──────────────────────────────────

const statusSchema = z.object({
  status: z.enum(['NEW', 'READ', 'REPLIED']),
})

async function updateEnquiryStatus(req, res, next) {
  try {
    const parsed = statusSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message })
    }

    const existing = await prisma.enquiry.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Enquiry not found.' })

    const enquiry = await prisma.enquiry.update({
      where: { id: req.params.id },
      data: { status: parsed.data.status },
    })

    res.json(enquiry)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  submitEnquiry,
  submitGeneralEnquiry,
  adminGetEnquiries,
  updateEnquiryStatus,
}
