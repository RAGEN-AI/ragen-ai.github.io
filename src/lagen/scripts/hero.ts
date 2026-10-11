// Reveal the paper title letter by letter, then slide in the tagline, as on the RAGEN page.
const root = document.documentElement;
const title = document.querySelector<HTMLElement>('#paper-title');
const lead = document.querySelector<HTMLElement>('.hero-lead');

function split(element: HTMLElement, className: string, start: number, step: number) {
  const text = element.textContent?.trim() ?? '';
  element.setAttribute('aria-label', text);
  const letters = document.createElement('span');
  letters.setAttribute('aria-hidden', 'true');
  let index = 0;
  text.split(' ').forEach((word, wordIndex) => {
    if (wordIndex > 0) letters.append(' ');
    // Keep each word on one line when the title wraps on narrow screens.
    const wordSpan = document.createElement('span');
    wordSpan.className = 'intro-word';
    for (const char of word) {
      const span = document.createElement('span');
      span.className = className;
      span.textContent = char;
      span.style.animationDelay = `${start + index++ * step}s`;
      wordSpan.append(span);
    }
    letters.append(wordSpan);
  });
  element.replaceChildren(letters);
}

if (root.classList.contains('lagen-intro')) {
  if (title) split(title, 'intro-char', 0.15, 0.022);
  if (lead) split(lead, 'intro-char-lead', 0.95, 0.012);
  root.classList.add('lagen-intro-ready');
}
