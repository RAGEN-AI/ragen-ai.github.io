import './demo';

const copy = document.querySelector<HTMLButtonElement>('#copy-citation')!;
copy.addEventListener('click', async () => {
  await navigator.clipboard.writeText(document.querySelector('#citation-text')!.textContent!);
  copy.textContent = 'Copied';
  setTimeout(() => { copy.textContent = 'Copy BibTeX'; }, 1800);
});
