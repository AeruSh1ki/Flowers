const opening = document.querySelector('#opening');
const envelope = document.querySelector('#envelope');
const garden = document.querySelector('#garden');
const loveSong = document.querySelector('#loveSong');
const bouquet = document.querySelector('#bouquet');
const showBouquet = document.querySelector('#showBouquet');
const readLetter = document.querySelector('#readLetter');
const letterSection = document.querySelector('#letter');
let started = false;
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const GOLDEN_ANGLE = (2 * Math.PI) / (GOLDEN_RATIO * GOLDEN_RATIO);

const flowerPhotos = [
  { file: 'blue-blossom-optimized.png', className: 'photo-blue-camellia' },
  { file: 'blue-lily-optimized.png', className: 'photo-blue-lily' },
  { file: 'blush-lily-optimized.png', className: 'photo-blush-lily' },
  { file: 'ivory-camellia-optimized.png', className: 'photo-ivory' },
  { file: 'blue-camellia-optimized.png', className: 'photo-blue-camellia' },
  { file: 'white-hibiscus-optimized.png', className: 'photo-white-hibiscus' },
  { file: 'white-peony-optimized.png', className: 'photo-white-peony' },
];

function flowerMarkup(flower) {
  return `<span class="flower ${flower.className}"><img src="assets/${flower.file}" alt="" draggable="false"></span>`;
}

function bloomGarden() {
  if (started) return;
  started = true;
  opening.classList.add('has-bloom');
  envelope.classList.add('open');
  loveSong.play().catch(() => {});
  document.querySelector('#hint').style.opacity = '0';

  const count = Math.min(64, Math.max(38, Math.round(innerWidth * innerHeight / 14500)));
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const progress = (i + 1) / count;
    const radius = Math.sqrt(progress);
    const angle = i * GOLDEN_ANGLE - Math.PI / 2;
    const size = (innerWidth < 600 ? 86 : 128) + Math.random() * (innerWidth < 600 ? 56 : 96);
    const reachX = innerWidth / 2 + size * 0.42;
    const reachY = innerHeight / 2 + size * 0.42;
    const x = Math.cos(angle) * radius * reachX;
    const y = Math.sin(angle) * radius * reachY;
    const pointOnSpiral = (fraction) => {
      const spiralAngle = angle - (1 - fraction) * Math.PI * 4;
      const spiralRadius = radius * fraction;
      return [
        Math.cos(spiralAngle) * spiralRadius * reachX,
        Math.sin(spiralAngle) * spiralRadius * reachY,
      ];
    };
    const [x1, y1] = pointOnSpiral(0.14);
    const [x2, y2] = pointOnSpiral(0.4);
    const [x3, y3] = pointOnSpiral(0.72);
    const delay = 0.08 + radius * 4.15 + Math.random() * 0.22;
    const rot = Math.random() * 70 - 35;
    const lift = (8 + Math.random() * 22) * (Math.random() < 0.5 ? -1 : 1);
    const flower = flowerPhotos[Math.floor(Math.random() * flowerPhotos.length)];
    const wrapper = document.createElement('span');
    wrapper.innerHTML = flowerMarkup(flower);
    const element = wrapper.firstElementChild;
    element.style.cssText += `;--size:${size}px;--delay:${delay}s;--x:${x}px;--y:${y}px;--x1:${x1}px;--y1:${y1}px;--x2:${x2}px;--y2:${y2}px;--x3:${x3}px;--y3:${y3}px;--rot:${rot}deg;--lift:${lift}px`;
    fragment.append(element);
  }
  garden.replaceChildren(fragment);

  window.setTimeout(() => {
    opening.classList.add('bloom-filled');
    window.setTimeout(() => {
      opening.classList.add('blooms-fading');
      window.setTimeout(() => {
        opening.classList.add('bloom-complete');
        showBouquet.focus({ preventScroll: true });
      }, 2200);
    }, 3000);
  }, 7200);
}

envelope.addEventListener('click', bloomGarden);
envelope.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    bloomGarden();
  }
});

showBouquet.addEventListener('click', () => {
  opening.classList.add('bouquet-revealed');
  bouquet.setAttribute('aria-hidden', 'false');
  showBouquet.hidden = true;
  readLetter.hidden = false;
  readLetter.focus({ preventScroll: true });
});

readLetter.addEventListener('click', () => {
  letterSection.classList.add('is-unlocked');
  letterSection.setAttribute('aria-hidden', 'false');
  letterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
