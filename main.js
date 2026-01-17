import { bootTransitions } from './gsap-transitions.js';

window.addEventListener('DOMContentLoaded', () => {
  // Current year
  const yr = document.getElementById('year');
  if(yr) yr.textContent = new Date().getFullYear();

  // Enable smooth scrolling in browsers without native support via GSAP
  if (!('scrollBehavior' in document.documentElement.style)) {
    // optional polyfill path or leave GSAP scrollTo if included
  }

  // Start GSAP transitions
  bootTransitions();

  // Hover micro-interactions for project cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -4, duration: 0.2, ease: 'power1.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.2, ease: 'power1.in' });
    });
  });
});
