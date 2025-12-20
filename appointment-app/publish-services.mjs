import { PrismaClient } from './generated/prisma/client/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('Publishing all services...\n')
  
  // Update all services to be published
  const result = await prisma.service.updateMany({
    where: {
      isPublished: false
    },
    data: {
      isPublished: true
    }
  })
  
  console.log(`✓ Updated ${result.count} services to published status`)
  
  // Show all services
  const services = await prisma.service.findMany({
    select: {
      id: true,
      title: true,
      isPublished: true,
    }
  })
  
  console.log('\nAll services are now:')
  services.forEach(service => {
    console.log(`  ✓ ${service.title} - Published: ${service.isPublished}`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
