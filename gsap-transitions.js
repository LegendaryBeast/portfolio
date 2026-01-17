// Register plugins
window.gsap?.registerPlugin(window.ScrollTrigger);

// Basic entrance timeline for the hero
function introTimeline(){
  const tl = gsap.timeline();
  tl.from('.site-header', { y: -30, opacity: 0, duration: 0.6, ease: 'power3.out' })
    .to('.hero .reveal-up', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12
    }, 0.1);
  return tl;
}

// Scroll-based reveals
function setupScrollReveals(){
  // fade-up for titles and paragraphs
  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%' }
    });
  });

  // soft fade for cards & text blocks
  gsap.utils.toArray('.reveal-fade').forEach(el => {
    gsap.to(el, {
      opacity: 1, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // staggered lists
  gsap.utils.toArray('.reveal-stagger').forEach(list => {
    const items = list.children;
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08,
      scrollTrigger: { trigger: list, start: 'top 85%' }
    });
  });
}

// Smooth hash-navigation transitions using GSAP
function setupNavTransitions(){
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if(!targetId || targetId === '#') return;
      e.preventDefault();

      const target = document.querySelector(targetId);
      if(!target) return;

      // exit animation (slight fade)
      gsap.to('#app', { opacity: 0.92, duration: 0.15, ease: 'power1.out' });

      // smooth scroll to target
      const y = target.getBoundingClientRect().top + window.scrollY - 64;
      gsap.to(window, {
        scrollTo: y,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete(){
          // enter animation
          gsap.fromTo(target.querySelectorAll('.reveal-up, .reveal-fade, .reveal-stagger > *'),
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.06 }
          );
          gsap.to('#app', { opacity: 1, duration: 0.2, ease: 'power1.in' });
        }
      });
    });
  });
}

export function bootTransitions(){
  introTimeline();
  setupScrollReveals();
  setupNavTransitions();
}
