import { requireSession } from './auth.js';
import { GUIDES, LESSONS } from './data.js';
import { getProgress, markGuideFinished, completeLesson, unlockAchievement, recordDailyProgress } from './progress.js';

const session = requireSession();
if (session) {
document.getElementById('topbar-name').textContent = session.name || 'DemoPlayer';

const gridEl = document.getElementById('guide-grid');
const searchEl = document.getElementById('guide-search');
const catEl = document.getElementById('guide-category');
const extraLessonsEl = document.getElementById('extra-secrets-lessons');

function renderGuides() {
  const p = getProgress();
  const q = (window.appSourceText?.(searchEl.value || '') || searchEl.value || '').toLowerCase();
  const cat = catEl.value;
  const list = GUIDES.filter(g => {
    if (q && !g.title.toLowerCase().includes(q) && !g.description.toLowerCase().includes(q)) return false;
    if (cat !== 'all' && g.category !== cat) return false;
    return true;
  });
  gridEl.innerHTML = list.map(g => {
    const done = p.finishedGuides.includes(g.id);
    return `
      <article class="guide-card">
        <div class="guide-head">
          <h3>${g.title} ${done ? '✅' : ''}</h3>
          <span class="tag">${g.category}</span>
        </div>
        <p class="muted small">${g.difficulty} · ${g.version}</p>
        <p>${g.description}</p>
        <details>
          <summary>Steps</summary>
          <ol class="objective-list">${g.steps.map(s => `<li>${s}</li>`).join('')}</ol>
        </details>
        ${g.requiredItems ? `<p class="muted small">Items: ${g.requiredItems.join(', ')}</p>` : ''}
        <button class="btn btn-outline" data-guide="${g.id}" ${done ? 'disabled' : ''}>
          ${done ? 'Completed ✅' : 'Mark as completed'}
        </button>
      </article>
    `;
  }).join('');
  if (!list.length) gridEl.innerHTML = '<p class="muted">No guides match your filters.</p>';

  gridEl.querySelectorAll('[data-guide]').forEach(btn => {
    btn.addEventListener('click', () => {
      markGuideFinished(btn.dataset.guide);
      renderGuides();
    });
  });
}

[searchEl, catEl].forEach(el => el.addEventListener('input', renderGuides));
renderGuides();

const extraSecretLessons = LESSONS.secrets.filter(lesson => lesson.id !== 's4');
function renderExtraSecretLessons() {
  const completed = getProgress().lessons;
  extraLessonsEl.innerHTML = extraSecretLessons.map(lesson => `
    <article class="module-card">
      <h3>${lesson.title} ${completed.includes(lesson.id) ? '✅' : ''}</h3>
      <p>${lesson.difficulty} · ${lesson.minutes} min · +${lesson.xp} XP</p>
      <button class="btn btn-outline" data-lesson="${lesson.id}" ${completed.includes(lesson.id) ? 'disabled' : ''}>
        ${completed.includes(lesson.id) ? 'Completed ✅' : 'Mark complete'}
      </button>
    </article>
  `).join('');
  extraLessonsEl.querySelectorAll('[data-lesson]').forEach(button => {
    button.addEventListener('click', () => {
      const lesson = extraSecretLessons.find(item => item.id === button.dataset.lesson);
      completeLesson(lesson.id, lesson.xp, 'secrets');
      renderExtraSecretLessons();
    });
  });
}
renderExtraSecretLessons();

/* ---------- Knowledge quiz ---------- */
const quizEl = document.getElementById('quiz-secrets');
const qs = [
  { q: 'How many obsidian blocks (minimum) do you need to build a Nether portal frame?', options: ['8', '10', '12', '14'], answer: 1 },
  { q: 'How many Eyes of Ender activate the End Portal?', options: ['8', '10', '12', '16'], answer: 2 },
  { q: 'What do you throw to locate a Stronghold?', options: ['Compass', 'Eye of Ender', 'Map', 'Ender Pearl'], answer: 1 },
];
let idx = 0, score = 0;
function renderQuiz() {
  if (idx >= qs.length) {
    quizEl.innerHTML = `<p class="form-status success">Score: ${score}/${qs.length}.</p>`;
    if (score >= 2) {
      recordDailyProgress('quiz');
      unlockAchievement('survival-strat');
      completeLesson('s4', 90, 'secrets');
    }
    return;
  }
  const q = qs[idx];
  quizEl.innerHTML = `
    <p class="muted small">Question ${idx + 1} of ${qs.length}</p>
    <h3 style="margin-bottom:12px">${q.q}</h3>
    <div class="quiz-options">
      ${q.options.map((o, i) => `<button class="btn btn-outline quiz-opt" data-i="${i}">${o}</button>`).join('')}
    </div>
    <div class="form-status quiz-feedback" role="status"></div>
  `;
  quizEl.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.i);
      const fb = quizEl.querySelector('.quiz-feedback');
      if (i === q.answer) { score++; fb.textContent = '✅ Correct!'; fb.className = 'form-status quiz-feedback success'; }
      else { fb.textContent = `❌ Correct: ${q.options[q.answer]}`; fb.className = 'form-status quiz-feedback error'; }
      quizEl.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
      setTimeout(() => { idx++; renderQuiz(); }, 900);
    });
  });
}
renderQuiz();
}