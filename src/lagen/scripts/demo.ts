import demos from '../data/demos.json';
import { createActionDisplay, updateActionDisplay, type ActionSamples } from './action-display';

const asset = (path: string) => '/lagen/' + 'assets/' + path;
const root = document.querySelector<HTMLElement>('[data-demo]')!;
const stage = root.querySelector<HTMLElement>('.demo-stage')!;
const slider = root.querySelector<HTMLInputElement>('#demo-delay')!;
const title = root.querySelector<HTMLElement>('#demo-task')!;
const delayValue = root.querySelector<HTMLOutputElement>('#demo-delay-value')!;
const rightLabel = root.querySelector<HTMLElement>('#demo-right-label')!;
const pause = root.querySelector<HTMLButtonElement>('#demo-pause')!;
const thumbs = [...root.querySelectorAll<HTMLButtonElement>('[data-task-index]')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const actionCache = new Map<string, Promise<ActionSamples>>();
const slots = [...root.querySelectorAll<HTMLElement>('.demo-slide')].map(element => ({
  element,
  video: element.querySelector<HTMLVideoElement>('video')!,
  docks: element.querySelector<HTMLElement>('.demo-action-docks')!,
  caption: element.querySelector<HTMLElement>('.action-caption')!,
  play: element.querySelector<HTMLButtonElement>('.demo-play')!,
  select: element.querySelector<HTMLButtonElement>('.demo-side-select')!,
  index: 0,
  samples: null as ActionSamples | null,
  abort: new AbortController(),
}));
type Slot = typeof slots[number];
let current = slots[1];
let selected = 0;
let requested = 0;
let variantIndex = 0;
let transitioning = false;
let inView = false;
let userPaused = reducedMotion.matches;
let animationFrame = 0;
const wrap = (index: number) => (index + demos.length) % demos.length;
const defaultVariant = (index: number) => demos[index].variants.findIndex(v => v.latencyRawFrames === demos[index].defaultLatency);

function syncActions() {
  const demo = demos[selected];
  const variant = demo.variants[variantIndex];
  const frame = Math.min(Math.floor(current.video.currentTime * demo.envFps), demo.clipFrames - 1);
  [...current.docks.children].forEach((element, lane) => {
    const failed = variant.failureFrames[lane];
    const stopped = failed === null ? frame : Math.min(frame, failed);
    // Requests are indexed by issue time; each lane shows the command delivered now.
    const applied = stopped - lane * variant.latencyRawFrames;
    const panel = element as HTMLElement;
    if (demo.actionKind === 'keys') {
      const request = demo.requests.findLast(event => event.tick <= applied);
      panel.querySelectorAll<HTMLElement>('[data-key]').forEach(key => {
        key.classList.toggle('pressed', request !== undefined && request.keys.includes(key.dataset.key!));
      });
    } else {
      const data = current.samples!;
      updateActionDisplay(panel, demo.actionKind, applied < 0 ? data.initial : data.samples[applied]);
    }
  });
}
function animateActions() { syncActions(); animationFrame = requestAnimationFrame(animateActions); }
function stop() { current.video.pause(); cancelAnimationFrame(animationFrame); }
function playbackLabel() {
  pause.querySelector('.playback-icon path')!.setAttribute('d', userPaused ? 'M3 2l14 8-14 8z' : 'M3 2h5v16H3zM12 2h5v16h-5z');
  pause.querySelector('.playback-label')!.textContent = userPaused ? 'Play' : 'Pause';
  pause.setAttribute('aria-label', userPaused ? 'Play demonstration' : 'Pause demonstration');
}
async function resume() {
  if (!inView || userPaused || document.hidden || transitioning) return;
  const slot = current;
  try { await slot.video.play(); slot.play.hidden = true; }
  catch (error) {
    if ((error as DOMException).name === 'NotAllowedError') slot.play.hidden = false;
    else if ((error as DOMException).name !== 'AbortError') throw error;
  }
}
function setSide(slot: Slot, index: number) {
  slot.abort.abort(); slot.index = wrap(index); slot.video.pause();
  slot.video.removeAttribute('src'); slot.video.load();
  slot.video.poster = asset(demos[slot.index].poster);
  slot.video.preload = 'none'; slot.play.hidden = true;
  slot.select.setAttribute('aria-label', 'Show ' + demos[slot.index].title);
}
async function prepare(slot: Slot, index: number, variant: number): Promise<boolean> {
  slot.abort.abort(); slot.abort = new AbortController();
  const signal = slot.abort.signal;
  const demo = demos[index];
  let data: ActionSamples | null = null;
  if (demo.actionKind !== 'keys') {
    if (!actionCache.has(demo.id)) actionCache.set(demo.id, fetch(asset(demo.actionFile!)).then(response => response.json()));
    data = await actionCache.get(demo.id)!;
  }
  if (signal.aborted) return false;
  slot.index = index; slot.samples = data;
  slot.docks.replaceChildren();
  for (const lane of [0, 1]) {
    const panel = createActionDisplay(demo.actionKind, demo.controls);
    panel.classList.add(demo.id); panel.dataset.lane = lane.toString();
    slot.docks.append(panel);
    if (data !== null) updateActionDisplay(panel, demo.actionKind, data.initial);
  }
  slot.caption.textContent = demo.actionLabel;
  slot.video.pause(); slot.video.poster = asset(demo.poster); slot.video.preload = 'auto';
  slot.video.setAttribute('aria-label', demo.title + ': immediate versus delayed recorded actions');
  const ready = new Promise<boolean>((resolve, reject) => {
    slot.video.addEventListener('loadeddata', () => resolve(true), {once: true, signal});
    slot.video.addEventListener('error', () => reject(slot.video.error), {once: true, signal});
    signal.addEventListener('abort', () => resolve(false), {once: true});
  });
  slot.video.src = asset(demo.variants[variant].video); slot.video.load();
  return await ready && !signal.aborted;
}
function updateControls() {
  const demo = demos[selected];
  const delay = demo.variants[variantIndex].latencyRawFrames;
  const ms = Math.round(delay * 1000 / demo.envFps);
  title.textContent = demo.title;
  delayValue.textContent = ms + ' ms · ' + delay + (delay === 1 ? ' frame' : ' frames');
  rightLabel.textContent = delay === 0 ? 'No delay' : ms + ' ms delay';
  slider.max = (demo.variants.length - 1).toString(); slider.value = variantIndex.toString();
  thumbs.forEach((thumb, index) => {
    thumb.classList.toggle('selected', index === selected);
    thumb.setAttribute('aria-pressed', (index === selected).toString());
  });
  const strip = thumbs[selected].parentElement!;
  strip.scrollTo({left: thumbs[selected].offsetLeft - strip.offsetLeft - (strip.clientWidth - thumbs[selected].clientWidth) / 2, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  slots.forEach(slot => {
    slot.video.id = slot === current ? 'demo-video' : '';
    slot.select.tabIndex = slot === current ? -1 : 0;
    slot.select.setAttribute('aria-label', 'Show ' + demos[slot.index].title);
  });
  syncActions();
}
async function requestTask(index: number) {
  requested = wrap(index);
  if (transitioning || requested === selected) return;
  transitioning = true; slider.disabled = true; stop();
  const target = requested;
  const forward = (target - selected + demos.length) % demos.length;
  const direction = forward <= demos.length / 2 ? 1 : -1;
  const side = direction === 1 ? 'right' : 'left';
  const opposite = direction === 1 ? 'left' : 'right';
  const incoming = slots.find(slot => slot.element.dataset.position === side)!;
  const recycled = slots.find(slot => slot.element.dataset.position === opposite)!;
  const nextVariant = defaultVariant(target);
  await prepare(incoming, target, nextVariant);
  recycled.element.classList.add('is-recycled');
  setSide(recycled, target + direction);
  recycled.element.dataset.position = side;
  current.element.dataset.position = opposite;
  incoming.element.dataset.position = 'center';
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => { recycled.element.classList.remove('is-recycled'); resolve(); })));
  // Manual navigation keeps the slide transition even when autoplay starts paused.
  await new Promise(resolve => setTimeout(resolve, 460));
  selected = target; variantIndex = nextVariant; current = incoming;
  // A non-adjacent thumbnail jump also needs the actual opposite neighbor.
  const otherSide = slots.find(slot => slot.element.dataset.position === opposite)!;
  if (otherSide.index !== wrap(target - direction)) setSide(otherSide, target - direction);
  transitioning = false; slider.disabled = false;
  updateControls();
  if (requested !== selected) void requestTask(requested); else void resume();
}
async function loadDelay(index: number) {
  stop();
  const slot = current;
  const ready = await prepare(slot, selected, index);
  if (!ready || transitioning || slot !== current) return;
  variantIndex = index; updateControls(); void resume();
}
slots.forEach(slot => {
  slot.video.addEventListener('playing', () => {
    if (slot !== current) { slot.video.pause(); return; }
    cancelAnimationFrame(animationFrame); animateActions();
  });
  slot.video.addEventListener('pause', () => { if (slot === current) cancelAnimationFrame(animationFrame); });
  slot.video.addEventListener('seeked', () => { if (slot === current) syncActions(); });
  slot.select.addEventListener('click', () => void requestTask(slot.index));
  slot.play.addEventListener('click', () => { userPaused = false; playbackLabel(); void resume(); });
});
root.querySelector('#demo-prev')!.addEventListener('click', () => void requestTask(requested - 1));
root.querySelector('#demo-next')!.addEventListener('click', () => void requestTask(requested + 1));
thumbs.forEach((thumb,index) => thumb.addEventListener('click', () => void requestTask(index)));
slider.addEventListener('input', () => void loadDelay(slider.valueAsNumber));
root.addEventListener('keydown', event => {
  if (event.target === slider) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); const target = wrap(requested + (event.key === 'ArrowLeft' ? -1 : 1));
    void requestTask(target); thumbs[target].focus({preventScroll: true});
  }
});
pause.addEventListener('click', () => {
  userPaused = !userPaused; playbackLabel();
  if (userPaused) stop(); else void resume();
});
new IntersectionObserver(entries => {
  inView = entries[0].isIntersecting;
  if (inView) void resume(); else stop();
}, {threshold: 0.15}).observe(stage);
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else void resume(); });
reducedMotion.addEventListener('change', () => {
  userPaused = reducedMotion.matches; playbackLabel();
  if (userPaused) stop(); else void resume();
});
setSide(slots[0], demos.length - 1); setSide(slots[2], 1);
variantIndex = defaultVariant(0); playbackLabel();
void prepare(current, 0, variantIndex).then(() => { updateControls(); void resume(); });
