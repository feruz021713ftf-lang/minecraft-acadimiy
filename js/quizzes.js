// Reusable quiz renderer used by multiple pages.
export function renderQuiz(container, questions, onComplete) {
  let idx = 0;
  let score = 0;

  function render() {
    if (idx >= questions.length) {
      container.innerHTML = `
        <div class="form-status success">
          Quiz complete! Score: ${score}/${questions.length}.
        </div>
      `;
      if (onComplete) onComplete(score, questions.length);
      return;
    }
    const q = questions[idx];
    container.innerHTML = `
      <p class="muted small">Question ${idx + 1} of ${questions.length}</p>
      <h3 style="margin-bottom:12px">${q.q}</h3>
      <div class="quiz-options">
        ${q.options.map((o, i) =>
          `<button class="btn btn-outline quiz-opt" data-i="${i}">${o}</button>`
        ).join('')}
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
          fb.textContent = `❌ Correct answer: ${q.options[q.answer]}`;
          fb.className = 'form-status quiz-feedback error';
        }
        container.querySelectorAll('.quiz-opt').forEach(b => (b.disabled = true));
        setTimeout(() => {
          idx++;
          render();
        }, 900);
      });
    });
  }
  render();
}