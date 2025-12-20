import { PrismaClient } from './generated/prisma/client/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking database...\n')
  
  // Count all services
  const totalServices = await prisma.service.count()
  console.log(`Total services in DB: ${totalServices}`)
  
  // Count published services
  const publishedServices = await prisma.service.count({
    where: { isPublished: true }
  })
  console.log(`Published services: ${publishedServices}`)
  
  // Get all services with their published status
  const allServices = await prisma.service.findMany({
    select: {
      id: true,
      title: true,
      isPublished: true,
      organizationId: true,
    }
  })
  
  console.log('\nAll services:')
  allServices.forEach(service => {
    console.log(`  - ${service.title} (ID: ${service.id})`)
    console.log(`    Published: ${service.isPublished}`)
    console.log(`    Org ID: ${service.organizationId}`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
