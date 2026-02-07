const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const { initializeDB } = require('./config/db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

initializeDB();

app.use('/auth', authRoutes);
app.use('/ideas', ideaRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});