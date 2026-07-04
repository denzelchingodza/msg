import confetti from "canvas-confetti";

const KNICKS = ["#006BB6", "#F58426", "#FFFFFF", "#FAC775", "#85B7EB"];

export function celebrate(big = false) {
  const bursts = big ? 3 : 1;
  for (let i = 0; i < bursts; i++) {
    setTimeout(() => {
      confetti({
        particleCount: big ? 160 : 80,
        spread: big ? 110 : 70,
        startVelocity: 45,
        origin: { x: 0.2 + Math.random() * 0.6, y: 0.35 },
        colors: KNICKS,
        disableForReducedMotion: true,
      });
    }, i * 220);
  }
}
