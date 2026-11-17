import { requireSession } from './auth.js';
import {
  getProgress, getRankForXP, getContinueLesson, addXP
} from './progress.js';
import { MODULES, LESSONS, ACHIEVEMENTS, DAILY_QUESTS } from './data.js';

const session = requireSession();
if (session) {
const p = getProgress();
const rank = getRankForXP(p.xp);

// Welcome
document.getElementById('welcome-name').textContent = session.name || 'DemoPlayer';
document.getElementById('topbar-name').textContent = session.name || 'DemoPlayer';
document.getElementById('rank-badge').textContent = rank.name;
document.getElementById('level-num').textContent = rank.index + 1;
document.getElementById('xp-current').textContent = p.xp + ' XP';
const nextXP = rank.next ? rank.next.threshold : rank.threshold;
document.getElementById('xp-next').textContent = nextXP + ' XP';
const pct = rank.next
  ? Math.min(100, ((p.xp - rank.threshold) / (rank.next.threshold - rank.threshold)) * 100)
  : 100;
document.getElementById('xp-fill').style.width = pct + '%';
document.getElementById('xp-hint').textContent = rank.next
  ? `${rank.next.threshold - p.xp} XP to ${rank.next.name}`
  : 'Legend reached!';

function moduleHref(key) {
  const m = MODULES.find(m => m.key === key);
  return m ? m.href : 'dashboard.html';
}

// Continue Learning
const cont = getContinueLesson();
const continueCard = document.getElementById('continue-card');
continueCard.innerHTML = `
  <div>
    <h3>${cont.title}</h3>
    <p>${cont.difficulty} · ${cont.minutes} min · +${cont.xp} XP</p>
  </div>
  <a class="btn btn-primary" href="${moduleHref(cont.module)}">Continue →</a>
`;

// Modules grid
const modulesGrid = document.getElementById('modules-grid');
modulesGrid.innerHTML = MODULES.map(m => {
  const lessons = LESSONS[m.key] || [];
  const done = lessons.filter(l => p.lessons.includes(l.id)).length;
  const pctMod = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  return `
    <a class="module-card" href="${m.href}">
      <h3>${m.title}</h3>
      <p>${m.desc}</p>
      <div class="bar"><div class="bar-fill" style="width:${pctMod}%"></div></div>
      <p class="small muted" style="margin-top:6px">${done}/${lessons.length} lessons</p>
    </a>
  `;
}).join('');

// Skills
const skillList = document.getElementById('skill-list');
const skillLabels = { controls: 'Controls', movement: 'Movement', crafting: 'Crafting', secrets: 'Knowledge' };
skillList.innerHTML = Object.entries(skillLabels).map(([k, label]) => `
  <li><span>${label}</span><div class="bar"><div class="bar-fill" style="width:${p.skills[k] || 0}%"></div></div></li>
`).join('');

// Daily quests (deterministic based on progress)
const questList = document.getElementById('quest-list');
const q1done = p.daily.lessons >= 1;
const q2done = p.daily.crafts >= 3;
const q3done = p.daily.quizzes >= 1;
questList.innerHTML = `
  <li><span class="quest-dot ${q1done ? 'done' : ''}"></span> ${DAILY_QUESTS[0].label} <em>+${DAILY_QUESTS[0].reward} XP</em></li>
  <li><span class="quest-dot ${q2done ? 'done' : ''}"></span> ${DAILY_QUESTS[1].label} <em>+${DAILY_QUESTS[1].reward} XP</em></li>
  <li><span class="quest-dot ${q3done ? 'done' : ''}"></span> ${DAILY_QUESTS[2].label} <em>+${DAILY_QUESTS[2].reward} XP</em></li>
`;

// Recent activity
const activityList = document.getElementById('activity-list');
if (!p.activity.length) {
  activityList.innerHTML = `<li class="muted small">No activity yet. Start a lesson to see progress here.</li>`;
} else {
  activityList.innerHTML = p.activity.slice(0, 6).map(a => `
    <li><span>${a.text}</span><small>${timeAgo(a.ts)}</small></li>
  `).join('');
}

// Achievement highlights
const achHighlights = document.getElementById('ach-highlights');
achHighlights.innerHTML = ACHIEVEMENTS.slice(0, 4).map(a => {
  const earned = p.achievements.includes(a.id);
  return `<div class="ach-badge ${earned ? 'earned' : ''}">
    <span class="ach-icon">${a.icon}</span>
    <strong>${a.name}</strong>
    <small>+${a.xp} XP</small>
  </div>`;
}).join('');

// Weekly activity
const weekChart = document.getElementById('week-chart');
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const maxXP = Math.max(1, ...p.weekly);
weekChart.innerHTML = p.weekly.map((xp, i) => {
  const h = Math.max(4, Math.round((xp / maxXP) * 100));
  return `<div class="week-bar" title="${xp} XP"><span style="height:${h}%"></span><small>${days[i]}</small></div>`;
}).join('');

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}
}