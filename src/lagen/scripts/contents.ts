const contents = document.querySelector<HTMLElement>('#contents')!;
const toggle = document.querySelector<HTMLButtonElement>('#contents-toggle')!;
const header = document.querySelector<HTMLElement>('.site-header')!;
const research = document.querySelector<HTMLDetailsElement>('#research')!;
const researchToggle = research.querySelector<HTMLElement>('summary')!;
const desktop = matchMedia('(min-width: 1800px)');
const links = [...contents.querySelectorAll<HTMLAnchorElement>('a')];
const sections = links.map(link => document.querySelector<HTMLElement>(link.hash)!);

function closeContents() {
  toggle.setAttribute('aria-expanded', 'false');
  contents.classList.remove('is-open');
}

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  research.open = false;
  toggle.setAttribute('aria-expanded', String(open));
  contents.classList.toggle('is-open', open);
});

research.addEventListener('toggle', () => {
  if (research.open) closeContents();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && research.open) {
    research.open = false;
    researchToggle.focus();
  }
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeContents();
    toggle.focus();
  }
});

document.addEventListener('click', event => {
  if (!research.contains(event.target as Node)) research.open = false;
  if (!contents.contains(event.target as Node) && !toggle.contains(event.target as Node)) closeContents();
});

links.forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    closeContents();
    // Keep native fragment navigation and put keyboard focus at the destination.
    const section = document.querySelector<HTMLElement>(link.hash)!;
    section.tabIndex = -1;
    section.focus({ preventScroll: true });
  });
});

desktop.addEventListener('change', () => {
  if (!desktop.matches && contents.contains(document.activeElement)) toggle.focus();
  closeContents();
});

let active = -1;
function updateCurrentSection() {
  const readingLine = header.getBoundingClientRect().bottom + 32;
  let current = -1;
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= readingLine) current = index;
  });
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = links.length - 1;
  if (current === active) return;
  active = current;
  links.forEach((link, index) => {
    if (index === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  if (desktop.matches && current !== -1) {
    const linkBox = links[current].getBoundingClientRect();
    const contentsBox = contents.getBoundingClientRect();
    if (linkBox.bottom > contentsBox.bottom - 20) contents.scrollTop += linkBox.bottom - contentsBox.bottom + 20;
    else if (linkBox.top < contentsBox.top + 20) contents.scrollTop += linkBox.top - contentsBox.top - 20;
  }
}

let pending = false;
function scheduleUpdate() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => {
    updateCurrentSection();
    pending = false;
  });
}
window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', scheduleUpdate);
window.addEventListener('load', scheduleUpdate);
void document.fonts.ready.then(scheduleUpdate);
updateCurrentSection();
