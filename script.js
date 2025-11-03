const stackEl = document.getElementById('stack');
let deck = Array.from(stackEl.querySelectorAll('.card')); // DOM order = visual order (top first)

function layout() {
  deck.forEach((card, i) => {
    card.dataset.pos = i; // for filter depth
    const lift = Math.max(0, 14 - i * 4);     // slight vertical offset
    const tilt = (i === 0 ? 0 : (i % 2 ? -2 : 2)); // tiny alternating tilt
    const scale = 1 - Math.min(i, 4) * 0.02;  // subtle scale back
    card.style.zIndex = String(100 - i);
    card.style.transform = `translateY(${i * 6}px) rotate(${tilt}deg) scale(${scale})`;
    card.style.opacity = i > 4 ? 0 : 1; // hide anything past 5 visually
  });
}

function draw() {
  if (!deck.length) return;
  const top = deck[0];
  top.classList.add('slide-out');
  setTimeout(() => {
    top.classList.remove('slide-out');
    stackEl.appendChild(top);
    deck.push(deck.shift());
    layout();
  }, 420);
}

function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  deck.forEach(el => stackEl.appendChild(el));
  layout();
}

document.getElementById('draw').addEventListener('click', draw);
document.getElementById('shuffle').addEventListener('click', shuffle);

layout();
