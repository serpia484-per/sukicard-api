const { Router } = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const prisma = require('../prisma/client');
const adminAuth = require('../middleware/adminAuth');

const router = Router();
const FLAGS_PATH = path.join(__dirname, '../data/feature-flags.json');

// POST /admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// GET /admin/users
router.get('/users', adminAuth, async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      _count: { select: { cards: true } },
    },
  });
  res.json(users);
});

// GET /admin/stores
router.get('/stores', adminAuth, async (req, res) => {
  const stores = await prisma.store.findMany({ orderBy: { name: 'asc' } });
  res.json(stores);
});

// POST /admin/stores
router.post('/stores', adminAuth, async (req, res) => {
  const { name, category, logoUrl, isPartner } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  const store = await prisma.store.create({
    data: {
      name: name.trim(),
      category: category ?? null,
      logoUrl: logoUrl ?? null,
      isPartner: isPartner ?? false,
    },
  });
  res.status(201).json(store);
});

// PATCH /admin/stores/:id
router.patch('/stores/:id', adminAuth, async (req, res) => {
  const { name, category, logoUrl, isPartner } = req.body;
  const data = {};
  if (name !== undefined) data.name = name.trim();
  if (category !== undefined) data.category = category;
  if (logoUrl !== undefined) data.logoUrl = logoUrl;
  if (isPartner !== undefined) data.isPartner = isPartner;

  try {
    const store = await prisma.store.update({ where: { id: req.params.id }, data });
    res.json(store);
  } catch {
    res.status(404).json({ error: 'Store not found' });
  }
});

// DELETE /admin/stores/:id
router.delete('/stores/:id', adminAuth, async (req, res) => {
  try {
    await prisma.store.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(404).json({ error: 'Store not found' });
  }
});

// GET /admin/feature-flags
router.get('/feature-flags', adminAuth, (req, res) => {
  try {
    const flags = JSON.parse(fs.readFileSync(FLAGS_PATH, 'utf8'));
    res.json(flags);
  } catch {
    res.status(500).json({ error: 'Failed to read feature flags' });
  }
});

// PATCH /admin/feature-flags
router.patch('/feature-flags', adminAuth, (req, res) => {
  try {
    const flags = JSON.parse(fs.readFileSync(FLAGS_PATH, 'utf8'));
    Object.assign(flags, req.body);
    fs.writeFileSync(FLAGS_PATH, JSON.stringify(flags, null, 2));
    res.json(flags);
  } catch {
    res.status(500).json({ error: 'Failed to update feature flags' });
  }
});

module.exports = router;
