const router = require('express').Router();
const pool = require('../db');
const wrap = require('../middleware/wrap');

router.get('/', wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM students ORDER BY id DESC');
  res.json(rows);
}));

router.post('/', wrap(async (req, res) => {
  const { name, branch, cgpa, email } = req.body;
  if (!name || !branch) return res.status(400).json({ error: 'Name and branch are required' });
  if (cgpa !== '' && cgpa != null && (isNaN(cgpa) || cgpa < 0 || cgpa > 10))
    return res.status(400).json({ error: 'CGPA must be between 0 and 10' });
  const [r] = await pool.query(
    'INSERT INTO students (name, branch, cgpa, email) VALUES (?, ?, ?, ?)',
    [name, branch, cgpa === '' ? null : cgpa, email || null]
  );
  res.status(201).json({ id: r.insertId });
}));

router.delete('/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

module.exports = router;
