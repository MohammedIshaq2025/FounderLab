/**
 * Theme management for FounderLab.
 * Reads founderlab_theme from localStorage: 'light' | 'dark' | 'system'
 * Default is 'light' if nothing is set.
 * Applies .dark class to <html> element.
 */

export function getEffectiveTheme() {
  const stored = localStorage.getItem('founderlab_theme') || 'light';
  if (stored === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return stored;
}

export function applyTheme() {
  const theme = getEffectiveTheme();
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  return theme;
}

// Listen for system preference changes when set to 'system'
export function watchSystemTheme() {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => {
    const stored = localStorage.getItem('founderlab_theme') || 'light';
    if (stored === 'system') {
      applyTheme();
    }
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
