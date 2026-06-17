require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth');
const cardsRouter = require('./routes/cards');
const storesRouter = require('./routes/stores');
const adminRouter = require('./routes/admin');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', authRouter);
app.use('/cards', authMiddleware, cardsRouter);
app.use('/stores', storesRouter);
app.use('/admin', adminRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'sukicard-api' });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Prime the Prisma connection pool so the first real request isn't slow
  const prisma = require('./prisma/client');
  await prisma.$queryRaw`SELECT 1`.catch(() => {});
  console.log('[db] connection pool ready');

  // Prevent Railway free-tier sleep by self-pinging every 10 minutes
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    const keepAliveUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/health`;
    setInterval(() => {
      fetch(keepAliveUrl).catch(() => {});
    }, 10 * 60 * 1000);
  }
});
