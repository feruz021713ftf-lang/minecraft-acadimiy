import { requireSession } from './auth.js';
import { ACHIEVEMENTS } from './data.js';
import { getProgress } from './progress.js';

const session = requireSession();
if (session) {
document.getElementById('topbar-name').textContent = session.name || 'DemoPlayer';

const p = getProgress();
const listEl = document.getElementById('ach-list');
const summaryEl = document.getElementById('ach-summary');

const unlocked = p.achievements.length;
summaryEl.textContent = `${unlocked} of ${ACHIEVEMENTS.length} unlocked.`;

listEl.innerHTML = ACHIEVEMENTS.map(a => {
  const has = p.achievements.includes(a.id);
  return `
    <div class="ach-item ${has ? 'unlocked' : ''}">
      <div class="ach-icon ${has ? 'unlocked' : ''}">${a.icon}</div>
      <div class="ach-info">
        <h4>${a.name} ${has ? '✅' : '🔒'}</h4>
        <p>${a.desc}</p>
      </div>
      <span class="rank-badge">+${a.xp} XP</span>
    </div>
  `;
}).join('');
}