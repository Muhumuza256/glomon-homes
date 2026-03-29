const { z } = require('zod')
const prisma = require('../lib/prisma')

const PAGE_SIZE = 12

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildOrderBy(sort) {
  switch (sort) {
    case 'price_asc':  return { price: 'asc' }
    case 'price_desc': return { price: 'desc' }
    default:           return { createdAt: 'desc' }
  }
}

// ─── Public: GET /api/properties ────────────────────────────────────────────

const querySchema = z.object({
  type:       z.enum(['APARTMENT','HOUSE','VILLA','COMMERCIAL','LAND','OFFICE']).optional(),
  priceType:  z.enum(['SALE','RENT']).optional(),
  district:   z.string().trim().optional(),
  bedrooms:   z.coerce.number().int().positive().optional(),
  minPrice:   z.coerce.number().nonnegative().optional(),
  maxPrice:   z.coerce.number().nonnegative().optional(),
  featured:   z.enum(['true','false']).optional(),
  sort:       z.enum(['newest','price_asc','price_desc']).optional(),
  page:       z.coerce.number().int().positive().default(1),
  limit:      z.coerce.number().int().positive().max(50).default(PAGE_SIZE),
})

async function getProperties(req, res, next) {
  try {
    const parsed = querySchema.safeParse(req.query)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message })
    }

    const { type, priceType, district, bedrooms, minPrice, maxPrice, featured, sort, page, limit } =
      parsed.data

    const where = {
      status: 'ACTIVE',
      ...(type       && { propertyType: type }),
      ...(priceType  && { priceType }),
      ...(district   && { district: { equals: district, mode: 'insensitive' } }),
      ...(bedrooms   && { bedrooms: { gte: bedrooms } }),
      ...(minPrice != null && { price: { gte: minPrice } }),
      ...(maxPrice != null && {
        price: {
          ...(minPrice != null ? { gte: minPrice } : {}),
          lte: maxPrice,
        },
      }),
      ...(featured === 'true' && { featured: true }),
    }

    const total = await prisma.property.count({ where })
    const data  = await prisma.property.findMany({
      where,
      orderBy: buildOrderBy(sort),
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, title: true, price: true, priceType: true, currency: true,
        propertyType: true, status: true, bedrooms: true, bathrooms: true,
        area: true, location: true, district: true, coverImage: true, featured: true,
        createdAt: true,
      },
    })

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
}

// ─── Public: GET /api/properties/featured ───────────────────────────────────

async function getFeaturedProperties(req, res, next) {
  try {
    const data = await prisma.property.findMany({
      where: { featured: true, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true, title: true, price: true, priceType: true, currency: true,
        propertyType: true, status: true, bedrooms: true, bathrooms: true,
        area: true, location: true, district: true, coverImage: true, featured: true,
        createdAt: true,
      },
    })
    res.json({ data })
  } catch (err) {
    next(err)
  }
}

// ─── Public: GET /api/properties/:id ────────────────────────────────────────

async function getPropertyById(req, res, next) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    })

    if (!property) {
      return res.status(404).json({ error: 'Property not found.' })
    }

    res.json(property)
  } catch (err) {
    next(err)
  }
}

// ─── Admin: GET /api/properties/admin/all ───────────────────────────────────

async function adminGetAllProperties(req, res, next) {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1)
    const limit = Math.min(50, parseInt(req.query.limit) || PAGE_SIZE)

    const total = await prisma.property.count()
    const data  = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
}

// ─── Admin: POST /api/properties ────────────────────────────────────────────

const createSchema = z.object({
  title:        z.string().trim().min(3, 'Title is required'),
  description:  z.string().trim().min(10, 'Description is required'),
  price:        z.number().positive('Price must be positive'),
  priceType:    z.enum(['SALE','RENT']),
  currency:     z.string().default('UGX'),
  propertyType: z.enum(['APARTMENT','HOUSE','VILLA','COMMERCIAL','LAND','OFFICE']),
  status:       z.enum(['ACTIVE','INACTIVE','SOLD','RENTED']).default('ACTIVE'),
  bedrooms:     z.number().int().positive().nullable().optional(),
  bathrooms:    z.number().int().positive().nullable().optional(),
  area:         z.number().positive().nullable().optional(),
  location:     z.string().trim().min(1, 'Location is required'),
  district:     z.string().trim().min(1, 'District is required'),
  address:      z.string().trim().nullable().optional(),
  latitude:     z.number().nullable().optional(),
  longitude:    z.number().nullable().optional(),
  images:       z.array(z.string().url()).default([]),
  coverImage:   z.string().url().nullable().optional(),
  featured:     z.boolean().default(false),
  amenities:    z.array(z.string()).default([]),
})

async function createProperty(req, res, next) {
  try {
    const parsed = createSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message })
    }

    const property = await prisma.property.create({ data: parsed.data })
    res.status(201).json(property)
  } catch (err) {
    next(err)
  }
}

// ─── Admin: PUT /api/properties/:id ─────────────────────────────────────────

async function updateProperty(req, res, next) {
  try {
    const parsed = createSchema.partial().safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message })
    }

    const existing = await prisma.property.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Property not found.' })

    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: parsed.data,
    })
    res.json(property)
  } catch (err) {
    next(err)
  }
}

// ─── Admin: DELETE /api/properties/:id ──────────────────────────────────────

async function deleteProperty(req, res, next) {
  try {
    const existing = await prisma.property.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Property not found.' })

    // Remove linked enquiries first, then the property
    await prisma.enquiry.deleteMany({ where: { propertyId: req.params.id } })
    await prisma.property.delete({ where: { id: req.params.id } })

    res.json({ deleted: true })
  } catch (err) {
    next(err)
  }
}

// ─── Admin: PATCH /api/properties/:id/status ────────────────────────────────

const statusSchema = z.object({
  status: z.enum(['ACTIVE','INACTIVE','SOLD','RENTED']),
})

async function updatePropertyStatus(req, res, next) {
  try {
    const parsed = statusSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message })
    }

    const existing = await prisma.property.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Property not found.' })

    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: { status: parsed.data.status },
    })
    res.json(property)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  adminGetAllProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
}
