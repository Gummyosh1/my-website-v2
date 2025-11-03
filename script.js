const stackEl = document.getElementById('stack');
let deck = Array.from(stackEl.querySelectorAll('.card'));

/* ---------- Layout ---------- */
function layout() {
  deck.forEach((card, i) => {
    card.dataset.pos = i;
    const tilt = (i === 0 ? 0 : (i % 2 ? -2 : 2)); // top card straight
    const scale = 1 - Math.min(i, 4) * 0.02;
    card.style.zIndex = String(100 - i);
    card.style.transform = `translateY(${i * 6}px) rotate(${tilt}deg) scale(${scale})`;
    card.style.opacity = i > 4 ? 0 : 1;
  });
}

/* ---------- Draw & Shuffle ---------- */
function draw() {
  if (!deck.length) return;
  const top = deck[0];

  // Instantly straighten the card
  top.style.transition = 'none';
  top.style.transform = `
    translateY(0px)
    rotateZ(0deg)
    scale(1)
  `;
  void top.offsetWidth; // reflow

  // Instantly move card to back of deck (no delay)
  stackEl.appendChild(top);
  deck.push(deck.shift());
  layout();
  updateTiltActivation();
}



function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  deck.forEach(el => stackEl.appendChild(el));
  layout();
  updateTiltActivation();
}

document.getElementById('draw').addEventListener('click', draw);
document.getElementById('shuffle').addEventListener('click', shuffle);

/* ---------- Balatro-style Tilt ---------- */
const MAX_TILT = 8;

function handleTilt(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -MAX_TILT;
  const rotateY = ((x - centerX) / centerX) * MAX_TILT;

  // 🟦 Extract the current base rotation (whatever layout() gave it)
  const matrix = window.getComputedStyle(card).transform;
  let baseRotateZ = 0;
  if (matrix && matrix !== 'none') {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);
    baseRotateZ = Math.round(Math.atan2(b, a) * (180 / Math.PI));
  }

  card.style.transform = `
    translateY(${card.dataset.pos * 6}px)
    rotateZ(${baseRotateZ}deg)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.03)
  `;
}

function resetTilt(e) {
  const card = e.currentTarget;

  // 🟦 Again, preserve the real Z rotation value on reset
  const matrix = window.getComputedStyle(card).transform;
  let baseRotateZ = 0;
  if (matrix && matrix !== 'none') {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);
    baseRotateZ = Math.round(Math.atan2(b, a) * (180 / Math.PI));
  }

  card.style.transition = 'transform 0.3s ease';
  card.style.transform = `
    translateY(${card.dataset.pos * 6}px)
    rotateZ(${baseRotateZ}deg)
    scale(1)
  `;
  setTimeout(() => (card.style.transition = ''), 300);
}

deck.forEach(card => {
  card.addEventListener('mousemove', handleTilt);
  card.addEventListener('mouseleave', resetTilt);
});

function updateTiltActivation() {
  deck.forEach((card, i) => {
    card.style.pointerEvents = i === 0 ? 'auto' : 'none';
  });
}

layout();
updateTiltActivation();

