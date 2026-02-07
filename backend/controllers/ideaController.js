const { pool } = require('../config/db');
const { verifyToken } = require('../utils/jwt');

const createIdea = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId;

  try {
    const result = await pool.query(
      'INSERT INTO ideas (title, description, author_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, userId]
    );

    const newIdea = result.rows[0];
    res.status(201).json(newIdea);
  } catch (error) {
    console.error('Error creating idea', error);
    res.status(500).send('Internal server error');
  }
};

const getAllIdeas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ideas');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching ideas', error);
    res.status(500).send('Internal server error');
  }
};

const upvoteIdea = async (req, res) => {
  const ideaId = req.params.id;
  const userId = req.userId;

  try {
    const existingVote = await pool.query(
      'SELECT * FROM votes WHERE idea_id = $1 AND user_id = $2',
      [ideaId, userId]
    );

    if (existingVote.rows.length > 0) {
      return res.status(400).send('You have already voted for this idea.');
    }

    await pool.query(
      'INSERT INTO votes (idea_id, user_id, vote_type) VALUES ($1, $2, $3)',
      [ideaId, userId, 'upvote']
    );

    const result = await pool.query(
      'UPDATE ideas SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *',
      [ideaId]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error upvoting idea', error);
    res.status(500).send('Internal server error');
  }
};

const downvoteIdea = async (req, res) => {
  const ideaId = req.params.id;
  const userId = req.userId;

  try {
    const existingVote = await pool.query(
      'SELECT * FROM votes WHERE idea_id = $1 AND user_id = $2',
      [ideaId, userId]
    );

    if (existingVote.rows.length > 0) {
      return res.status(400).send('You have already voted for this idea.');
    }

    await pool.query(
      'INSERT INTO votes (idea_id, user_id, vote_type) VALUES ($1, $2, $3)',
      [ideaId, userId, 'downvote']
    );

    const result = await pool.query(
      'UPDATE ideas SET downvotes = downvotes + 1 WHERE id = $1 RETURNING *',
      [ideaId]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error downvoting idea', error);
    res.status(500).send('Internal server error');
  }
};

const addComment = async (req, res) => {
  const ideaId = req.params.id;
  const { message } = req.body;
  const userId = req.userId;

  try {
    const result = await pool.query(
      'INSERT INTO comments (idea_id, user_id, message) VALUES ($1, $2, $3) RETURNING *, (SELECT username FROM users WHERE id = $2) AS username',
      [ideaId, userId, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding comment', error);
    res.status(500).send('Internal server error');
  }
};

const getComments = async (req, res) => {
  const ideaId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE idea_id = $1',
      [ideaId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching comments', error);
    res.status(500).send('Internal server error');
  }
};

const getFilteredIdeas = async (req, res) => {
  const { filterType } = req.params;
  try {
    let result;
    switch (filterType) {
      case 'controversial':
        result = await pool.query('SELECT * FROM ideas ORDER BY ABS(upvotes - downvotes) ASC, upvotes - downvotes ASC;');
        break;
      case 'unpopular':
        result = await pool.query('SELECT * FROM ideas ORDER BY (downvotes - upvotes) DESC;');
        break;
      case 'mainstream':
        result = await pool.query('SELECT * FROM ideas ORDER BY (upvotes - downvotes) DESC;');
        break;
      default:
        return res.status(400).send('Invalid filter type');
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching filtered ideas', error);
    res.status(500).send('Internal server error');
  }
};

module.exports = { 
  createIdea, 
  getAllIdeas, 
  upvoteIdea, 
  downvoteIdea, 
  addComment, 
  getComments, 
  getFilteredIdeas 
};