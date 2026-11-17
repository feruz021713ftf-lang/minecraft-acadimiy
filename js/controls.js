import { requireSession } from './auth.js';
import { KEYBOARD, LESSONS } from './data.js';
import { getProgress, completeLesson, unlockAchievement, recordDailyProgress } from './progress.js';
import { createInventorySimulator } from './inventory.js';

const session = requireSession();
if (session) {
document.getElementById('topbar-name').textContent = session.name || 'DemoPlayer';

/* ---------- Keyboard ---------- */
const keyboardEl = document.getElementById('keyboard');
const keyDetail = document.getElementById('key-detail');
let filter = 'all';

function renderKeyboard() {
  const list = filter === 'all' ? KEYBOARD : KEYBOARD.filter(k => k.category === filter);
  keyboardEl.innerHTML = list.map(k => `
    <button class="key-btn" data-key="${k.key}" data-category="${k.category}">
      <span class="key-label">${k.key}</span>
      <span class="key-cat">${k.category}</span>
    </button>
  `).join('');
  keyboardEl.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = KEYBOARD.find(k => k.key === btn.dataset.key);
      keyDetail.innerHTML = `
        <h4>${key.key} <span class="tag">${key.category}</span></h4>
        <p>${key.desc}</p>
        <p class="micro-note">Java Edition defaults. Bedrock may differ and players can rebind in settings.</p>
      `;
    });
  });
}
renderKeyboard();

document.querySelectorAll('.tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tabs .tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    filter = tab.dataset.filter;
    renderKeyboard();
  });
});

/* ---------- Inventory ---------- */
const DEFAULT_HOTBAR = [
  { id: 'diamond-sword', name: 'Diamond Sword', icon: '🗡' },
  { id: 'iron-pickaxe',  name: 'Iron Pickaxe',  icon: '⛏' },
  null, null, null, null, null, null, null,
];

const DEFAULT_INV = [
  { id: 'plank', name: 'Oak Planks ×64', icon: '🟫' },
  { id: 'cobble', name: 'Cobblestone ×32', icon: '⬛' },
  { id: 'bread', name: 'Bread ×8', icon: '🍞' },
  { id: 'torch', name: 'Torch ×16', icon: '🕯' },
  ...Array(23).fill(null),
];

const hotbarEl = document.getElementById('hotbar');
const invEl = document.getElementById('inventory-grid');
const invStatus = document.getElementById('inv-status');
const inventorySimulator = createInventorySimulator(hotbarEl, invEl, {
  hotbar: DEFAULT_HOTBAR,
  inventory: DEFAULT_INV,
  onChange: () => {
    invStatus.textContent = 'Inventory updated.';
    checkChallenge();
  },
});

document.getElementById('sort-inv').addEventListener('click', () => {
  inventorySimulator.sort();
  invStatus.textContent = 'Inventory sorted.';
});

document.getElementById('reset-inv').addEventListener('click', () => {
  inventorySimulator.reset(DEFAULT_HOTBAR, DEFAULT_INV);
  invStatus.textContent = 'Inventory reset.';
});

/* ---------- Challenge ---------- */
let challengeActive = false;
let challengeTimer = null;
let challengeSeconds = 30;
let challengeScore = 0;
const taskEl = document.getElementById('challenge-task');
const timerEl = document.getElementById('challenge-timer');
const scoreEl = document.getElementById('challenge-score');
const challengeStatus = document.getElementById('challenge-status');

function resetChallenge() {
  clearInterval(challengeTimer);
  challengeActive = false;
  challengeSeconds = 30;
  timerEl.textContent = challengeSeconds;
  taskEl.textContent = 'Move the Diamond Sword into hotbar slot 1.';
  challengeStatus.textContent = '';
}

function prepareChallengeInventory() {
  const hotbar = [...DEFAULT_HOTBAR];
  const inventory = [...DEFAULT_INV];
  const sword = hotbar[0];
  hotbar[0] = null;
  inventory[4] = sword;
  inventorySimulator.reset(hotbar, inventory);
}

