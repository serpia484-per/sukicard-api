const { Router } = require('express');
const prisma = require('../prisma/client');

const router = Router();

const VALID_TYPES = ['PHOTO', 'PHONE_ID', 'PARTNER'];

const cardIncludes = {
  store: true,
  cardPhoto: true,
  cardPhoneId: true,
  cardPartner: true,
};

// POST /cards
router.post('/', async (req, res) => {
  const { type, storeId, storeNameCustom, color, cardPhoto, cardPhoneId } = req.body;

  if (!type || !VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: `type must be one of: ${VALID_TYPES.join(', ')}` });
  }

  const detailCreate = {};
  if (type === 'PHOTO') {
    detailCreate.cardPhoto = { create: { ...cardPhoto } };
  } else if (type === 'PHONE_ID') {
    detailCreate.cardPhoneId = { create: { ...cardPhoneId } };
  } else if (type === 'PARTNER') {
    detailCreate.cardPartner = { create: { pointsBalance: 0 } };
  }

  const card = await prisma.card.create({
    data: {
      userId: req.userId,
      type,
      storeId: storeId ?? null,
      storeNameCustom: storeNameCustom ?? null,
      color: color ?? null,
      ...detailCreate,
    },
    include: cardIncludes,
  });

  res.status(201).json(card);
});

// GET /cards
router.get('/', async (req, res) => {
  console.time('[cards] prisma.findMany');
  const cards = await prisma.card.findMany({
    where: { userId: req.userId, isActive: true },
    include: cardIncludes,
    orderBy: { createdAt: 'desc' },
  });
  console.timeEnd('[cards] prisma.findMany');

  res.json(cards);
});

// GET /cards/:id
router.get('/:id', async (req, res) => {
  const card = await prisma.card.findFirst({
    where: { id: req.params.id, userId: req.userId },
    include: cardIncludes,
  });

  if (!card) return res.status(404).json({ error: 'Card not found' });
  res.json(card);
});

// PATCH /cards/:id
router.patch('/:id', async (req, res) => {
  const existing = await prisma.card.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!existing) return res.status(404).json({ error: 'Card not found' });

  const { storeNameCustom, color, isActive } = req.body;
  const data = {};
  if (storeNameCustom !== undefined) data.storeNameCustom = storeNameCustom;
  if (color !== undefined) data.color = color;
  if (isActive !== undefined) data.isActive = isActive;

  const card = await prisma.card.update({
    where: { id: req.params.id },
    data,
    include: cardIncludes,
  });

  res.json(card);
});

// DELETE /cards/:id
router.delete('/:id', async (req, res) => {
  const existing = await prisma.card.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!existing) return res.status(404).json({ error: 'Card not found' });

  await prisma.card.update({
    where: { id: req.params.id },
    data: { isActive: false },
  });

  res.json({ success: true });
});

module.exports = router;
