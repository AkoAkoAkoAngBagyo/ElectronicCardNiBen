document.addEventListener('DOMContentLoaded', () => {
  const lockScreen = document.getElementById('lock-screen');
  const unlockForm = document.getElementById('unlock-form');
  const lyricInput = document.getElementById('lyric-input');
  const inputWrapper = document.getElementById('input-wrapper');
  const errorMsg = document.getElementById('error-msg');
  
  const transitionScreen = document.getElementById('transition-screen');
  const transitionMsgText = document.getElementById('transition-msg-text');
  const proceedBtn = document.getElementById('proceed-btn');

  const mainStage = document.getElementById('main-stage');
  const confettiLayer = document.getElementById('confetti-layer');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelopeHint = document.getElementById('envelope-hint');

  const CORRECT_PASSWORD = 'rm309';

  const errorQuotes = [
    'Look what you made me do... try again!',
    'We are never ever getting unlocked with that word. Try again!',
    'You need to calm down! Check the room number again.',
    'I knew you were trouble when you typed that in... give it another shot!'
  ];
  let errorIndex = 0;

  // Create subtle star/confetti burst
  function triggerStarBurst() {
    const symbols = ['✦', '✧', '★', '✨'];
    const particleCount = 34;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < particleCount; i++) {
      const star = document.createElement('span');
      star.classList.add('star-particle');
      star.textContent = symbols[i % symbols.length];

      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
      const distance = 110 + Math.random() * 240;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 40;

      star.style.left = `${centerX}px`;
      star.style.top = `${centerY}px`;
      star.style.setProperty('--tx', `${tx}px`);
      star.style.setProperty('--ty', `${ty}px`);
      star.style.fontSize = `${0.85 + Math.random() * 0.9}rem`;
      star.style.color = i % 2 === 0 ? '#D4AF37' : '#FDF6EC';

      confettiLayer.appendChild(star);

      setTimeout(() => {
        star.remove();
      }, 1650);
    }
  }
// Inside script.js, find your unlock / proceed function:
  const bgAudio = document.getElementById('bg-audio');

  function unlockMainPage() {
    transitionScreen.classList.add('hidden');
    lockScreen.classList.add('hidden');
    mainStage.classList.remove('locked-blur');
    triggerStarBurst();

    // Play background music (safely handles browser audio policies)
    if (bgAudio) {
      bgAudio.volume = 0.4; // Set volume to 40% so it's a cozy background level
      bgAudio.play().catch((error) => {
        console.log("Audio autoplay was prevented:", error);
      });
    }
  }

  // Handle password submission
  unlockForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userAnswer = lyricInput.value.trim().toLowerCase();

    if (userAnswer === CORRECT_PASSWORD) {
      errorMsg.textContent = '';
      unlockMainPage();
    } else if (userAnswer === 'restaurant') {
      errorMsg.textContent = '';
      lockScreen.classList.add('hidden');
      transitionMsgText.textContent = 'Maliiii, RM309 kasi maem';
      transitionScreen.classList.remove('hidden');
    } else {
      errorMsg.textContent = errorQuotes[errorIndex % errorQuotes.length];
      errorIndex++;

      inputWrapper.classList.remove('shake');
      void inputWrapper.offsetWidth; // Force reflow
      inputWrapper.classList.add('shake');
      lyricInput.focus();
    }
  });

  // Proceed button from the intermediate message screen
  proceedBtn.addEventListener('click', () => {
    unlockMainPage();
  });

  // Open the envelope on click or Enter/Space key
  function openEnvelope() {
    if (!envelopeWrapper.classList.contains('open')) {
      envelopeWrapper.classList.add('open');
      envelopeWrapper.setAttribute('aria-expanded', 'true');
      envelopeHint.classList.add('fade-out');
    }
  }

  envelopeWrapper.addEventListener('click', openEnvelope);
  envelopeWrapper.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openEnvelope();
    }
  });
});