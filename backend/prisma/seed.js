const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const IMG = {
  house1:  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  house2:  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  house3:  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  house4:  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  apt1:    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  apt2:    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  apt3:    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  apt4:    'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80',
  land1:   'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  land2:   'https://images.unsplash.com/photo-1543674892-7d64d45df18b?w=800&q=80',
  land3:   'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80',
  villa:   'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
}

const properties = [
  // ── FOR SALE: Houses & Apartments (6) ──────────────────────────────────────
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
    coverImage: IMG.apt1,
    images: [IMG.apt1],
  },
  {
    title: 'Executive 4-Bedroom House in Muyenga',
    description:
      "A grand executive home perched on a hilltop in Muyenga, one of Kampala's most sought-after residential neighbourhoods. " +
      'The property sits on a half-acre plot with a manicured garden, private swimming pool, and covered outdoor entertaining area. ' +
      "Interiors are finished to the highest standard — Italian marble floors, a chef's kitchen, home office, and a fully tiled master suite with a soaking tub. " +
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
    coverImage: IMG.house1,
    images: [IMG.house1],
  },
  {
    title: '5-Bedroom Family Home in Naguru',
    description:
      'A spacious and elegant family residence in the leafy Naguru estate, close to the International Hospital and several international schools. ' +
      'The ground floor comprises a formal sitting room, family lounge, large dining room, and a modern kitchen with pantry. ' +
      'Upstairs are five bedrooms — all en-suite — including a master suite with a dressing room and private balcony. ' +
      'The compound features a well-tended garden, two covered parking bays, a borehole, solar water heating, and perimeter wall with electric fence. ' +
      "A rare opportunity in one of Kampala's most established and secure residential areas.",
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
    coverImage: IMG.house4,
    images: [IMG.house4],
  },
  {
    title: 'Modern 2-Bedroom Apartment in Bugolobi',
    description:
      'A contemporary 2-bedroom apartment in the sought-after Bugolobi neighborhood, minutes from Nakumatt Bugolobi and the industrial area. ' +
      'The apartment features an open kitchen flowing into a bright lounge, a private balcony with city views, and fully tiled bathrooms. ' +
      'The building has controlled access, a backup generator, and ample parking. ' +
      'Ideal for young professionals or as a smart rental investment.',
    price: 280000000,
    priceType: 'SALE',
    currency: 'UGX',
    propertyType: 'APARTMENT',
    status: 'ACTIVE',
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    location: 'Bugolobi, Kampala',
    district: 'Kampala',
    address: 'Bugolobi Flats Road',
    featured: false,
    amenities: ['Security', 'Parking', 'Generator', 'WiFi Ready'],
    coverImage: IMG.apt2,
    images: [IMG.apt2],
  },
  {
    title: '3-Bedroom Townhouse in Kira Town',
    description:
      'A beautifully designed 3-bedroom townhouse on a quiet road in Kira Town, offering the perfect balance of suburban peace and urban convenience. ' +
      'The property features a generous sitting room, dining area, and fitted kitchen on the ground floor. ' +
      'Three well-proportioned bedrooms upstairs, with the master having an en-suite and built-in wardrobe. ' +
      'Gated compound, tiled throughout, and serviced by a reliable borehole and municipality water supply.',
    price: 380000000,
    priceType: 'SALE',
    currency: 'UGX',
    propertyType: 'HOUSE',
    status: 'ACTIVE',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    location: 'Kira Town',
    district: 'Wakiso',
    address: 'Kira-Bulindo Road',
    featured: false,
    amenities: ['Security', 'Parking', 'Water Tank', 'Borehole', 'Garden'],
    coverImage: IMG.house2,
    images: [IMG.house2],
  },
  {
    title: 'Luxury 3-Bedroom Penthouse in Nakasero',
    description:
      'An exceptional penthouse apartment on the top floor of a premium development in Nakasero, the heart of Kampala. ' +
      'Floor-to-ceiling windows offer panoramic views of the city and surrounding hills. ' +
      "The home is fitted with imported finishes — stone countertops, hardwood floors, and a designer kitchen. " +
      'The master bedroom has a luxury en-suite and walk-in closet. Private rooftop terrace, secure parking, and 24/7 concierge.',
    price: 750000000,
    priceType: 'SALE',
    currency: 'UGX',
    propertyType: 'APARTMENT',
    status: 'ACTIVE',
    bedrooms: 3,
    bathrooms: 3,
    area: 210,
    location: 'Nakasero, Kampala',
    district: 'Kampala',
    address: 'Nakasero Hill Road',
    featured: true,
    amenities: ['Security', 'Parking', 'Generator', 'Gym', 'Lift', 'CCTV'],
    coverImage: IMG.apt4,
    images: [IMG.apt4],
  },

  // ── FOR RENT (3) ───────────────────────────────────────────────────────────
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
    coverImage: IMG.apt3,
    images: [IMG.apt3],
  },
  {
    title: 'Cosy Studio Apartment in Bukoto',
    description:
      "A compact and tastefully designed studio apartment in Bukoto, one of Kampala's most cosmopolitan neighbourhoods. " +
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
    coverImage: IMG.apt2,
    images: [IMG.apt2],
  },
  {
    title: '4-Bedroom House for Rent in Kira',
    description:
      'A well-maintained 4-bedroom family house available for rent in a quiet, secure estate in Kira. ' +
      'The property has a large compound with mature trees, two parking bays, and a servants quarters. ' +
      'The kitchen has been recently renovated with modern fittings. Each bedroom has ample storage. ' +
      'Close to Kira Health Centre, supermarkets, and international schools. ' +
      'Reliable borehole water supply and a perimeter wall with electric fence.',
    price: 2500000,
    priceType: 'RENT',
    currency: 'UGX',
    propertyType: 'HOUSE',
    status: 'ACTIVE',
    bedrooms: 4,
    bathrooms: 3,
    area: 240,
    location: 'Kira',
    district: 'Wakiso',
    address: 'Kira Road Estate',
    featured: false,
    amenities: ['Security', 'Parking', 'Garden', 'Borehole', 'Water Tank', 'CCTV'],
    coverImage: IMG.house3,
    images: [IMG.house3],
  },

  // ── LAND PLOTS (3) ────────────────────────────────────────────────────────
  {
    title: 'Prime 50×100ft Plot in Kira — Ready to Build',
    description:
      'A flat, ready-to-develop 50×100ft plot in a fast-growing residential zone of Kira. ' +
      'The plot has road access, is fully pegged, and comes with a clean title deed. ' +
      'Electricity and water mains are close by. The area is secure and features a mix of residential homes and ongoing developments. ' +
      'Ideal for constructing a family home or rental units. Priced to sell — title available for inspection.',
    price: 85000000,
    priceType: 'SALE',
    currency: 'UGX',
    propertyType: 'LAND',
    status: 'ACTIVE',
    bedrooms: null,
    bathrooms: null,
    area: 465,
    location: 'Kira',
    district: 'Wakiso',
    address: 'Kira-Bulindo Zone',
    featured: false,
    amenities: [],
    coverImage: IMG.land1,
    images: [IMG.land1],
  },
  {
    title: 'Lakeside Plot in Entebbe — Stunning Lake Victoria Views',
    description:
      'A rare opportunity to own a 75×100ft plot with direct views over Lake Victoria in Entebbe. ' +
      'Situated in a low-density, affluent neighbourhood close to Entebbe International Airport and several embassies. ' +
      'The land is elevated for maximum lake views and is suitable for a luxury villa or vacation rental development. ' +
      'Title deed available. Survey maps provided on request.',
    price: 220000000,
    priceType: 'SALE',
    currency: 'UGX',
    propertyType: 'LAND',
    status: 'ACTIVE',
    bedrooms: null,
    bathrooms: null,
    area: 697,
    location: 'Entebbe',
    district: 'Wakiso',
    address: 'Lake Victoria Road, Entebbe',
    featured: true,
    amenities: [],
    coverImage: IMG.land2,
    images: [IMG.land2],
  },
  {
    title: 'Commercial Land 1 Acre — Mukono Highway Frontage',
    description:
      'One acre of commercial land with 60 metres of frontage on the Kampala–Jinja Highway in Mukono. ' +
      'Currently bare land with permanent beacons and a clean mailo title. ' +
      'Suitable for a petrol station, commercial plaza, warehouse, or mixed-use development. ' +
      'Heavy daily traffic volume. All utilities (electricity, water) are accessible at the boundary. ' +
      'An exceptional investment in one of Uganda\'s fastest-growing corridors.',
    price: 450000000,
    priceType: 'SALE',
    currency: 'UGX',
    propertyType: 'LAND',
    status: 'ACTIVE',
    bedrooms: null,
    bathrooms: null,
    area: 4047,
    location: 'Mukono',
    district: 'Mukono',
    address: 'Kampala–Jinja Highway',
    featured: false,
    amenities: [],
    coverImage: IMG.land3,
    images: [IMG.land3],
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
