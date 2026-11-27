import { useEffect, useState } from 'react';
import { api, getToken } from './api.js';
import './styles.css';

// run an async action and show any error to the user
const safe = (fn) => async (...a) => {
  try { await fn(...a); } catch (e) { alert(e.message); }
};

function useList(path) {
  const [rows, setRows] = useState([]);
  const load = () => api(path).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);
  return [rows, load];
}

function Login({ onDone }) {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  async function submit(e) {
    e.preventDefault();
    try {
      const r = await api('/auth/' + mode, 'POST', f);
      localStorage.setItem('token', r.token);
      onDone();
    } catch (x) { setErr(x.message); }
  }
  return (
    <form className="login" onSubmit={submit}>
      <h1>Placement Tracker</h1>
      <input placeholder="Email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
      <input placeholder="Password" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
      {err && <p className="err">{err}</p>}
      <button>{mode === 'login' ? 'Log in' : 'Create coordinator account'}</button>
      <a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>
        {mode === 'login' ? 'First time? Create the account' : 'Back to log in'}
      </a>
    </form>
  );
}

function Dashboard() {
  const [rows] = useList('/applications/stats');
  return (
    <>
      <h2>Drive-wise summary</h2>
      {rows.length === 0 && <p className="empty">Add a drive and some applications to see numbers here.</p>}
      {rows.length > 0 && (
        <table>
          <thead><tr><th>Company</th><th>Applied</th><th>Shortlisted</th><th>Selected</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}><td>{r.company}</td><td>{r.applied}</td><td>{r.shortlisted}</td><td>{r.selected}</td></tr>
          ))}</tbody>
        </table>
      )}
    </>
  );
}

function Students() {
  const blank = { name: '', branch: '', cgpa: '', email: '' };
  const [rows, load] = useList('/students');
  const [f, setF] = useState(blank);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const add = safe(async (e) => { e.preventDefault(); await api('/students', 'POST', f); setF(blank); load(); });
  const del = safe(async (id) => { if (confirm('Delete this student and their applications?')) { await api('/students/' + id, 'DELETE'); load(); } });
  return (
    <>
      <h2>Students</h2>
      <form className="row" onSubmit={add}>
        <input placeholder="Name" value={f.name} onChange={set('name')} required />
        <input placeholder="Branch (e.g. MCA)" value={f.branch} onChange={set('branch')} required />
        <input placeholder="CGPA" type="number" step="0.01" min="0" max="10" value={f.cgpa} onChange={set('cgpa')} />
        <input placeholder="Email" type="email" value={f.email} onChange={set('email')} />
        <button>Add student</button>
      </form>
      {rows.length === 0 ? <p className="empty">No students yet. Add the first one above.</p> : (
        <table>
          <thead><tr><th>Name</th><th>Branch</th><th>CGPA</th><th>Email</th><th></th></tr></thead>
          <tbody>{rows.map((s) => (
            <tr key={s.id}><td>{s.name}</td><td>{s.branch}</td><td>{s.cgpa ?? '-'}</td><td>{s.email ?? '-'}</td>
              <td><button className="link" onClick={() => del(s.id)}>Delete</button></td></tr>
          ))}</tbody>
        </table>
      )}
    </>
  );
}

function Drives() {
  const blank = { company: '', package_lpa: '', drive_date: '' };
  const [rows, load] = useList('/drives');
  const [f, setF] = useState(blank);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const add = safe(async (e) => { e.preventDefault(); await api('/drives', 'POST', f); setF(blank); load(); });
  const del = safe(async (id) => { if (confirm('Delete this drive and its applications?')) { await api('/drives/' + id, 'DELETE'); load(); } });
  return (
    <>
      <h2>Company drives</h2>
      <form className="row" onSubmit={add}>
        <input placeholder="Company" value={f.company} onChange={set('company')} required />
        <input placeholder="Package (LPA)" type="number" step="0.01" value={f.package_lpa} onChange={set('package_lpa')} />
        <input type="date" value={f.drive_date} onChange={set('drive_date')} />
        <button>Add drive</button>
      </form>
      {rows.length === 0 ? <p className="empty">No drives yet. Add a company above.</p> : (
        <table>
          <thead><tr><th>Company</th><th>Package (LPA)</th><th>Date</th><th></th></tr></thead>
          <tbody>{rows.map((d) => (
            <tr key={d.id}><td>{d.company}</td><td>{d.package_lpa ?? '-'}</td><td>{d.drive_date ?? '-'}</td>
              <td><button className="link" onClick={() => del(d.id)}>Delete</button></td></tr>
          ))}</tbody>
        </table>
      )}
    </>
  );
}

function Applications() {
  const [apps, load] = useList('/applications');
  const [students] = useList('/students');
  const [drives] = useList('/drives');
  const [f, setF] = useState({ student_id: '', drive_id: '' });
  const add = safe(async (e) => { e.preventDefault(); await api('/applications', 'POST', f); load(); });
  const setStatus = safe(async (id, status) => { await api('/applications/' + id, 'PATCH', { status }); load(); });
  const del = safe(async (id) => { await api('/applications/' + id, 'DELETE'); load(); });
  return (
    <>
      <h2>Applications</h2>
      <form className="row" onSubmit={add}>
        <select value={f.student_id} onChange={(e) => setF({ ...f, student_id: e.target.value })} required>
          <option value="">Select student</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={f.drive_id} onChange={(e) => setF({ ...f, drive_id: e.target.value })} required>
          <option value="">Select drive</option>
          {drives.map((d) => <option key={d.id} value={d.id}>{d.company}</option>)}
        </select>
        <button>Add application</button>
      </form>
      {apps.length === 0 ? <p className="empty">No applications yet. Pick a student and a drive above.</p> : (
        <table>
          <thead><tr><th>Student</th><th>Branch</th><th>Company</th><th>Status</th><th></th></tr></thead>
          <tbody>{apps.map((a) => (
            <tr key={a.id}><td>{a.student}</td><td>{a.branch}</td><td>{a.company}</td>
              <td>
                <select value={a.status} onChange={(e) => setStatus(a.id, e.target.value)}>
                  {['applied', 'shortlisted', 'selected', 'rejected'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td><button className="link" onClick={() => del(a.id)}>Remove</button></td></tr>
          ))}</tbody>
        </table>
      )}
    </>
  );
}

const TABS = { Dashboard, Students, Drives, Applications };

export default function App() {
  const [authed, setAuthed] = useState(!!getToken());
  const [tab, setTab] = useState('Dashboard');
  useEffect(() => {
  document.body.className = authed ? 'in-app' : 'in-login';
}, [authed]);
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  const Page = TABS[tab];
  return (
    <div className="app">
      <header>
        <strong>Placement Tracker</strong>
        <nav>
          {Object.keys(TABS).map((t) => (
            <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
          ))}
        </nav>
        <button className="link" onClick={() => { localStorage.removeItem('token'); setAuthed(false); }}>Log out</button>
      </header>
      <main><Page key={tab} /></main>
    </div>
  );
}
