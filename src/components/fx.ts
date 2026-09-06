export function confetti() {
  const colors = ['#00ff41', '#00d4ff', '#9b59b6', '#ffd700', '#ff5252', '#ffbd2e'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('div');
    c.style.cssText =
      `position:fixed; top:-20px; left:${Math.random() * 100}vw; width:9px; height:9px;` +
      `background:${colors[Math.floor(Math.random() * colors.length)]}; border-radius:2px; z-index:9999; pointer-events:none;`;
    document.body.appendChild(c);
    c.animate(
      [
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${110}vh) rotate(${Math.random() * 720}deg)`, opacity: 1 },
      ],
      { duration: 2000 + Math.random() * 1200, easing: 'ease-out' },
    ).onfinish = () => c.remove();
  }
}