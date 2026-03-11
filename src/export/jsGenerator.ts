import type { Diagram } from '../types/diagram';

export function generateDiagramJS(prefix: string, diagram?: Diagram): string {
  // Check if we need scroll-trigger support
  const hasScrollTrigger = diagram
    ? [...diagram.nodes, ...diagram.edges].some((el) => el.animation?.config.trigger === 'onScroll')
    : false;

  // Check if we need typewriter
  const hasTypewriter = diagram
    ? diagram.nodes.some((n) => n.animation?.presetId === 'typewriter')
    : false;

  return `
(function() {
  var container = document.querySelector('.${prefix}');
  if (!container) return;

  var tooltip = document.createElement('div');
  tooltip.className = '${prefix}-tooltip';
  container.appendChild(tooltip);

  var nodes = container.querySelectorAll('.${prefix}-node');
  nodes.forEach(function(node) {
    node.addEventListener('mouseenter', function(e) {
      var label = node.getAttribute('data-label') || '';
      var sublabel = node.getAttribute('data-sublabel') || '';
      tooltip.textContent = sublabel ? label + ' — ' + sublabel : label;
      tooltip.classList.add('visible');
    });

    node.addEventListener('mousemove', function(e) {
      var rect = container.getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
      tooltip.style.top = (e.clientY - rect.top - 30) + 'px';
    });

    node.addEventListener('mouseleave', function() {
      tooltip.classList.remove('visible');
    });

    node.addEventListener('click', function() {
      nodes.forEach(function(n) { n.style.outline = 'none'; });
      node.style.outline = '2px solid #E93BCD';
    });
  });

  // Animated counters — ease-out via requestAnimationFrame (Vercel-style)
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  var counters = container.querySelectorAll('[data-counter]');
  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-counter'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 2000;
        var start = null;
        function tick(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = easeOutCubic(progress);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(function(c) { counterObserver.observe(c); });
${hasScrollTrigger ? `
  // Scroll-triggered animations
  var observeEls = container.querySelectorAll('.${prefix}-observe');
  var scrollObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('${prefix}-visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observeEls.forEach(function(el) { scrollObserver.observe(el); });
` : ''}
${hasTypewriter ? `
  // Typewriter effect
  var typewriterEls = container.querySelectorAll('[data-typewriter]');
  typewriterEls.forEach(function(el) {
    var text = el.getAttribute('data-typewriter');
    var duration = parseFloat(el.getAttribute('data-tw-duration') || '1.5') * 1000;
    var delay = parseFloat(el.getAttribute('data-tw-delay') || '0') * 1000;
    el.textContent = '';
    setTimeout(function() {
      var i = 0;
      var interval = duration / text.length;
      var timer = setInterval(function() {
        el.textContent = text.substring(0, i + 1);
        i++;
        if (i >= text.length) clearInterval(timer);
      }, interval);
    }, delay);
  });
` : ''}
})();
`;
}
