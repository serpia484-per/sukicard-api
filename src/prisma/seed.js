require('dotenv').config();
const prisma = require('./client');

const stores = [
  { name: 'SM Supermarket', category: 'grocery' },
  { name: 'Robinsons Supermarket', category: 'grocery' },
  { name: 'Mercury Drug', category: 'pharmacy' },
  { name: 'Watsons', category: 'pharmacy' },
  { name: 'Jollibee', category: 'food' },
  { name: "McDonald's Philippines", category: 'food' },
  { name: 'National Bookstore', category: 'bookstore' },
  { name: 'SM Department Store', category: 'fashion' },
  { name: 'Puregold', category: 'grocery' },
  { name: '7-Eleven Philippines', category: 'convenience' },
];

async function main() {
  const result = await prisma.store.createMany({ data: stores, skipDuplicates: true });
  console.log(`Seeded ${result.count} stores.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
