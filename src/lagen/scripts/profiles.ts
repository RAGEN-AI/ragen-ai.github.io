import metadata from '../data/profiles.json';
import palette from '../data/paper-palette.json';

const figure = document.querySelector<HTMLElement>('#profiles-figure')!;
const canvases = [...figure.querySelectorAll<HTMLCanvasElement>('canvas')];
const colors = [palette.gray, palette.gray, palette.rose, palette.blue, palette.purple];
type Sequences = { indices: number[]; workers: number[]; series: number[][] };

// Load this large, frozen snapshot only when the figure approaches the viewport.
const observer = new IntersectionObserver(async entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  observer.disconnect();
  const response = await fetch(figure.dataset.source!);
  const data: Sequences = await response.json();
  const baseLayers = canvases.map(() => document.createElement('canvas'));

  function points(context: CanvasRenderingContext2D, column: number, selected: number | null) {
    const values = data.series[column];
    const width = context.canvas.width;
    const height = context.canvas.height;
    const radius = Math.max(1, devicePixelRatio * .65);
    context.fillStyle = colors[column];
    context.globalAlpha = selected === null ? .35 : .85;
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (selected !== null && (value < metadata.edges[selected] || value >= metadata.edges[selected + 1])) continue;
      const x = (data.indices[i] + 300) / (metadata.count - 1 + 600) * width;
      const y = (100 - value) / 55 * height;
      if (data.workers[i] === 1) context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      else { context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill(); }
    }
  }

  function draw() {
    const selection = figure.dataset.selection;
    const bin = selection?.startsWith('bin:') ? Number(selection.slice(4)) : null;
    const method = selection?.startsWith('method:') ? Number(selection.slice(7)) : null;
    canvases.forEach((canvas, column) => {
      const context = canvas.getContext('2d')!;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = bin !== null || (method !== null && column !== 0 && column !== method) ? .18 : 1;
      context.drawImage(baseLayers[column], 0, 0);
      if (bin !== null) points(context, column, bin);
    });
  }

  function resize() {
    canvases.forEach((canvas, column) => {
      const bounds = canvas.getBoundingClientRect();
      canvas.width = Math.round(bounds.width * devicePixelRatio);
      canvas.height = Math.round(bounds.height * devicePixelRatio);
      const layer = baseLayers[column];
      layer.width = canvas.width;
      layer.height = canvas.height;
      points(layer.getContext('2d')!, column, null);
    });
    draw();
  }
  let frame = 0;
  figure.addEventListener('figure-selection', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(draw);
  });
  new ResizeObserver(resize).observe(figure.querySelector('.profiles-panels')!);
}, { rootMargin: '600px' });
observer.observe(figure);

figure.addEventListener('figure-selection', () => {
  const selection = figure.dataset.selection;
  const method = selection?.startsWith('method:') ? Number(selection.slice(7)) : null;
  const bin = selection?.startsWith('bin:') ? Number(selection.slice(4)) : null;
  for (const target of figure.querySelectorAll<HTMLElement>('[data-choice]')) target.classList.toggle('is-active', target.dataset.choice === selection);
  for (const panel of figure.querySelectorAll<HTMLElement>('[data-profile-column]')) {
    const column = Number(panel.dataset.profileColumn);
    panel.querySelector('.profile-bars')!.classList.toggle('linked-muted', method !== null && column !== method && column !== 0);
    for (const bar of panel.querySelectorAll<SVGRectElement>('[data-bin-bar]')) {
      bar.classList.toggle('linked-muted', bin !== null && Number(bar.dataset.binBar) !== bin);
    }
  }
});
