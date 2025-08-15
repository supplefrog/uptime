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
});
