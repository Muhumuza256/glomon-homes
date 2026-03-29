const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const PLACEHOLDER = 'https://placehold.co/800x600/1B4332/white?text=Glomon+Homes'

const properties = [
  {
    title: 'Spacious 3-Bedroom Apartment in Kololo',
    description:
      'A beautifully finished 3-bedroom apartment nestled in the prestigious Kololo hill area of Kampala. ' +
      'The apartment features an open-plan living and dining area with large windows offering sweeping views over the city. ' +
      'The kitchen is fully fitted with modern cabinetry and quality appliances. ' +
      'Each bedroom is generously sized with built-in wardrobes, and the master en-suite includes a walk-in shower and double vanity. ' +
      'The building has 24-hour security, covered parking for two vehicles, a backup generator, and a rooftop terrace shared by residents.',
    price: 450000000,
    priceType: 'SALE',
    currency: 'UGX',
    propertyType: 'APARTMENT',
    status: 'ACTIVE',
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    location: 'Kololo, Kampala',
    district: 'Kampala',
    address: 'Upper Kololo Terrace',
    featured: true,
    amenities: ['Security', 'Parking', 'Generator', 'Water Tank'],
    coverImage: PLACEHOLDER,
    images: [PLACEHOLDER],
  },
  {
    title: 'Executive 4-Bedroom House in Muyenga',
    description:
      'A grand executive home perched on a hilltop in Muyenga, one of Kampala\'s most sought-after residential neighbourhoods. ' +
      'The property sits on a half-acre plot with a manicured garden, private swimming pool, and covered outdoor entertaining area. ' +
      'Interiors are finished to the highest standard — Italian marble floors, a chef\'s kitchen, home office, and a fully tiled master suite with a soaking tub. ' +
      'The compound is fully walled and gated with CCTV surveillance and a guard house. ' +
      'A standby generator and 10,000-litre water tank ensure uninterrupted comfort.',
    price: 950000000,
    priceType: 'SALE',
    currency: 'UGX',
    propertyType: 'HOUSE',
    status: 'ACTIVE',
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    location: 'Muyenga, Kampala',
    district: 'Kampala',
    address: 'Tank Hill Road, Muyenga',
    featured: true,
    amenities: ['Swimming Pool', 'Security', 'Parking', 'Garden', 'Generator', 'Water Tank', 'CCTV'],
    coverImage: PLACEHOLDER,
    images: [PLACEHOLDER],
  },
  {
    title: 'Modern 2-Bedroom Flat in Ntinda',
    description:
      'A stylish and well-maintained 2-bedroom flat in the vibrant Ntinda suburb, ideal for young professionals or small families. ' +
      'The open-plan living space flows onto a private balcony, perfect for evening relaxation. ' +
      'Both bedrooms are bright and spacious, with the master having a private bathroom. ' +
      'The block is located walking distance from Ntinda Shopping Centre, restaurants, and major bus routes. ' +
      'Covered parking, security guard on site, and reliable water supply make this a practical and comfortable choice.',
    price: 1800000,
    priceType: 'RENT',
    currency: 'UGX',
    propertyType: 'APARTMENT',
    status: 'ACTIVE',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    location: 'Ntinda, Kampala',
    district: 'Kampala',
    address: 'Ntinda Road',
    featured: false,
    amenities: ['Security', 'Parking', 'Water Tank'],
    coverImage: PLACEHOLDER,
    images: [PLACEHOLDER],
  },
  {
    title: 'Cosy Studio Apartment in Bukoto',
    description:
      'A compact and tastefully designed studio apartment in Bukoto, one of Kampala\'s most cosmopolitan neighbourhoods. ' +
      'The space is cleverly laid out with a defined sleeping area, a modern kitchenette, and a well-appointed shower room. ' +
      'High-speed internet infrastructure is already in place, and the building has a reliable generator backup. ' +
      'Walking distance to Acacia Mall, cafes, supermarkets, and public transport. ' +
      'Perfect for a single professional or as a pied-à-terre for frequent Kampala visitors.',
    price: 950000,
    priceType: 'RENT',
    currency: 'UGX',
    propertyType: 'APARTMENT',
    status: 'ACTIVE',
    bedrooms: 1,
    bathrooms: 1,
    area: 48,
    location: 'Bukoto, Kampala',
    district: 'Kampala',
    address: 'Bukoto Street',
    featured: false,
    amenities: ['Security', 'WiFi Ready', 'Generator'],
    coverImage: PLACEHOLDER,
    images: [PLACEHOLDER],
  },
  {
    title: '5-Bedroom Family Home in Naguru',
    description:
      'A spacious and elegant family residence in the leafy Naguru estate, close to the International Hospital and several international schools. ' +
      'The ground floor comprises a formal sitting room, family lounge, large dining room, and a modern kitchen with pantry. ' +
      'Upstairs are five bedrooms — all en-suite — including a master suite with a dressing room and private balcony. ' +
      'The compound features a well-tended garden, two covered parking bays, a borehole, solar water heating, and perimeter wall with electric fence. ' +
      'A rare opportunity in one of Kampala\'s most established and secure residential areas.',
    price: 1200000000,
    priceType: 'SALE',
    currency: 'UGX',
    propertyType: 'HOUSE',
    status: 'ACTIVE',
    bedrooms: 5,
    bathrooms: 5,
    area: 420,
    location: 'Naguru, Kampala',
    district: 'Kampala',
    address: 'Naguru Drive',
    featured: true,
    amenities: ['Security', 'Parking', 'Garden', 'Generator', 'Water Tank', 'Borehole', 'CCTV'],
    coverImage: PLACEHOLDER,
    images: [PLACEHOLDER],
  },
]

async function main() {
  console.log('Seeding database…')

  // Admin user (upsert — safe to re-run)
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'GlomonAdmin2025!', 10)
  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@glomonhomes.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@glomonhomes.com',
      password: hashedPassword,
    },
  })
  console.log('✓ Admin user ready')

  // Clear existing properties and enquiries, then re-seed cleanly
  await prisma.enquiry.deleteMany()
  await prisma.property.deleteMany()
  console.log('✓ Cleared existing listings')

  for (const data of properties) {
    await prisma.property.create({ data })
  }
  console.log(`✓ Seeded ${properties.length} properties`)

  console.log('\nDone. You can re-run this script any time to reset sample data.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
