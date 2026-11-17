import { requireSession } from './auth.js';
import { INGREDIENT_ITEMS, RECIPES, LESSONS } from './data.js';
import { getProgress, completeLesson, unlockAchievement, recordDailyProgress } from './progress.js';

const session = requireSession();
if (session) {
document.getElementById('topbar-name').textContent = session.name || 'DemoPlayer';

/* ---------- Grid state ---------- */
const grid = Array(9).fill(null);
let selectedIngredient = null;

const gridEl = document.getElementById('crafting-grid');
const trayEl = document.getElementById('ingredient-tray');
const outputEl = document.getElementById('craft-output');
const craftBtn = document.getElementById('craft-btn');
const craftStatus = document.getElementById('craft-status');

function renderTray() {
  trayEl.innerHTML = INGREDIENT_ITEMS.map(i => `
    <button class="ing-btn ${selectedIngredient === i.id ? 'selected' : ''}" data-id="${i.id}" aria-label="${i.name}">
      <span style="font-size:1.4rem">${i.icon}</span>
      <small>${i.name}</small>
    </button>
  `).join('');
  trayEl.querySelectorAll('.ing-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedIngredient = selectedIngredient === btn.dataset.id ? null : btn.dataset.id;
      renderTray();
    });
  });
}

function renderGrid() {
  gridEl.innerHTML = grid.map((id, i) => {
    const item = id ? INGREDIENT_ITEMS.find(x => x.id === id) : null;
    return `<button class="grid-cell ${item ? 'filled' : ''}" data-i="${i}" aria-label="Cell ${i + 1}">${item ? `<span class="slot-icon">${item.icon}</span>` : ''}</button>`;
  }).join('');
  gridEl.querySelectorAll('.grid-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const i = Number(cell.dataset.i);
      if (grid[i]) {
        grid[i] = null;
      } else if (selectedIngredient) {
        grid[i] = selectedIngredient;
      }
      renderGrid();
      validate();
    });
  });
}

function validate() {
  const match = RECIPES.find(r => {
    if (!r.shaped) {
      // shapeless (not used here but supported)
      const needed = r.pattern.flat().filter(Boolean).sort();
      const placed = grid.filter(Boolean).sort();
      return needed.length === placed.length && needed.every((n, i) => n === placed[i]);
    }
    return r.pattern.flat().every((p, i) => p === grid[i]);
  });

  if (match) {
    outputEl.innerHTML = `
      <span class="muted small">${match.name}</span>
      <span style="font-size:2rem">${match.output.icon}</span>
    `;
    craftBtn.disabled = false;
    craftBtn.dataset.recipeId = match.id;
    craftStatus.textContent = `Recipe matched: ${match.name}`;
    craftStatus.className = 'form-status success';
  } else {
    outputEl.innerHTML = '<span class="muted small">Output</span>';
    craftBtn.disabled = true;
    delete craftBtn.dataset.recipeId;
    craftStatus.textContent = '';
  }
}

craftBtn.addEventListener('click', () => {
  const id = craftBtn.dataset.recipeId;
  if (!id) return;
  const r = RECIPES.find(x => x.id === id);
  if (!r) return;
  recordDailyProgress('craft');
  unlockAchievement('first-craft');
  completeLesson('cr1', r.xp, 'crafting');
  grid.fill(null);
  renderGrid();
  validate();
  outputEl.innerHTML = `
    <span class="muted small">Crafted ${r.name}</span>
    <span style="font-size:2rem">${r.output.icon}</span>
  `;
  craftStatus.textContent = `Crafted ${r.name}! +${r.xp} XP`;
  craftStatus.className = 'form-status success';
});

document.getElementById('clear-grid').addEventListener('click', () => {
  grid.fill(null);
  renderGrid();
  validate();
});

/* ---------- Catalog ---------- */
const searchEl = document.getElementById('recipe-search');
const catEl = document.getElementById('recipe-category');
const diffEl = document.getElementById('recipe-difficulty');
const recipeGrid = document.getElementById('recipe-grid');

function renderCatalog() {
  const q = (window.appSourceText?.(searchEl.value || '') || searchEl.value || '').toLowerCase();
  const cat = catEl.value;
  const diff = diffEl.value;
  const list = RECIPES.filter(r => {
    if (q && !r.name.toLowerCase().includes(q)) return false;
    if (cat !== 'all' && r.category !== cat) return false;
    if (diff !== 'all' && r.difficulty !== diff) return false;
    return true;
  });
  recipeGrid.innerHTML = list.map(r => `
    <article class="recipe-card">
      <div class="recipe-head">
        <span class="slot-icon" style="font-size:1.6rem">${r.output.icon}</span>
        <div>
          <h4>${r.name}</h4>
          <p class="muted small">${r.category} · ${r.difficulty}</p>
        </div>
      </div>
      <p class="muted small">Ingredients: ${uniqueIngredients(r)}</p>
    </article>
  `).join('');
  if (!list.length) recipeGrid.innerHTML = '<p class="muted">No recipes match your filters.</p>';
}

function uniqueIngredients(r) {
  const set = new Set(r.pattern.flat().filter(Boolean));
  return [...set].map(id => {
    const item = INGREDIENT_ITEMS.find(x => x.id === id);
    return item ? item.name : id;
  }).join(', ');
}

const extraCraftingLessons = document.getElementById('extra-crafting-lessons');
const craftingLessons = LESSONS.crafting.filter(lesson => !['cr1', 'cr3'].includes(lesson.id));
function renderExtraCraftingLessons() {
  const completed = getProgress().lessons;
  extraCraftingLessons.innerHTML = craftingLessons.map(lesson => `
    <article class="module-card">
      <h3>${lesson.title} ${completed.includes(lesson.id) ? '✅' : ''}</h3>
      <p>${lesson.difficulty} · ${lesson.minutes} min · +${lesson.xp} XP</p>
      <button class="btn btn-outline" data-lesson="${lesson.id}" ${completed.includes(lesson.id) ? 'disabled' : ''}>
        ${completed.includes(lesson.id) ? 'Completed ✅' : 'Mark complete'}
      </button>
    </article>
  `).join('');
  extraCraftingLessons.querySelectorAll('[data-lesson]').forEach(button => {
    button.addEventListener('click', () => {
      const lesson = craftingLessons.find(item => item.id === button.dataset.lesson);
      completeLesson(lesson.id, lesson.xp, 'crafting');
      renderExtraCraftingLessons();
    });
  });
}

[searchEl, catEl, diffEl].forEach(el => el.addEventListener('input', renderCatalog));

renderTray();
renderGrid();
renderCatalog();
renderExtraCraftingLessons();
validate();

/* ---------- Enchanting quiz ---------- */
const quizEl = document.getElementById('quiz-crafting');
const qs = [
  { q: 'Which item is consumed at the enchanting table in addition to XP?', options: ['Lapis Lazuli', 'Diamond', 'Gold Ingot', 'Ender Pearl'], answer: 0 },
  { q: 'What do bookshelves do near an enchanting table?', options: ['Nothing', 'Increase max enchantment level', 'Prevent enchantments', 'Give books'], answer: 1 },
  { q: 'What does a grindstone do?', options: ['Enchant items', 'Remove enchantments', 'Repair anvils', 'Mine faster'], answer: 1 },
];
let idx = 0, score = 0;
function renderQuiz() {
  if (idx >= qs.length) {
    quizEl.innerHTML = `<p class="form-status success">Score: ${score}/${qs.length}.</p>`;
    if (score >= 2) {
      recordDailyProgress('quiz');
      unlockAchievement('enchant-exp');
      completeLesson('cr3', 60, 'crafting');
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