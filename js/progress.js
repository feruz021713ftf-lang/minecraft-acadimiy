import { read, write } from './storage.js';
import { RANKS, ACHIEVEMENTS, LESSONS } from './data.js';

const DEFAULT = {
  xp: 0,
  lessons: [],       // completed lesson IDs
  achievements: [],  // unlocked achievement IDs
  skills: { controls: 0, movement: 0, crafting: 0, secrets: 0 },
  activity: [],      // { ts, text }
  weekly: [0,0,0,0,0,0,0], // XP per day (Mon..Sun)
  weekKey: null,
  lastLessonId: null,
  finishedGuides: [],
  daily: null,
};

function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function emptyDailyProgress(date = todayKey()) {
  return { date, lessons: 0, crafts: 0, quizzes: 0 };
}

function currentWeekKey() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return todayKeyFromDate(date);
}

function todayKeyFromDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getProgress() {
  const p = read('progress', null);
  if (!p || typeof p !== 'object') {
    return {
      ...DEFAULT,
      skills: { ...DEFAULT.skills },
      activity: [],
      weekly: [...DEFAULT.weekly],
      lessons: [],
      achievements: [],
      finishedGuides: [],
      daily: emptyDailyProgress(),
      weekKey: currentWeekKey(),
    };
  }
  const weekKey = currentWeekKey();
  const weekly = p.weekKey === weekKey && Array.isArray(p.weekly) && p.weekly.length === 7
    ? p.weekly
    : [...DEFAULT.weekly];
  const daily = p.daily && p.daily.date === todayKey()
    ? {
        ...emptyDailyProgress(),
        ...p.daily,
        lessons: Number.isFinite(p.daily.lessons) ? p.daily.lessons : 0,
        crafts: Number.isFinite(p.daily.crafts) ? p.daily.crafts : 0,
        quizzes: Number.isFinite(p.daily.quizzes) ? p.daily.quizzes : 0,
      }
    : emptyDailyProgress();
  return {
    ...DEFAULT,
    ...p,
    skills: { ...DEFAULT.skills, ...(p.skills || {}) },
    activity: Array.isArray(p.activity) ? p.activity : [],
    weekly,
    weekKey,
    lessons: Array.isArray(p.lessons) ? p.lessons : [],
    achievements: Array.isArray(p.achievements) ? p.achievements : [],
    finishedGuides: Array.isArray(p.finishedGuides) ? p.finishedGuides : [],
    daily,
  };
}

export function saveProgress(p) {
  write('progress', p);
}

export function getRankForXP(xp) {
  let current = RANKS[0];
  for (const r of RANKS) if (xp >= r.threshold) current = r;
  const idx = RANKS.indexOf(current);
  const next = RANKS[idx + 1] || null;
  return { ...current, index: idx, next };
}

export function addXP(amount, reason = '') {
  if (!amount || amount < 0) return getProgress();
  const p = getProgress();
  const beforeRank = getRankForXP(p.xp).name;
  p.xp += amount;
  const dayIdx = (new Date().getDay() + 6) % 7; // Mon=0
  p.weekly[dayIdx] = (p.weekly[dayIdx] || 0) + amount;
  p.activity.unshift({ ts: Date.now(), text: `+${amount} XP ${reason ? '· ' + reason : ''}`.trim() });
  p.activity = p.activity.slice(0, 12);

  const afterRank = getRankForXP(p.xp).name;
  if (afterRank !== beforeRank) {
    p.activity.unshift({ ts: Date.now(), text: `Rank up → ${afterRank}` });
    checkAchievements(p);
  }
  saveProgress(p);
  return p;
}

export function recordDailyProgress(action) {
  const property = { lesson: 'lessons', craft: 'crafts', quiz: 'quizzes' }[action];
  if (!property) throw new RangeError(`Unknown daily progress action: ${action}`);
  const p = getProgress();
  p.daily[property]++;
  saveProgress(p);
  return p.daily[property];
}

export function completeLesson(lessonId, xpReward, moduleKey) {
  const p = getProgress();
  if (p.lessons.includes(lessonId)) {
    p.daily.lessons++;
    saveProgress(p);
    return p;
  }
  p.lessons.push(lessonId);
  p.lastLessonId = lessonId;
  p.daily.lessons++;
  if (moduleKey && p.skills[moduleKey] != null) {
    p.skills[moduleKey] = Math.min(100, (p.skills[moduleKey] || 0) + 10);
  }
  saveProgress(p);
  addXP(xpReward, `Lesson: ${lessonId}`);
  checkAchievements();
  return getProgress();
}

export function markGuideFinished(guideId) {
  const p = getProgress();
  if (!p.finishedGuides.includes(guideId)) {
    p.finishedGuides.push(guideId);
    if (p.finishedGuides.length === 3) unlockAchievement('secret-hunter');
    saveProgress(p);
  }
  return getProgress();
}

export function unlockAchievement(id) {
  const p = getProgress();
  if (p.achievements.includes(id)) return p;
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return p;
  p.achievements.push(id);
  saveProgress(p);
  addXP(ach.xp, `Achievement: ${ach.name}`);
  return getProgress();
}

export function checkAchievements() {
  const p = getProgress();
  if (p.lessons.length > 0) unlockAchievement('first-steps');
  if (getRankForXP(p.xp).name === 'Legend') unlockAchievement('legend-trial');
}

export function getNextLesson(moduleKey) {
  const p = getProgress();
  const list = LESSONS[moduleKey] || [];
  return list.find(l => !p.lessons.includes(l.id)) || list[0];
}

export function getContinueLesson() {
  const p = getProgress();
  for (const mod of Object.keys(LESSONS)) {
    const next = LESSONS[mod].find(l => !p.lessons.includes(l.id));
    if (next) return next;
  }
  // all done — return last lesson
  if (p.lastLessonId) {
    for (const mod of Object.keys(LESSONS)) {
      const found = LESSONS[mod].find(l => l.id === p.lastLessonId);
      if (found) return found;
    }
  }
  return LESSONS.controls[0];
}