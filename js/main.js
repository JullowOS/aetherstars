if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
if (!window.location.hash) {
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-year]').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

(function () {
  var canvas = document.querySelector('canvas.stars');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var width = 0, height = 0, stars = [];

  function init() {
    stars = [];
    var n = Math.floor(width * height / 4800);
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.15,
        a: Math.random() * 0.75 + 0.15,
        s: Math.random() * 0.006 + 0.0015,
        p: Math.random() * Math.PI * 2,
        orange: Math.random() < 0.14
      });
    }
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    init();
  }

  function render(now) {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i];
      var tw = reduce ? 1 : 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(now * st.s + st.p));
      var alpha = (st.a * tw).toFixed(3);
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fillStyle = st.orange
        ? 'rgba(255, 144, 0, ' + alpha + ')'
        : 'rgba(255, 255, 255, ' + alpha + ')';
      ctx.fill();
    }
  }

  function loop(now) {
    render(now);
    requestAnimationFrame(loop);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  resize();
  if (reduce) {
    render(0);
  } else {
    requestAnimationFrame(loop);
  }
})();

(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = document.querySelectorAll('.card');

  if (prefersReduced || !('IntersectionObserver' in window) || !cards.length) {
    return;
  }

  cards.forEach(function (card) { card.classList.add('reveal'); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(function (card) { observer.observe(card); });
})();

(function () {
  var notice = document.querySelector('.notice');
  if (!notice) return;

  var okBtn = notice.querySelector('.notice-ok');
  var closeBtn = notice.querySelector('.notice-close');
  var triggers = document.querySelectorAll('.trigger-soon');
  var lastTrigger = null;

  function show(trigger) {
    lastTrigger = trigger || null;
    notice.hidden = false;
    requestAnimationFrame(function () {
      notice.classList.add('is-visible');
    });
    okBtn.focus();
  }

  function hide() {
    notice.classList.remove('is-visible');
    window.setTimeout(function () {
      notice.hidden = true;
    }, 200);
    if (lastTrigger) {
      lastTrigger.focus();
    }
  }

  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () { show(btn); });
  });

  okBtn.addEventListener('click', hide);
  closeBtn.addEventListener('click', hide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !notice.hidden) {
      hide();
    }
  });
})();