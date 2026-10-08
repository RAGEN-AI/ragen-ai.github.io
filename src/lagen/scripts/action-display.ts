export interface ActionSamples {
  initial: number[];
  samples: number[][];
}

const positions: Record<string, number[][]> = {
  ant: [[145,79],[178,103],[75,41],[42,17],[145,41],[178,17],[75,79],[42,103]],
  hopper: [[110,27],[92,65],[115,99]],
  walker2d: [[148,28],[146,64],[131,102],[72,28],[77,64],[89,102]],
};
const skeletons: Record<string, string> = {
  ant: '<ellipse cx="110" cy="60" rx="27" ry="17"/><path d="M90 48 75 41 42 17M130 48 145 41 178 17M90 72 75 79 42 103M130 72 145 79 178 103M110 43V28"/>',
  hopper: '<path d="M116 7 110 27 92 65 115 99 147 105"/>',
  walker2d: '<path d="M110 5V28M110 28 148 28 146 64 131 102 155 105M110 28 72 28 77 64 89 102 66 105"/>',
};
const bodyPaths = [
  'M102 61 88 82 81 110', 'M118 61 132 82 139 110',
  'M101 29H119L121 61H99Z',
  'M101 32 77 46 58 70', 'M119 32 143 46 162 70',
  'M58 70 50 80', 'M162 70 170 80',
];

export function createActionDisplay(kind: string, controls: { id: string; label: string }[]): HTMLElement {
  const panel = document.createElement('div');
  panel.className = 'action-view';
  if (kind === 'keys') {
    panel.classList.add('action-keys');
    for (const control of controls) {
      const key = document.createElement('span');
      key.dataset.key = control.id;
      key.textContent = control.label;
      key.className = 'action-key';
      panel.append(key);
    }
    return panel;
  }
  let drawing: string;
  if (kind === 'balance') {
    drawing = '<g class="body-outline"><circle cx="110" cy="14" r="9"/>' + bodyPaths.map(path => '<path d="'+path+'"/>').join('') + '</g>' + bodyPaths.map((path, i) => '<path class="body-update" data-value="'+i+'" d="'+path+'"/>').join('');
  } else if (kind === 'mikasa') {
    drawing = '<g class="body-outline"><path d="M45 61 17 77M45 61 73 77M45 61V25"/><circle cx="114" cy="59" r="23"/><path d="M176 24H196M186 24V45"/></g>' +
      [0,1,2].map(i=>'<path class="move-command" data-value="'+i+'" d="M45 61h0"/>').join('') +
      [3,4,5].map(i=>'<path class="rotate-command" data-value="'+i+'" d="M114 59h0"/>').join('') +
      '<path class="grip-command" data-value="6" d="M176 45V83M196 45V83"/>';
  } else {
    drawing = '<g class="body-outline">'+skeletons[kind]+'</g>' + positions[kind].map(([x,y],i)=>'<g><path class="command-axis" d="M'+(x-18)+' '+y+'h36"/><path class="command-zero" d="M'+x+' '+(y-5)+'v10"/><rect class="joint-command" data-value="'+i+'" data-x="'+x+'" x="'+x+'" y="'+(y-3)+'" width="0" height="6" rx="2"/></g>').join('');
  }
  panel.innerHTML = '<svg viewBox="0 0 220 120" role="img" aria-label="'+kind+' control commands">'+drawing+'</svg>';
  return panel;
}

export function updateActionDisplay(panel: HTMLElement, kind: string, values: number[]) {
  if (kind === 'balance') {
    panel.querySelectorAll<SVGPathElement>('[data-value]').forEach((path,i) => {
      path.style.opacity = values[i].toString();
      path.style.strokeWidth = (3 + values[i] * 8).toString();
    });
    return;
  }
  if (kind === 'mikasa') {
    const directions = [[28,16],[-28,16],[0,-36]];
    panel.querySelectorAll<SVGPathElement>('.move-command').forEach((path,i) => {
      const [dx,dy]=directions[i]; const x=45+dx*values[i], y=61+dy*values[i];
      const angle=Math.atan2(dy*values[i],dx*values[i]);
      const arrow=Math.abs(values[i])*7;
      path.setAttribute('d','M45 61L'+x+' '+y+'M'+(x-arrow*Math.cos(angle-.6))+' '+(y-arrow*Math.sin(angle-.6))+'L'+x+' '+y+'L'+(x-arrow*Math.cos(angle+.6))+' '+(y-arrow*Math.sin(angle+.6)));
      path.style.stroke=values[i]<0?'var(--rose)':'var(--blue)';
    });
    panel.querySelectorAll<SVGPathElement>('.rotate-command').forEach((path,i) => {
      const start=i*Math.PI*2/3, end=start+values[i+3]*Math.PI/2;
      const r=15+i*5;
      const x=114+r*Math.cos(end), y=59+r*Math.sin(end);
      const tangent=end+(values[i+3]>=0?1:-1)*Math.PI/2, tip=5*Math.abs(values[i+3]);
      path.setAttribute('d','M'+(114+r*Math.cos(start))+' '+(59+r*Math.sin(start))+'A'+r+' '+r+' 0 0 '+(values[i+3]>=0?1:0)+' '+x+' '+y+'M'+(x-tip*Math.cos(tangent-.6))+' '+(y-tip*Math.sin(tangent-.6))+'L'+x+' '+y+'L'+(x-tip*Math.cos(tangent+.6))+' '+(y-tip*Math.sin(tangent+.6)));
      path.style.stroke=values[i+3]<0?'var(--rose)':'var(--blue)';
    });
    const gap=7+(values[6]+1)*11;
    panel.querySelector('.grip-command')!.setAttribute('d','M'+(186-gap)+' 46V80h7M'+(186+gap)+' 46V80h-7');
    return;
  }
  panel.querySelectorAll<SVGRectElement>('.joint-command').forEach((bar,i) => {
    const width=Math.abs(values[i])*18;
    bar.setAttribute('x',(Number(bar.dataset.x)+(values[i]<0?-width:0)).toString());
    bar.setAttribute('width',width.toString());
    bar.style.fill=values[i]<0?'var(--rose)':'var(--blue)';
  });
}
