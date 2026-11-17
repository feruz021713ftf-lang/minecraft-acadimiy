import { applySettings } from './storage.js';
import { getSession, logoutUser } from './auth.js';

// Apply saved theme / motion / compact settings on every page.
applySettings();

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Logout buttons ----------
  document.querySelectorAll('#logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  });

  // ---------- Sidebar toggle (app pages) ----------
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      const open = sidebar.classList.toggle('open');
      sidebarToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // ---------- Mobile nav toggle (landing page) ----------
  const navToggle = document.querySelector('.nav-toggle[aria-controls="nav-list"]');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // ---------- Session-aware topbar name ----------
  const session = getSession();
  if (session) {
    document.querySelectorAll('#topbar-name').forEach(el => {
      el.textContent = session.name || 'DemoPlayer';
    });
    document.querySelectorAll('.topbar-user .avatar').forEach(el => {
      if (session.avatar) el.dataset.avatar = session.avatar;
    });
  }

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Active link highlight (landing nav + sidebar) ----------
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.side-link, .nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPage);
  });
});
