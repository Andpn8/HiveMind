const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let result;
    if (email) {
      result = await pool.query(
        'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id',
        [username, hashedPassword, email]
      );
    } else {
      result = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
        [username, hashedPassword]
      );
    }

    res.status(201).send({ userId: result.rows[0].id });
  } catch (error) {
    res.status(400).send(error);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).send('Username or password incorrect');
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Username or password incorrect');
    }

    const token = generateToken(user.id);
    res.send({ token });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { register, login };
