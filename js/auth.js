import { read, write, remove } from './storage.js';

// DEMO AUTHENTICATION ONLY.
// We never store real passwords. Instead the user sets a 4-digit demo PIN,
// which we hash with a non-cryptographic hash so it isn't stored in plain text.
// This is NOT secure and must never be used in production.

function demoHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

function getUsers() {
  const list = read('users', []);
  return Array.isArray(list) ? list : [];
}
function saveUsers(list) { write('users', list); }

export function getSession() {
  return read('session', null);
}
export function saveSession(s) { write('session', s); }

export function requireSession(redirect = 'login.html') {
  const s = getSession();
  if (!s) {
    location.replace(redirect);
    return null;
  }
  return s;
}

export function registerUser(name, pin) {
  name = (name || '').trim();
  if (name.length < 3) throw new Error('Name must be at least 3 characters.');
  if (!/^\d{4}$/.test(pin)) throw new Error('PIN must be 4 digits.');
  const users = getUsers();
  if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('That demo name is already taken.');
  }
  users.push({ name, pinHash: demoHash(pin), createdAt: Date.now() });
  saveUsers(users);
  saveSession({ name, avatar: 'default', since: Date.now() });
  return true;
}

export function loginUser(name, pin) {
  name = (name || '').trim();
  const users = getUsers();
  const u = users.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (!u) throw new Error('No demo account found with that name.');
  if (u.pinHash !== demoHash(pin)) throw new Error('Incorrect demo PIN.');
  saveSession({ name: u.name, avatar: u.avatar || 'default', since: Date.now() });
  return true;
}

export function logoutUser() {
  remove('session');
  location.href = 'index.html';
}

/* ---------- Wire UI if present ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = loginForm.querySelector('#login-name').value;
      const pin  = loginForm.querySelector('#login-pin').value;
      const status = loginForm.querySelector('.form-status');
      try {
        loginUser(name, pin);
        status.textContent = 'Logged in. Redirecting…';
        status.className = 'form-status success';
        setTimeout(() => (location.href = 'dashboard.html'), 400);
      } catch (err) {
        status.textContent = err.message;
        status.className = 'form-status error';
      }
    });

    const forgot = document.getElementById('forgot-link');
    const notice = document.getElementById('forgot-notice');
    if (forgot && notice) {
      forgot.addEventListener('click', (e) => {
        e.preventDefault();
        notice.hidden = !notice.hidden;
      });
    }
  }

  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = regForm.querySelector('#reg-name').value;
      const pin  = regForm.querySelector('#reg-pin').value;
      const pin2 = regForm.querySelector('#reg-pin2').value;
      const ack  = regForm.querySelector('#reg-ack');
      const status = regForm.querySelector('.form-status');
      if (pin !== pin2) {
        status.textContent = 'PINs do not match.';
        status.className = 'form-status error';
        return;
      }
      if (!ack.checked) {
        status.textContent = 'Please acknowledge the demo notice.';
        status.className = 'form-status error';
        return;
      }
      try {
        registerUser(name, pin);
        status.textContent = 'Account created. Redirecting…';
        status.className = 'form-status success';
        setTimeout(() => (location.href = 'dashboard.html'), 400);
      } catch (err) {
        status.textContent = err.message;
        status.className = 'form-status error';
      }
    });
  }
});