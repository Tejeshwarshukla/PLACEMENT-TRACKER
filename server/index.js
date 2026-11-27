require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));            // public
app.use('/api/students', auth, require('./routes/students'));       // protected
app.use('/api/drives', auth, require('./routes/drives'));           // protected
app.use('/api/applications', auth, require('./routes/applications')); // protected

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
