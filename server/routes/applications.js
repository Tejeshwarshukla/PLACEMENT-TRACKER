const router = require('express').Router();
const pool = require('../db');
const wrap = require('../middleware/wrap');

const STATUSES = ['applied', 'shortlisted', 'selected', 'rejected'];

router.get('/', wrap(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.id, a.status, s.name AS student, s.branch, d.company
     FROM applications a
     JOIN students s ON s.id = a.student_id
     JOIN drives d ON d.id = a.drive_id
     ORDER BY a.id DESC`
  );
  res.json(rows);
}));

router.post('/', wrap(async (req, res) => {
  const { student_id, drive_id } = req.body;
  if (!student_id || !drive_id) return res.status(400).json({ error: 'Choose a student and a drive' });
  await pool.query('INSERT INTO applications (student_id, drive_id) VALUES (?, ?)', [student_id, drive_id]);
  res.status(201).json({ ok: true });
}));

router.patch('/:id', wrap(async (req, res) => {
  if (!STATUSES.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status' });
  await pool.query('UPDATE applications SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
  res.json({ ok: true });
}));

router.delete('/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM applications WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

// Dashboard: per-drive counts
router.get('/stats', wrap(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT d.id, d.company,
            COUNT(a.id) AS applied,
            COALESCE(SUM(a.status = 'shortlisted'), 0) AS shortlisted,
            COALESCE(SUM(a.status = 'selected'), 0) AS selected
     FROM drives d LEFT JOIN applications a ON a.drive_id = d.id
     GROUP BY d.id, d.company ORDER BY d.id DESC`
  );
  res.json(rows.map((r) => ({ ...r, applied: +r.applied, shortlisted: +r.shortlisted, selected: +r.selected })));
}));

module.exports = router;
