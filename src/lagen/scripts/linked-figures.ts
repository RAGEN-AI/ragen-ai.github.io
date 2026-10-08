// Latency structure and visual history share selection, pinning and readouts.
for (const figure of document.querySelectorAll<HTMLElement>('[data-linked-figure]')) {
  const choices = [...figure.querySelectorAll<HTMLElement | SVGElement>('[data-choice]')];
  const tooltip = figure.querySelector<HTMLElement>('.if-tooltip')!;
  const announcement = figure.querySelector<HTMLElement>('[data-linked-announcement]')!;
  let pinned: string | null = null;

  function closeReadout() {
    tooltip.hidden = true;
    announcement.textContent = '';
  }

  function select(key: string | null) {
    if (key === null) delete figure.dataset.selection;
    else figure.dataset.selection = key;
    for (const target of choices) target.setAttribute('aria-pressed', String(target.dataset.choice === pinned));
    figure.dispatchEvent(new CustomEvent('figure-selection', { detail: key }));
  }

  function inspect(target: HTMLElement | SVGElement, x: number, y: number, speak: boolean) {
    closeReadout();
    for (const other of document.querySelectorAll<HTMLElement>('[role="tooltip"]')) other.hidden = true;
    if (!target.dataset.readout) return;
    // Method choices highlight; bins and results also provide a readout.
    const template = document.getElementById(target.dataset.readout) as HTMLTemplateElement;
    tooltip.replaceChildren(template.content.cloneNode(true));
    tooltip.hidden = false;
    const bounds = tooltip.getBoundingClientRect();
    tooltip.style.left = Math.max(12, Math.min(x + 16, innerWidth - bounds.width - 12)) + 'px';
    tooltip.style.top = Math.max(12, y + bounds.height + 16 < innerHeight ? y + 16 : y - bounds.height - 16) + 'px';
    if (speak) announcement.textContent = tooltip.innerText;
  }

  for (const target of choices) {
    const preview = () => select(target.dataset.choice!);
    target.addEventListener('pointerenter', event => {
      if ((event as PointerEvent).pointerType !== 'touch') preview();
    });
    target.addEventListener('pointermove', event => {
      const pointer = event as PointerEvent;
      if (pointer.pointerType !== 'touch') inspect(target, pointer.clientX, pointer.clientY, false);
    });
    target.addEventListener('pointerleave', event => {
      if ((event as PointerEvent).pointerType !== 'touch') { select(pinned); closeReadout(); }
    });
    target.addEventListener('focus', () => {
      if (target.matches(':focus-visible')) {
        preview();
        // Position after native focus scrolling, as for the existing chart readouts.
        requestAnimationFrame(() => {
          if (document.activeElement !== target || figure.dataset.selection !== target.dataset.choice) return;
          const bounds = target.getBoundingClientRect();
          inspect(target, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, true);
        });
      }
    });
    target.addEventListener('blur', () => { select(pinned); closeReadout(); });
    target.addEventListener('click', event => {
      pinned = pinned === target.dataset.choice ? null : target.dataset.choice!;
      select(pinned);
      if (pinned === null) closeReadout();
      else {
        const pointer = event as MouseEvent;
        const bounds = target.getBoundingClientRect();
        inspect(target, pointer.detail === 0 ? bounds.x + bounds.width / 2 : pointer.clientX,
          pointer.detail === 0 ? bounds.y + bounds.height / 2 : pointer.clientY, true);
      }
    });
    target.addEventListener('keydown', event => {
      const key = (event as KeyboardEvent).key;
      if ((key === 'Enter' || key === ' ') && !(target instanceof HTMLButtonElement)) {
        event.preventDefault();
        target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return;
      event.preventDefault();
      const group = target.closest('[data-choice-group]')!;
      const siblings = [...group.querySelectorAll<HTMLElement | SVGElement>('[data-choice]')]
        .filter(choice => choice.closest('[data-choice-group]') === group);
      const step = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1;
      const next = siblings[Math.max(0, Math.min(siblings.length - 1, siblings.indexOf(target) + step))];
      if (group.hasAttribute('data-roving')) {
        target.setAttribute('tabindex', '-1');
        next.setAttribute('tabindex', '0');
      }
      next.focus();
    });
  }
  function clear() { pinned = null; select(null); closeReadout(); }
  document.addEventListener('pointerdown', event => { if (!figure.contains(event.target as Node)) clear(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') clear(); });
  window.addEventListener('scroll', closeReadout, { passive: true, capture: true });
  window.addEventListener('resize', closeReadout);
}