document.getElementById('challenge-start').addEventListener('click', () => {
  resetChallenge();
  prepareChallengeInventory();
  challengeActive = true;
  challengeStatus.textContent = 'Challenge started! Move the sword.';
  challengeTimer = setInterval(() => {
    challengeSeconds--;
    timerEl.textContent = challengeSeconds;
    if (challengeSeconds <= 0) {
      clearInterval(challengeTimer);
      challengeActive = false;
      challengeStatus.textContent = 'Time up. Try again!';
    }
  }, 1000);
});

document.getElementById('challenge-retry').addEventListener('click', () => {
  resetChallenge();
  prepareChallengeInventory();
});

function checkChallenge() {
  if (!challengeActive) return;
  const { hotbar } = inventorySimulator.getState();
  if (hotbar[0] && hotbar[0].id === 'diamond-sword') {
    clearInterval(challengeTimer);
    challengeActive = false;
    challengeScore += 100;
    scoreEl.textContent = challengeScore;
    challengeStatus.textContent = '✅ Success! +100 points.';
    unlockAchievement('inv-ninja');
    completeLesson('c4', 50, 'controls');
  }
}

const extraControlLessons = document.getElementById('extra-control-lessons');
const controlLessons = LESSONS.controls.filter(lesson => !['c1', 'c4'].includes(lesson.id));
function renderExtraControlLessons() {
  const completed = getProgress().lessons;
  extraControlLessons.innerHTML = controlLessons.map(lesson => `
    <article class="module-card">
      <h3>${lesson.title} ${completed.includes(lesson.id) ? '✅' : ''}</h3>
      <p>${lesson.difficulty} · ${lesson.minutes} min · +${lesson.xp} XP</p>
      <button class="btn btn-outline" data-lesson="${lesson.id}" ${completed.includes(lesson.id) ? 'disabled' : ''}>
        ${completed.includes(lesson.id) ? 'Completed ✅' : 'Mark complete'}
      </button>
    </article>
  `).join('');
  extraControlLessons.querySelectorAll('[data-lesson]').forEach(button => {
    button.addEventListener('click', () => {
      const lesson = controlLessons.find(item => item.id === button.dataset.lesson);
      completeLesson(lesson.id, lesson.xp, 'controls');
      renderExtraControlLessons();
    });
  });
}
renderExtraControlLessons();

/* ---------- Quiz ---------- */
const quizEl = document.getElementById('quiz-controls');
const controlQuestions = [
  {
    q: 'Which key opens the player inventory by default (Java)?',
    options: ['E', 'I', 'Tab', 'B'],
    answer: 0,
  },
  {
    q: 'Which key makes the player sprint while moving forward?',
    options: ['Shift', 'Ctrl', 'Alt', 'Space'],
    answer: 1,
  },
  {
    q: 'How many hotbar slots does the player have?',
    options: ['5', '7', '9', '12'],
    answer: 2,
  },
];

function renderQuiz(container, questions, onComplete) {
  let idx = 0;
  let score = 0;
  function render() {
    if (idx >= questions.length) {
      container.innerHTML = `<div class="form-status success">Quiz complete! Score: ${score}/${questions.length}. +${score * 20} XP.</div>`;
      if (onComplete) onComplete(score, questions.length);
      return;
    }
    const q = questions[idx];
    container.innerHTML = `
      <p class="muted small">Question ${idx + 1} of ${questions.length}</p>
      <h3 style="margin-bottom:12px">${q.q}</h3>
      <div class="quiz-options">
        ${q.options.map((o, i) => `<button class="btn btn-outline quiz-opt" data-i="${i}">${o}</button>`).join('')}
      </div>
      <div class="form-status quiz-feedback" role="status" aria-live="polite"></div>
    `;
    container.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.i);
        const fb = container.querySelector('.quiz-feedback');
        if (i === q.answer) {
          score++;
          fb.textContent = '✅ Correct!';
          fb.className = 'form-status quiz-feedback success';
        } else {
          fb.textContent = `❌ Incorrect. Correct answer: ${q.options[q.answer]}`;
          fb.className = 'form-status quiz-feedback error';
        }
        container.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
        setTimeout(() => { idx++; render(); }, 900);
      });
    });
  }
  render();
}

renderQuiz(quizEl, controlQuestions, (score) => {
  if (score >= 2) {
    recordDailyProgress('quiz');
    completeLesson('c1', 40, 'controls');
  }
});
}