const { Router } = require('express');
const prisma = require('../prisma/client');

const router = Router();

// GET /stores
router.get('/', async (req, res) => {
  const { category, search } = req.query;

  const where = {};
  if (category) where.category = category;
  if (search) where.name = { contains: search, mode: 'insensitive' };

  const stores = await prisma.store.findMany({
    where,
    orderBy: { name: 'asc' },
  });

  res.json(stores);
});

// GET /stores/:id
router.get('/:id', async (req, res) => {
  const store = await prisma.store.findUnique({ where: { id: req.params.id } });
  if (!store) return res.status(404).json({ error: 'Store not found' });
  res.json(store);
});

// POST /stores
router.post('/', async (req, res) => {
  const { name, category, logoUrl, isPartner } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const store = await prisma.store.create({
    data: {
      name,
      category: category ?? null,
      logoUrl: logoUrl ?? null,
      isPartner: isPartner ?? false,
    },
  });

  res.status(201).json(store);
});

module.exports = router;
