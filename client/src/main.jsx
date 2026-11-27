import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// [text, left %, start offset (s), duration (s)]
const TAGS = [
  ['Offer Letter', 6, 0, 18],
  ['12 LPA', 20, 4, 22],
  ['Shortlisted', 34, 8, 20],
  ['Interview', 48, 2, 24],
  ['Selected', 62, 6, 19],
  ['Placed', 76, 10, 23],
  ['Resume', 88, 13, 21],
];

function Background() {
  return (
    <div className="bg" aria-hidden="true">
      {TAGS.map(([text, left, offset, duration]) => (
        <span key={text} style={{ left: left + '%', animationDelay: '-' + offset + 's', animationDuration: duration + 's' }}>
          {text}
        </span>
      ))}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <>
    <Background />
    <App />
  </>
);