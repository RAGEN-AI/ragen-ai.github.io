import panels from '../data/degradation.json';

const figure = document.querySelector<HTMLElement>('.degradation-figure')!;
const charts = [...figure.querySelectorAll<SVGSVGElement>('.degradation-chart')];
const tooltip = figure.querySelector<HTMLElement>('.degradation-tooltip')!;
const heading = tooltip.querySelector<HTMLElement>('.tooltip-heading')!;
const metric = tooltip.querySelector<HTMLElement>('.tooltip-metric')!;
const values = tooltip.querySelector<HTMLElement>('.tooltip-values')!;
const announcement = figure.querySelector<HTMLElement>('[data-chart-announcement]')!;
const legendMarkers = [...figure.querySelectorAll<SVGSVGElement>('.degradation-legend svg')].slice(0, 3);
let selected: { panel: number; column: number } | null = null;

function clearSelection() {
  for (const chart of charts) {
    chart.querySelectorAll('.column-guide, .point-highlight').forEach(element => element.setAttribute('hidden', ''));
    chart.setAttribute('aria-describedby', 'degradation-help');
  }
}

function dismiss() {
  selected = null;
  tooltip.hidden = true;
  announcement.textContent = '';
  clearSelection();
}

function positionTooltip(clientX: number, clientY: number) {
  const { width, height } = tooltip.getBoundingClientRect();
  const left = clientX + 16 + width <= window.innerWidth - 12 ? clientX + 16 : clientX - width - 16;
  const top = clientY + 16 + height <= window.innerHeight - 12 ? clientY + 16 : clientY - height - 16;
  tooltip.style.left = Math.max(12, Math.min(left, window.innerWidth - width - 12)) + 'px';
  tooltip.style.top = Math.max(12, Math.min(top, window.innerHeight - height - 12)) + 'px';
}

function selectColumn(panelIndex: number, column: number, clientX: number, clientY: number, announce: boolean) {
  for (const other of document.querySelectorAll<HTMLElement>('[role="tooltip"]')) {
    if (other !== tooltip) other.hidden = true;
  }
  const panel = panels[panelIndex];
  const latency = panel.latencies[column];
  if (selected?.panel !== panelIndex || selected.column !== column) {
    selected = { panel: panelIndex, column };
    clearSelection();
    const chart = charts[panelIndex];
    const mikasa = panel.inset === null;
    heading.textContent = `${panel.title} · ${latency} ${latency === 1 ? 'frame' : 'frames'}`;
    metric.textContent = mikasa ? 'Success rate (%)' : 'Mean return';
    values.replaceChildren();
    // Group the six InterceptGrabFast readings by action mode, preserving model order in each group.
    for (const horizon of mikasa ? [1, 8] : [null]) {
      if (horizon !== null) {
        const groupHeading = document.createElement('div');
        groupHeading.className = 'value-heading';
        groupHeading.textContent = horizon === 1 ? 'Single action' : 'Action chunk (horizon 8)';
        values.append(groupHeading);
      }
      panel.series.filter(series => series.horizon === horizon).forEach((series, modelIndex) => {
        const row = document.createElement('div');
        row.className = 'value-row';
        const marker = legendMarkers[modelIndex].cloneNode(true) as SVGSVGElement;
        if (horizon === 8) {
          const path = marker.querySelector('path')!;
          path.setAttribute('stroke', path.getAttribute('fill')!);
          path.setAttribute('stroke-width', '1.5');
          path.setAttribute('fill', 'white');
        }
        const label = document.createElement('span');
        label.textContent = series.model;
        const value = document.createElement('span');
        value.className = 'numeric-value';
        value.textContent = series.values[column] + (mikasa ? '%' : '');
        row.append(marker, label, value);
        values.append(row);
      });
    }
    for (const view of chart.querySelectorAll<SVGGElement>('.plot-view')) {
      const viewLatencies = view.dataset.view === '0' ? panel.latencies : panel.inset!.latencies;
      if (!viewLatencies.includes(latency)) continue;
      const x = Number(view.dataset.left) + (latency - Number(view.dataset.xMin)) / (Number(view.dataset.xMax) - Number(view.dataset.xMin)) * Number(view.dataset.width);
      const line = view.querySelector<SVGLineElement>('.column-guide')!;
      line.setAttribute('x1', x.toString());
      line.setAttribute('x2', x.toString());
      line.removeAttribute('hidden');
      view.querySelectorAll(`[data-latency="${latency}"]`).forEach(point => point.removeAttribute('hidden'));
    }
    chart.setAttribute('aria-describedby', 'degradation-help degradation-tooltip');
    if (announce) announcement.textContent = heading.textContent + '. ' + metric.textContent + '. ' + values.innerText;
  }
  tooltip.hidden = false;
  positionTooltip(clientX, clientY);
}

function inspectPointer(event: PointerEvent, panelIndex: number) {
  const hit = (event.target as Element).closest<SVGRectElement>('.plot-hit-area');
  if (!hit) {
    dismiss();
    return;
  }
  const view = hit.parentElement!;
  const panel = panels[panelIndex];
  const latencies = view.dataset.view === '0' ? panel.latencies : panel.inset!.latencies;
  const bounds = hit.getBoundingClientRect();
  const xMin = Number(view.dataset.xMin);
  const xMax = Number(view.dataset.xMax);
  const value = xMin + (event.clientX - bounds.left) / bounds.width * (xMax - xMin);
  const nearest = latencies.reduce((a, b) => Math.abs(value - a) <= Math.abs(value - b) ? a : b);
  selectColumn(panelIndex, panel.latencies.indexOf(nearest), event.clientX, event.clientY, false);
}

function inspectKeyboard(panelIndex: number, column: number) {
  const chart = charts[panelIndex];
  const view = chart.querySelector<SVGGElement>('.plot-view')!;
  const hit = view.querySelector('.plot-hit-area')!.getBoundingClientRect();
  const latency = panels[panelIndex].latencies[column];
  const fraction = (latency - Number(view.dataset.xMin)) / (Number(view.dataset.xMax) - Number(view.dataset.xMin));
  selectColumn(panelIndex, column, hit.left + fraction * hit.width, hit.bottom, true);
}

charts.forEach((chart, panelIndex) => {
  chart.addEventListener('pointermove', event => {
    if (event.pointerType !== 'touch') inspectPointer(event, panelIndex);
  });
  chart.addEventListener('pointerdown', event => inspectPointer(event, panelIndex));
  chart.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'touch' && selected?.panel === panelIndex) dismiss();
  });
  chart.addEventListener('focus', () => {
    if (chart.matches(':focus-visible')) inspectKeyboard(panelIndex, 0);
  });
  chart.addEventListener('blur', () => {
    if (selected?.panel === panelIndex) dismiss();
  });
  chart.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const current = selected?.panel === panelIndex ? selected.column : 0;
    const column = Math.max(0, Math.min(panels[panelIndex].latencies.length - 1, current + (event.key === 'ArrowRight' ? 1 : -1)));
    inspectKeyboard(panelIndex, column);
  });
});
document.addEventListener('pointerdown', event => {
  if (!(event.target as Element).closest('.degradation-chart')) dismiss();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') dismiss();
});
window.addEventListener('scroll', dismiss, { passive: true });
window.addEventListener('resize', dismiss);
