const setup    = document.getElementById('setup');
const display  = document.getElementById('display');
const finished = document.getElementById('finished');
const timeEl   = document.getElementById('timeDisplay');
const timeSub  = document.getElementById('timeSub');
const ringFill = document.getElementById('ringFill');
const pauseBtn = document.getElementById('pauseBtn');
const pauseIcon  = document.getElementById('pauseIcon');
const pauseLabel = document.getElementById('pauseLabel');

const CIRCUMFERENCE = 2 * Math.PI * 88; // r=88

// Inject SVG gradient defs into the ring SVG
const svgEl = document.querySelector('.ring');
svgEl.insertAdjacentHTML('afterbegin', `
  <defs>
    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <linearGradient id="ringGradientWarn" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#e94560"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
  </defs>
`);

let totalSeconds = 0;
let remaining    = 0;
let interval     = null;
let running      = false;

function pad(n) { return String(n).padStart(2, '0'); }

function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function updateDisplay() {
  timeEl.textContent = formatTime(remaining);

  const pct = totalSeconds > 0 ? remaining / totalSeconds : 0;
  ringFill.style.strokeDashoffset = CIRCUMFERENCE * (1 - pct);
  ringFill.style.strokeDasharray  = CIRCUMFERENCE;

  const warn = remaining <= 10 && remaining > 0;
  ringFill.classList.toggle('warning', warn);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  timeSub.textContent = warn ? 'hurry up!' : 'remaining';
}

function finish() {
  clearInterval(interval);
  running = false;
  display.style.display  = 'none';
  finished.style.display = 'block';
}

function tick() {
  if (remaining <= 0) { finish(); return; }
  remaining--;
  updateDisplay();
}

document.getElementById('startBtn').addEventListener('click', () => {
  const h = parseInt(document.getElementById('hours').value)   || 0;
  const m = parseInt(document.getElementById('minutes').value) || 0;
  const s = parseInt(document.getElementById('seconds').value) || 0;
  totalSeconds = h * 3600 + m * 60 + s;
  if (totalSeconds <= 0) return;

  remaining = totalSeconds;
  setup.style.display    = 'none';
  finished.style.display = 'none';
  display.style.display  = 'block';
  updateDisplay();

  clearInterval(interval);
  interval = setInterval(tick, 1000);
  running = true;
  setPauseState(true);
});

pauseBtn.addEventListener('click', () => {
  if (running) {
    clearInterval(interval);
    running = false;
    setPauseState(false);
  } else {
    interval = setInterval(tick, 1000);
    running = true;
    setPauseState(true);
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(interval);
  running = false;
  display.style.display  = 'none';
  finished.style.display = 'none';
  setup.style.display    = 'block';
});

document.getElementById('restartBtn').addEventListener('click', () => {
  finished.style.display = 'none';
  setup.style.display    = 'block';
});

function setPauseState(isRunning) {
  if (isRunning) {
    pauseIcon.innerHTML  = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    pauseLabel.textContent = 'Pause';
  } else {
    pauseIcon.innerHTML  = '<path d="M8 5v14l11-7z"/>';
    pauseLabel.textContent = 'Resume';
  }
}
