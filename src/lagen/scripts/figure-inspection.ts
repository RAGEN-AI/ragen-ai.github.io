// Evidence figures share readouts; SVG plots select columns and heatmaps select cells.
for (const figure of document.querySelectorAll<HTMLElement>('[data-interactive-figure]')) {
  const tooltip = figure.querySelector<HTMLElement>('.if-tooltip')!;
  const announcement = figure.querySelector<HTMLElement>('[data-inspect-announcement]')!;
  const charts = [...figure.querySelectorAll<SVGSVGElement | HTMLTableElement>('[data-inspect-chart]')];
  let active: SVGGElement | HTMLTableCellElement | null = null;

  function dismiss() {
    active?.classList.remove('is-inspected');
    active = null;
    tooltip.hidden = true;
    announcement.textContent = '';
    for (const chart of charts) chart.setAttribute('aria-describedby', figure.id + '-help');
  }

  function show(target: SVGGElement | HTMLTableCellElement, clientX: number, clientY: number, announce: boolean) {
    for (const other of document.querySelectorAll<HTMLElement>('[role="tooltip"]')) {
      if (other !== tooltip) other.hidden = true;
    }
    if (active !== target) {
      dismiss();
      active = target;
      active.classList.add('is-inspected');
      const template = document.getElementById(target.dataset.readout!) as HTMLTemplateElement;
      tooltip.replaceChildren(template.content.cloneNode(true));
      target.closest('[data-inspect-chart]')!.setAttribute('aria-describedby', figure.id + '-help ' + tooltip.id);
      if (announce) announcement.textContent = tooltip.innerText;
    }
    tooltip.hidden = false;
    const { width, height } = tooltip.getBoundingClientRect();
    const left = clientX + width + 16 <= innerWidth - 12 ? clientX + 16 : clientX - width - 16;
    const top = clientY + height + 16 <= innerHeight - 12 ? clientY + 16 : clientY - height - 16;
    tooltip.style.left = Math.max(12, Math.min(left, innerWidth - width - 12)) + 'px';
    tooltip.style.top = Math.max(12, Math.min(top, innerHeight - height - 12)) + 'px';
  }

  for (const chart of charts) {
    const targets = [...chart.querySelectorAll<SVGGElement | HTMLTableCellElement>('[data-inspect-target]')];
    function inspect(event: PointerEvent) {
      if (!(event.target as Element).closest('[data-inspect-hit]')) {
        dismiss();
        return;
      }
      if (chart instanceof HTMLTableElement) {
        show((event.target as Element).closest<HTMLTableCellElement>('[data-inspect-target]')!, event.clientX, event.clientY, false);
        return;
      }
      const matrix = chart.getScreenCTM()!;
      const positions = targets.map(target => new DOMPoint(Number(target.dataset.x), Number(target.dataset.y)).matrixTransform(matrix));
      const distances = positions.map(point => Math.abs(point.x - event.clientX));
      const nearest = distances.indexOf(Math.min(...distances));
      show(targets[nearest], event.clientX, event.clientY, false);
    }
    function focusReading(index: number) {
      const target = targets[index];
      if (chart instanceof SVGSVGElement) {
        const point = new DOMPoint(Number(target.dataset.x), Number(target.dataset.y)).matrixTransform(chart.getScreenCTM()!);
        show(target, point.x, point.y, true);
      } else {
        const scroller = chart.parentElement!;
        const view = scroller.getBoundingClientRect();
        const cell = target.getBoundingClientRect();
        const visibleLeft = view.left + chart.rows[0].cells[0].getBoundingClientRect().width;
        if (cell.left < visibleLeft) scroller.scrollLeft += cell.left - visibleLeft;
        else if (cell.right > view.right) scroller.scrollLeft += cell.right - view.right;
        const bounds = target.getBoundingClientRect();
        show(target, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, true);
      }
    }
    chart.addEventListener('pointermove', event => {
      const pointer = event as PointerEvent;
      if (pointer.pointerType !== 'touch') inspect(pointer);
    });
    chart.addEventListener('pointerdown', event => inspect(event as PointerEvent));
    chart.addEventListener('pointercancel', dismiss);
    chart.addEventListener('pointerleave', event => {
      if ((event as PointerEvent).pointerType !== 'touch' && active?.closest('[data-inspect-chart]') === chart) dismiss();
    });
    chart.addEventListener('focus', () => {
      // Native keyboard focus may scroll the page before the first readout is positioned.
      requestAnimationFrame(() => {
        if (document.activeElement === chart && chart.matches(':focus-visible')) focusReading(0);
      });
    });
    chart.addEventListener('blur', () => {
      if (active?.closest('[data-inspect-chart]') === chart) dismiss();
    });
    chart.addEventListener('keydown', event => {
      const { key } = event as KeyboardEvent;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return;
      event.preventDefault();
      const current = active?.closest('[data-inspect-chart]') === chart ? targets.indexOf(active) : 0;
      if (chart instanceof HTMLTableElement) {
        const columns = chart.rows[0].cells.length - 1;
        const row = Math.floor(current / columns);
        const column = current % columns;
        const rowStep = key === 'ArrowUp' ? -1 : key === 'ArrowDown' ? 1 : 0;
        const columnStep = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : 0;
        focusReading(Math.max(0, Math.min(targets.length / columns - 1, row + rowStep)) * columns + Math.max(0, Math.min(columns - 1, column + columnStep)));
        return;
      }
      const step = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1;
      focusReading(Math.max(0, Math.min(targets.length - 1, current + step)));
    });
  }
  document.addEventListener('pointerdown', event => {
    if (!(event.target as Element).closest('#' + figure.id + ' [data-inspect-chart]')) dismiss();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') dismiss(); });
  window.addEventListener('scroll', dismiss, { passive: true });
  window.addEventListener('resize', dismiss);
}
