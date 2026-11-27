// Express 4 does not catch errors from async handlers, so we do it here.
module.exports = (fn) => (req, res) =>
  fn(req, res).catch((e) => {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Already exists' });
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  });
