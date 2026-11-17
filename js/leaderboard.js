import { requireSession } from './auth.js';
import { SAMPLE_LEADERBOARD } from './data.js';
import { getProgress, getRankForXP } from './progress.js';

const session = requireSession();
if (session) {
document.getElementById('topbar-name').textContent = session.name || 'DemoPlayer';

const bodyEl = document.getElementById('leaderboard-body');
const xpHeading = document.querySelector('#leaderboard-table thead th:last-child');
let board = 'weekly';

function render() {
  const p = getProgress();
  const score = board === 'weekly'
    ? p.weekly.reduce((total, xp) => total + xp, 0)
    : p.xp;
  const you = { name: session.name || 'You', xp: score, you: true };
  const rows = [
    ...SAMPLE_LEADERBOARD.map(player => ({
      name: player.name,
      xp: board === 'weekly' ? player.weeklyXP : player.xp,
    })),
    you,
  ].sort((a, b) => b.xp - a.xp);
  xpHeading.textContent = board === 'weekly' ? 'Weekly XP' : 'Total XP';
  bodyEl.innerHTML = rows.map((r, i) => {
    const rank = getRankForXP(r.xp).name;
    return `
      <tr class="${r.you ? 'you' : ''}">
        <td>${i + 1}</td>
        <td>${r.name}</td>
        <td>${rank}</td>
        <td>${r.xp.toLocaleString()}</td>
      </tr>
    `;
  }).join('');
}

document.querySelectorAll('.tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tabs .tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    board = tab.dataset.board;
    render();
  });
});

render();
}