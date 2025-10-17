// Format seconds into a beautified human string
function formatUptime(totalSeconds) {
  const n = parseInt(totalSeconds, 10);
  if (isNaN(n) || n < 0) return 'Please enter a valid number of seconds.';

  let s = n;
  const days = Math.floor(s / 86400); s %= 86400;
  const hours = Math.floor(s / 3600); s %= 3600;
  const minutes = Math.floor(s / 60); s %= 60;
  const seconds = s;

  const plural = (v, unit) => `${v} ${v === 1 ? unit : unit + 's'}`;

  const parts = [];
  if (days) parts.push(plural(days, 'day'));
  if (hours) parts.push(plural(hours, 'hour'));
  if (minutes) parts.push(plural(minutes, 'min'));
  if (seconds || parts.length === 0) parts.push(plural(seconds, 'sec'));

  return parts.join(' ');
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('secondsInput');
  const calcBtn = document.getElementById('calcBtn');
  const resultText = document.getElementById('resultText');
  const copyBtn = document.getElementById('copyBtn');
  const themeToggle = document.getElementById('themeToggle');

  // Helper: return focus to input and place caret at end
  const refocusInput = () => {
    if (!input) return;
    requestAnimationFrame(() => {
      input.focus({ preventScroll: true });
      try {
        const len = String(input.value ?? '').length;
        // setSelectionRange may not apply to number inputs in all browsers; ignore errors
        input.setSelectionRange && input.setSelectionRange(len, len);
      } catch {}
    });
  };

  // Prevent mouse clicks from stealing focus from the input;
  // keyboard activation (Space/Enter) still focuses normally for a11y.
  [calcBtn, copyBtn, themeToggle].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('mousedown', (e) => e.preventDefault());
  });

  function flashOutput() {
    const container = document.querySelector('.output-container');
    if (!container) return;
    container.classList.remove('flash');
    // force reflow to replay animation
    void container.offsetWidth;
    container.classList.add('flash');
  }

  function calculateAndCopy() {
    const val = input.value;
    const formatted = formatUptime(val);
    resultText.textContent = formatted;
    flashOutput();

    if (formatted.trim() !== '') {
      navigator.clipboard.writeText(formatted).catch(() => {});
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
    }
    refocusInput();
  }

  input.focus();
  window.addEventListener('focus', () => input.focus());
  calcBtn.addEventListener('click', calculateAndCopy);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculateAndCopy();
    }
  });

  copyBtn.addEventListener('click', () => {
    const text = resultText.textContent.trim();
    if (!text) {
      refocusInput();
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
    }).catch(() => {});
    refocusInput();
  });

  // Theme toggle (default follows system, toggle only flips light/dark)
  const THEME_KEY = 'theme'; // 'light' | 'dark'
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const getStoredTheme = () => localStorage.getItem(THEME_KEY);
  const setStoredTheme = (t) => {
    if (t === 'light' || t === 'dark') localStorage.setItem(THEME_KEY, t);
    else localStorage.removeItem(THEME_KEY);
  };

  const effectiveTheme = () => {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') return stored;
    return media.matches ? 'dark' : 'light';
  };

  const renderToggle = (theme) => {
    if (!themeToggle) return;
    const dark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    themeToggle.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    themeToggle.innerHTML = dark ? '<span aria-hidden="true">🌙</span>' : '<span aria-hidden="true">☀️</span>';
  };

  const applyTheme = (themeOrNull) => {
    if (themeOrNull === 'light' || themeOrNull === 'dark') {
      document.documentElement.setAttribute('data-theme', themeOrNull);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    renderToggle(effectiveTheme());
  };

  applyTheme(getStoredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      setStoredTheme(next);
      applyTheme(next);
      refocusInput();
    });
  }

  media.addEventListener('change', () => {
    if (!getStoredTheme()) applyTheme(null);
  });
});
