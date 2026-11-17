import { requireSession } from './auth.js';
import { LESSONS } from './data.js';
import { getProgress, completeLesson, unlockAchievement, recordDailyProgress } from './progress.js';

const session = requireSession();
if (session) {
document.getElementById('topbar-name').textContent = session.name || 'DemoPlayer';

/* ---------- Lesson cards ---------- */
const lessons = LESSONS.movement;
const grid = document.getElementById('lesson-grid');
const p = getProgress();
grid.innerHTML = lessons.map(l => {
  const done = p.lessons.includes(l.id);
  return `
    <article class="module-card">
      <h3>${l.title} ${done ? '✅' : ''}</h3>
      <p>${l.difficulty} · ${l.minutes} min · +${l.xp} XP</p>
      <button class="btn btn-outline" data-lesson="${l.id}">${done ? 'Review' : 'Mark complete'}</button>
    </article>
  `;
}).join('');

grid.querySelectorAll('[data-lesson]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.lesson;
    const lesson = lessons.find(l => l.id === id);
    completeLesson(id, lesson.xp, 'movement');
    btn.textContent = 'Completed ✅';
    btn.disabled = true;
  });
});

/* ---------- Parkour simulation ---------- */
const canvas = document.getElementById('parkour-canvas');
const ctx = canvas.getContext('2d');
const timerEl = document.getElementById('parkour-timer');
const checkpointEl = document.getElementById('parkour-checkpoint');
const parkourStatus = document.getElementById('parkour-status');

const W = canvas.width, H = canvas.height;
const player = { x: 40, y: H - 60, w: 22, h: 28, vx: 0, vy: 0, onGround: false };
const GRAVITY = 0.6;
const JUMP = -11;
const SPEED = 4;
const keys = { a: false, d: false, space: false };
const platforms = [
  { x: 0,   y: H - 40, w: 180, h: 40 },
  { x: 220, y: H - 90, w: 120, h: 20 },
  { x: 380, y: H - 140, w: 120, h: 20 },
  { x: 540, y: H - 100, w: 120, h: 20 },
  { x: 700, y: H - 60, w: 100, h: 40 },
];
const checkpoints = [
  { x: 260, y: H - 120, taken: false },
  { x: 420, y: H - 170, taken: false },
  { x: 730, y: H - 100, taken: false, final: true },
];

let running = false;
let startTime = 0;
let elapsed = 0;

function resetParkour() {
  player.x = 40; player.y = H - 60;
  player.vx = 0; player.vy = 0; player.onGround = false;
  checkpoints.forEach(c => (c.taken = false));
  running = false;
  elapsed = 0;
  timerEl.textContent = '0.0';
  checkpointEl.textContent = '0';
  parkourStatus.textContent = '';
  draw();
}

function draw() {
  ctx.fillStyle = '#1b1e24';
  ctx.fillRect(0, 0, W, H);
  // platforms
  ctx.fillStyle = '#3f8f30';
  platforms.forEach(pf => ctx.fillRect(pf.x, pf.y, pf.w, pf.h));
  // checkpoints
  checkpoints.forEach(c => {
    ctx.fillStyle = c.taken ? '#4fc3f7' : (c.final ? '#3ddc84' : '#ffc94d');
    ctx.fillRect(c.x, c.y, 12, 24);
  });
  // player
  ctx.fillStyle = '#3ddc84';
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function update() {
  if (keys.a) player.vx = -SPEED;
  else if (keys.d) player.vx = SPEED;
  else player.vx = 0;

  player.vy += GRAVITY;
  if (keys.space && player.onGround) {
    player.vy = JUMP;
    player.onGround = false;
  }

  player.x += player.vx;
  player.y += player.vy;
  player.onGround = false;

  // platform collision
  platforms.forEach(pf => {
    if (
      player.x + player.w > pf.x &&
      player.x < pf.x + pf.w &&
      player.y + player.h > pf.y &&
      player.y + player.h < pf.y + pf.h + 20 &&
      player.vy >= 0
    ) {
      player.y = pf.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  });

  // bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > W) player.x = W - player.w;

  // checkpoints
  checkpoints.forEach((c, i) => {
    if (!c.taken &&
        player.x + player.w > c.x && player.x < c.x + 12 &&
        player.y + player.h > c.y && player.y < c.y + 24) {
      c.taken = true;
      checkpointEl.textContent = checkpoints.filter(x => x.taken).length;
      parkourStatus.textContent = `Checkpoint ${i + 1} reached!`;
      if (c.final) {
        running = false;
        parkourStatus.textContent = `🏁 Completed in ${elapsed.toFixed(1)}s!`;
        unlockAchievement('parkour-app');
        completeLesson('m2', 60, 'movement');
      }
    }
  });
}

function loop() {
  if (running) {
    update();
    elapsed += 1 / 60;
    timerEl.textContent = elapsed.toFixed(1);
  }
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'a' || e.key === 'A') keys.a = true;
  if (e.key === 'd' || e.key === 'D') keys.d = true;
  if (e.key === ' ') { keys.space = true; e.preventDefault(); }
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'a' || e.key === 'A') keys.a = false;
  if (e.key === 'd' || e.key === 'D') keys.d = false;
  if (e.key === ' ') keys.space = false;
});

document.getElementById('parkour-start').addEventListener('click', () => {
  resetParkour();
  running = true;
  startTime = performance.now();
  parkourStatus.textContent = 'Running! Use A/D + Space.';
});

document.getElementById('parkour-reset').addEventListener('click', resetParkour);

resetParkour();
loop();

/* ---------- Combat quiz ---------- */
const quizCombat = document.getElementById('quiz-combat');
const combatQuestions = [
  {
    q: 'In Java Edition 1.9+, what limits how fast you can attack?',
    options: ['Held right-click', 'Attack cooldown indicator', 'Sneaking', 'Eating bread'],
    answer: 1,
  },
  {
    q: 'Best way to approach a skeleton at range?',
    options: ['Sprint directly', 'Use a shield + cover', 'Jump on it', 'Throw eggs'],
    answer: 1,
  },
  {
    q: 'What does strafing help you do in melee combat?',
    options: ['Fly', 'Circle the enemy to dodge', 'Break blocks', 'Heal'],
    answer: 1,
  },
];

let idx = 0, score = 0;
function renderCombatQuiz() {
  if (idx >= combatQuestions.length) {
    quizCombat.innerHTML = `<p class="form-status success">Score: ${score}/${combatQuestions.length}. +${score * 30} XP.</p>`;
    if (score >= 2) {
      recordDailyProgress('quiz');
      completeLesson('m4', 70, 'movement');
    }
    return;
  }
  const q = combatQuestions[idx];
  quizCombat.innerHTML = `
    <p class="muted small">Question ${idx + 1} of ${combatQuestions.length}</p>
    <h3 style="margin-bottom:12px">${q.q}</h3>
    <div class="quiz-options">
      ${q.options.map((o, i) => `<button class="btn btn-outline quiz-opt" data-i="${i}">${o}</button>`).join('')}
    </div>
    <div class="form-status quiz-feedback" role="status" aria-live="polite"></div>
  `;
  quizCombat.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.i);
      const fb = quizCombat.querySelector('.quiz-feedback');
      if (i === q.answer) { score++; fb.textContent = '✅ Correct!'; fb.className = 'form-status quiz-feedback success'; }
      else { fb.textContent = `❌ Correct: ${q.options[q.answer]}`; fb.className = 'form-status quiz-feedback error'; }
      quizCombat.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
      setTimeout(() => { idx++; renderCombatQuiz(); }, 900);
    });
  });
}
renderCombatQuiz();
}