const opening = document.querySelector('#opening');
const envelope = document.querySelector('#envelope');
const garden = document.querySelector('#garden');
const loveSong = document.querySelector('#loveSong');
const bouquet = document.querySelector('#bouquet');
const showBouquet = document.querySelector('#showBouquet');
const readLetter = document.querySelector('#readLetter');
const letterSection = document.querySelector('#letter');
let started = false;
const flowerNodes = [];
let resizeFrame = 0;
let bloomStartedAt = 0;
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

function targetFlowerCount(width, height) {
  return Math.min(64, Math.max(38, Math.round(width * height / 14500)));
}

function createFlowerNode() {
  const flower = flowerPhotos[Math.floor(Math.random() * flowerPhotos.length)];
  const wrapper = document.createElement('span');
  wrapper.innerHTML = flowerMarkup(flower);
  const element = wrapper.firstElementChild;
  const node = {
    element,
    sizeFactor: Math.random(),
  };

  element.style.setProperty('--delay', `${0.08 + Math.random() * 0.22}s`);
  element.style.setProperty('--rot', `${Math.random() * 70 - 35}deg`);
  element.style.setProperty('--lift', `${(8 + Math.random() * 22) * (Math.random() < 0.5 ? -1 : 1)}px`);
  return node;
}

function layoutFlower(node, index, count, width, height) {
  const progress = (index + 1) / count;
  const radius = Math.sqrt(progress);
  const angle = index * GOLDEN_ANGLE - Math.PI / 2;
  const mobile = width < 600;
  const size = (mobile ? 86 : 128) + node.sizeFactor * (mobile ? 56 : 96);
  const reachX = width / 2 + size * 0.42;
  const reachY = height / 2 + size * 0.42;
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
  const x = Math.cos(angle) * radius * reachX;
  const y = Math.sin(angle) * radius * reachY;
  const style = node.element.style;

  style.setProperty('--size', `${size}px`);
  style.setProperty('--x', `${x}px`);
  style.setProperty('--y', `${y}px`);
  style.setProperty('--x1', `${x1}px`);
  style.setProperty('--y1', `${y1}px`);
  style.setProperty('--x2', `${x2}px`);
  style.setProperty('--y2', `${y2}px`);
  style.setProperty('--x3', `${x3}px`);
  style.setProperty('--y3', `${y3}px`);
}

function resizeGarden() {
  if (!started || flowerNodes.length === 0) return;

  const width = opening.clientWidth;
  const height = opening.clientHeight;
  const count = targetFlowerCount(width, height);

  while (flowerNodes.length > count) {
    flowerNodes.pop().element.remove();
  }

  if (flowerNodes.length < count) {
    const additions = document.createDocumentFragment();
    const flowersAreFading = opening.classList.contains('blooms-fading')
      || opening.classList.contains('bloom-complete');

    while (flowerNodes.length < count) {
      const index = flowerNodes.length;
      const progress = (index + 1) / count;
      const radius = Math.sqrt(progress);
      const bloomDelay = 0.08 + radius * 4.15 + Math.random() * 0.22;
      const elapsed = (performance.now() - bloomStartedAt) / 1000;
      const node = createFlowerNode();
      node.element.style.setProperty('--delay', `${Math.max(0, bloomDelay - elapsed)}s`);
      if (flowersAreFading) {
        node.element.style.animation = 'none';
        node.element.style.opacity = '0';
      }
      flowerNodes.push(node);
      additions.append(node.element);
    }

    garden.append(additions);
  }

  flowerNodes.forEach((node, index) => layoutFlower(node, index, flowerNodes.length, width, height));
}

window.addEventListener('resize', () => {
  if (!started) return;
  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(resizeGarden);
}, { passive: true });

function bloomGarden() {
  if (started) return;
  started = true;
  bloomStartedAt = performance.now();
  opening.classList.add('has-bloom');
  envelope.classList.add('open');
  loveSong.play().catch(() => {});
  document.querySelector('#hint').style.opacity = '0';

  const width = opening.clientWidth;
  const height = opening.clientHeight;
  const count = targetFlowerCount(width, height);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const progress = (i + 1) / count;
    const radius = Math.sqrt(progress);
    const delay = 0.08 + radius * 4.15 + Math.random() * 0.22;
    const node = createFlowerNode();
    const element = node.element;
    element.style.setProperty('--delay', `${delay}s`);
    layoutFlower(node, i, count, width, height);
    flowerNodes.push(node);
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
