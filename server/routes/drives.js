const router = require('express').Router();
const pool = require('../db');
const wrap = require('../middleware/wrap');

router.get('/', wrap(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, company, package_lpa, DATE_FORMAT(drive_date, '%Y-%m-%d') AS drive_date FROM drives ORDER BY drive_date DESC"
  );
  res.json(rows);
}));

router.post('/', wrap(async (req, res) => {
  const { company, package_lpa, drive_date } = req.body;
  if (!company) return res.status(400).json({ error: 'Company name is required' });
  const [r] = await pool.query(
    'INSERT INTO drives (company, package_lpa, drive_date) VALUES (?, ?, ?)',
    [company, package_lpa === '' ? null : package_lpa, drive_date || null]
  );
  res.status(201).json({ id: r.insertId });
}));

router.delete('/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM drives WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

module.exports = router;
