/* ============================================================
   DearLover by V'Macdel — interactions (shared across pages)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Gallery data (mix of photos + films) ---------- */
  const GALLERY = [
    { type: 'video', file: 'clip-ehmi-trad.mp4', cap: 'Ehmi · The Traditional' },
    { type: 'img',   file: 'augusta-4.jpg',      cap: 'Naza · White Wedding' },
    { type: 'img',   file: 'es-white-16.jpg',    cap: 'Ehmi · The Bride' },
    { type: 'img',   file: 'augusta-1.jpg',      cap: 'Bouquet · Detail' },
    { type: 'img',   file: 'es-trad-10.jpg',     cap: 'Ehmi · Golden Traditional' },
    { type: 'video', file: 'clip-2.mp4',         cap: 'Oge · Beadwork Detail' },
    { type: 'img',   file: 'augusta-5.jpg',      cap: 'Naza · Cathedral Reveal' },
    { type: 'img',   file: 'es-white-04.jpg',    cap: 'Ehmi · The Reception' },
    { type: 'video', file: 'clip-7.mp4',         cap: 'Oge · Gele Portrait' },
    { type: 'img',   file: 'augusta-2.jpg',      cap: 'Naza · The Celebration' },
    { type: 'img',   file: 'es-trad-13.jpg',     cap: 'Ehmi · Together' },
    { type: 'img',   file: 'augusta-6.jpg',      cap: 'An Intimate Moment' },
    { type: 'img',   file: 'es-white-23.jpg',    cap: 'Ehmi · The White Wedding' },
    { type: 'video', file: 'clip-3.mp4',         cap: 'Oge · The Second Look' },
    { type: 'img',   file: 'augusta-3.jpg',      cap: 'Naza · The Couple' },
    { type: 'video', file: 'clip-augusta.mp4',   cap: 'Naza · Editorial Film' },
  ];

  /* ---------- Gallery slider ---------- */
  const track = document.getElementById('sliderTrack');
  let vIO;
  function observeVideos() {
    const vids = document.querySelectorAll('.g-item video');
    if (!('IntersectionObserver' in window)) { vids.forEach(v => v.play().catch(()=>{})); return; }
    if (vIO) vIO.disconnect();
    vIO = new IntersectionObserver((entries) => {
      entries.forEach(en => { en.isIntersecting ? en.target.play().catch(()=>{}) : en.target.pause(); });
    }, { threshold: 0.4 });
    vids.forEach(v => vIO.observe(v));
  }

  if (track) {
    track.innerHTML = GALLERY.map(g => {
      const media = g.type === 'img'
        ? `<img src="assets/media/${g.file}" alt="${g.cap}" loading="lazy" />`
        : `<video src="assets/media/${g.file}#t=1.2" muted loop playsinline preload="metadata"></video>
           <span class="g-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>`;
      return `<div class="slide"><figure class="g-item">${media}<figcaption class="g-cap">${g.cap}</figcaption></figure></div>`;
    }).join('');
    observeVideos();

    const prev = document.querySelector('.slider-nav.prev');
    const next = document.querySelector('.slider-nav.next');
    const step = () => {
      const slide = track.querySelector('.slide');
      const w = slide ? slide.getBoundingClientRect().width + 16 : 300;
      return Math.max(w, Math.floor(track.clientWidth / w) * w);
    };
    const updateArrows = () => {
      if (!prev || !next) return;
      prev.toggleAttribute('disabled', track.scrollLeft < 8);
      next.toggleAttribute('disabled', track.scrollLeft + track.clientWidth >= track.scrollWidth - 8);
    };
    prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();

    // Tap a film to toggle play
    track.addEventListener('click', e => {
      const v = e.target.closest('.g-item') && e.target.closest('.g-item').querySelector('video');
      if (!v) return;
      v.paused ? v.play().catch(()=>{}) : v.pause();
    });
  }

  /* ---------- Hero background alternation (film ⇄ photo) ---------- */
  const heroLayers = [document.querySelector('.hero-video'), document.querySelector('.hero-photo')];
  if (heroLayers[0] && heroLayers[1] && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let i = 0;
    setInterval(() => {
      i = 1 - i;
      heroLayers.forEach((l, k) => l.classList.toggle('is-active', k === i));
      if (i === 0) heroLayers[0].play().catch(()=>{});
    }, 6500);
  }

  /* ---------- Header transparency over hero ---------- */
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  if (header && hero && header.classList.contains('on-hero')) {
    new IntersectionObserver((entries) => {
      entries.forEach(en => header.classList.toggle('on-hero', en.isIntersecting));
    }, { rootMargin: '-70px 0px 0px 0px', threshold: 0 }).observe(hero);
  }

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    const onLanding = !!document.getElementById('experience');
    const p = onLanding ? '' : 'index.html';
    const drawer = document.createElement('div');
    drawer.className = 'mobile-nav';
    drawer.innerHTML = `
      <div class="mobile-nav-head">
        <span class="brand"><span class="brand-name">DearLover</span></span>
        <button class="mobile-close" aria-label="Close menu">&times;</button>
      </div>
      <a href="${p}#experience">The Experience</a>
      <a href="${p}#packages">Packages</a>
      <a href="${p}#gallery">Gallery</a>
      <a href="${p}#brides">The DearLover Bride</a>
      <a href="about.html">About</a>
      <a href="faq.html">FAQ</a>
      <a href="consultation.html" class="btn btn-wine">Book a Consultation</a>
    `;
    document.body.appendChild(drawer);
    const closeMenu = () => {
      drawer.classList.remove('open'); toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelector('.mobile-close').addEventListener('click', closeMenu);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ---------- FAQ accordion (faq page) ---------- */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const ans = item.querySelector('.faq-a');
      const open = item.classList.toggle('open');
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '';
    });
  });

  /* ---------- Consultation / contact form ---------- */
  // Google Apps Script Web App — appends submissions to the "DearLover Leads"
  // Google Sheet and emails Valerie a copy so she can prep before each call.
  const LEADS_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyUefu0f2xwJLtXhXs77Gs2MdyPFn0ZSjTd_-BsLdoXVCqX7FJ6cez3HZYrume2VKyLbg/exec';

  document.querySelectorAll('form[data-confirm]').forEach(form => {
    const note = form.querySelector('.form-note');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.querySelector('[name="firstName"]') || form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      if ((name && !name.value.trim()) || (email && !email.value.trim())) {
        if (note) note.textContent = 'Please add your name and email so we can reach you.';
        return;
      }

      if (LEADS_SHEET_URL && !LEADS_SHEET_URL.startsWith('PASTE_')) {
        // Apps Script Web Apps don't return CORS headers we can read, so we fire
        // in "no-cors" mode — the row still gets written, we just can't inspect
        // the response. We optimistically show success once the request is sent.
        fetch(LEADS_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: new FormData(form)
        }).catch(() => { /* network hiccup — the on-page message still confirms locally */ });
      }

      const first = name ? name.value.trim().split(' ')[0] : 'there';
      if (note) note.textContent = `Thank you, ${first}. Your story has found its first chapter — we'll confirm your consultation within 24 hours.`;
      form.reset();
    });
  });

  /* ---------- Consultation payment (Paystack) ---------- */
  // The consultation form no longer saves/emails on submit — it starts a Paystack
  // payment first. The Sheet row + "payment received" email only fire after
  // /api/verify-payment confirms the transaction actually succeeded (below).
  const consultationForm = document.getElementById('consultationForm');
  if (consultationForm) {
    const note = consultationForm.querySelector('.form-note');
    const submitBtn = document.getElementById('consultationSubmit');

    consultationForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = consultationForm.querySelector('[name="firstName"]');
      const email = consultationForm.querySelector('[name="email"]');
      if (!name.value.trim() || !email.value.trim()) {
        if (note) note.textContent = 'Please add your name and email so we can reach you.';
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Redirecting to payment…'; }
      if (note) note.textContent = '';

      const data = Object.fromEntries(new FormData(consultationForm).entries());
      try {
        const res = await fetch('/api/initialize-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok || !result.authorization_url) {
          throw new Error(result.error || 'Could not start payment.');
        }
        window.location.href = result.authorization_url;
      } catch (err) {
        if (note) note.textContent = err.message || 'Something went wrong starting payment. Please try again, or WhatsApp us directly.';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Continue to Payment'; }
      }
    });
  }

  // Returning from Paystack: consultation.html gets ?reference=xxx appended.
  // Verify it server-side before treating the booking as real.
  const step2 = document.getElementById('step2');
  const paymentStatus = document.getElementById('paymentStatus');
  const paymentReference = new URLSearchParams(window.location.search).get('reference');
  if (step2 && paymentStatus && paymentReference) {
    paymentStatus.hidden = false;
    paymentStatus.innerHTML = '<p style="color:var(--ink-soft)">Verifying your payment…</p>';

    fetch(`/api/verify-payment?reference=${encodeURIComponent(paymentReference)}`)
      .then(r => r.json())
      .then(result => {
        if (!result.success) {
          paymentStatus.innerHTML = '<p style="color:var(--wine)">We couldn\'t confirm that payment went through. If you were charged, please WhatsApp or email us and we\'ll sort it out — otherwise, feel free to try again above.</p>';
          return;
        }

        // Payment confirmed — now (and only now) log the lead + notify Valerie.
        if (LEADS_SHEET_URL && !LEADS_SHEET_URL.startsWith('PASTE_')) {
          const sheetPayload = new URLSearchParams({ formType: 'consultation', ...result.formData, email: result.email || '' });
          fetch(LEADS_SHEET_URL, { method: 'POST', mode: 'no-cors', body: sheetPayload }).catch(() => {});
        }

        const first = (result.formData && result.formData.firstName) || 'there';
        paymentStatus.innerHTML = `<p style="color:var(--wine);font-weight:500">Payment received, ${first} — thank you! We'll be in touch within 24 hours.</p>`;

        // Clean the URL so refreshing doesn't re-verify, then reveal Step 2.
        window.history.replaceState({}, document.title, window.location.pathname);
        step2.hidden = false;
        step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(() => {
        paymentStatus.innerHTML = '<p style="color:var(--wine)">We couldn\'t reach the payment server to confirm your booking. Please WhatsApp or email us with your payment reference and we\'ll confirm manually.</p>';
      });
  }

  /* ---------- Reveal on scroll (with skip-safety) ---------- */
  const revealEls = document.querySelectorAll('.section-head, .tl-step, .pkg, .bride-card, .intro-lines, .intro-body, .prose > *, .faq-item, .pkg-detail, .form-card, .express-note, .pkg-included');
  revealEls.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
    const revealPassed = () => revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
    });
    window.addEventListener('load', revealPassed);
    revealPassed();
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }
})();
