// Every public LAGEN link lives here, so the page, the BibTeX, and the README stay the same.
// When the paper is on arXiv, set ARXIV_ID (for example '2610.01234'). All paper links then
// point to the unversioned abstract page, which always shows the latest version.
export const ARXIV_ID = '';

export const SITE = 'https://ragen-ai.github.io/lagen/';
const HOSTED_PAPER = '/lagen/assets/paper.pdf';

export const links = {
  paper: ARXIV_ID ? `https://arxiv.org/abs/${ARXIV_ID}` : HOSTED_PAPER,
  code: 'https://github.com/mll-lab-nu/latency-aware-agents',
  models: 'https://huggingface.co/MLL-Lab/LAGEN-models',
  data: 'https://huggingface.co/datasets/MLL-Lab/LAGEN-datasets',
  profiles: 'https://huggingface.co/datasets/MLL-Lab/LAGEN-profiles',
  video: '#video',
};

export const videoFile = '/lagen/assets/video/lagen.mp4';
export const videoPoster = '/lagen/assets/video/poster.jpg';

const arxivFields = ARXIV_ID ? `,\n  eprint={${ARXIV_ID}},\n  archivePrefix={arXiv}` : '';
export const bibtex = `@misc{chafekar2026lagen,
  title={LAGEN: Are Vision-Language Agents Latency Aware?},
  author={Talha Chafekar and Zihan Wang and Zeju Li and Xinyuan Li and Qineng Wang and Jiajun Wu and Yuke Zhu and Yi Dong and Zhiding Yu and Ruohan Zhang and Manling Li},
  year={2026},
  url={${SITE}}${arxivFields}
}`;
