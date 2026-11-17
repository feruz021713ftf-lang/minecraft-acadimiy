// Helper to mark the active sidebar link based on the current page.
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.side-link, .nav-list a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href === path) a.classList.add('active');
    else a.classList.remove('active');
  });
});