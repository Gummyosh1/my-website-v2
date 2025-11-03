const cards = Array.from(document.querySelectorAll('.card'));
let current = 0;

function showCard(index) {
  cards.forEach((card, i) => {
    card.style.zIndex = cards.length - i;
    if (i === index) {
      card.classList.remove('hidden');
      card.style.transform = 'translateY(0) rotateX(0)';
      card.style.opacity = 1;
    } else {
      card.classList.add('hidden');
    }
  });
}

function drawCard() {
  const currentCard = cards[current];
  currentCard.style.transform = 'translateY(-50px) rotateX(60deg)';
  currentCard.style.opacity = 0;
  setTimeout(() => {
    cards.push(cards.shift()); // Move first card to end
    current = 0;
    showCard(current);
  }, 400);
}

function shuffleDeck() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  showCard(0);
}

document.getElementById('next-btn').addEventListener('click', drawCard);
document.getElementById('shuffle-btn').addEventListener('click', shuffleDeck);

showCard(current);
