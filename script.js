// Format seconds to days, hours, minutes, seconds
function formatUptime(seconds) {
  seconds = parseInt(seconds, 10);
  if (isNaN(seconds) || seconds < 0) {
    return 'Please enter a valid number of seconds.';
  }

  let days = Math.floor(seconds / 86400);
  seconds %= 86400;
  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;

  let parts = [];
  if (days) parts.push(`${days} days`);
  if (hours) parts.push(`${hours} hours`);
  if (minutes) parts.push(`${minutes} min`);
  if (seconds || parts.length === 0) parts.push(`${seconds} sec`);

  return parts.join(' ');
}

document.addEventListener('DOMContentLoaded', () => {
  // Existing calculator logic
  const input = document.getElementById('secondsInput');
  const calcBtn = document.getElementById('calcBtn');
  const resultText = document.getElementById('resultText');
  const copyBtn = document.getElementById('copyBtn');

  function calculateAndCopy() {
    const val = input.value;
    const formatted = formatUptime(val);
    resultText.textContent = formatted;

    if (formatted.trim() !== '') {
      navigator.clipboard.writeText(formatted);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
    }
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
    if (resultText.textContent.trim()) {
      navigator.clipboard.writeText(resultText.textContent);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
    }
  });

  // Theme toggle (default follows system, toggle is light/dark only)
  const THEME_KEY = 'theme'; // 'light' | 'dark'
  const themeToggle = document.getElementById('themeToggle');
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
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    themeToggle.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    themeToggle.innerHTML = isDark ? '<span aria-hidden="true">🌙</span>' : '<span aria-hidden="true">☀️</span>';
  };

  const applyTheme = (themeOrNull) => {
    if (themeOrNull === 'light' || themeOrNull === 'dark') {
      document.documentElement.setAttribute('data-theme', themeOrNull);
    } else {
      // Follow system default
      document.documentElement.removeAttribute('data-theme');
    }
    renderToggle(effectiveTheme());
  };

  // Initialize theme (system default unless user has a stored preference)
  applyTheme(getStoredTheme());

  // Toggle handler: flip between light and dark and persist
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = effectiveTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      setStoredTheme(next);
      applyTheme(next);
    });
  }

  // If following system and it changes, update UI accordingly
  media.addEventListener('change', () => {
    if (!getStoredTheme()) applyTheme(null);
  });
});
