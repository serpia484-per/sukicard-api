require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth');
const cardsRouter = require('./routes/cards');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/cards', authMiddleware, cardsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'sukicard-api' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
