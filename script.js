const setup = document.getElementById('setup');
const display = document.getElementById('display');
const finished = document.getElementById('finished');
const timeDisplay = document.getElementById('timeDisplay');
const progressFill = document.getElementById('progressFill');
const pauseBtn = document.getElementById('pauseBtn');

let totalSeconds = 0;
let remaining = 0;
let interval = null;
let running = false;

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(remaining);
  const pct = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;
  progressFill.style.width = pct + '%';
  timeDisplay.classList.toggle('warning', remaining <= 10 && remaining > 0);
}

function tick() {
  if (remaining <= 0) {
    clearInterval(interval);
    running = false;
    display.style.display = 'none';
    finished.style.display = 'block';
    new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAA...').play().catch(() => {});
    return;
  }
  remaining--;
  updateDisplay();
}

document.getElementById('startBtn').addEventListener('click', () => {
  const h = parseInt(document.getElementById('hours').value) || 0;
  const m = parseInt(document.getElementById('minutes').value) || 0;
  const s = parseInt(document.getElementById('seconds').value) || 0;
  totalSeconds = h * 3600 + m * 60 + s;
  if (totalSeconds <= 0) return;

  remaining = totalSeconds;
  setup.style.display = 'none';
  finished.style.display = 'none';
  display.style.display = 'block';
  updateDisplay();

  clearInterval(interval);
  interval = setInterval(tick, 1000);
  running = true;
  pauseBtn.textContent = 'Pause';
});

pauseBtn.addEventListener('click', () => {
  if (running) {
    clearInterval(interval);
    running = false;
    pauseBtn.textContent = 'Resume';
  } else {
    interval = setInterval(tick, 1000);
    running = true;
    pauseBtn.textContent = 'Pause';
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(interval);
  running = false;
  display.style.display = 'none';
  finished.style.display = 'none';
  setup.style.display = 'block';
});

document.getElementById('restartBtn').addEventListener('click', () => {
  finished.style.display = 'none';
  setup.style.display = 'block';
});
