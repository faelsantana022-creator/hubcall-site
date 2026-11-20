(function () {
  var FDA = 'These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.';
  var hdr = document.getElementById('hdr');
  if (hdr) {
    hdr.innerHTML =
      '<div class="proto">PROTOTYPE FOR INTERNAL REVIEW · NOT LIVE · FORMULAS, PRICES AND CLAIMS PENDING APPROVAL</div>' +
      '<header class="site-head"><div class="wrap">' +
      '<a class="logo" href="/" aria-label="HubCall home"><img src="/img/logo-light.svg" alt="HubCall" width="180" height="48"></a>' +
      '<nav class="nav" id="nav" aria-label="Main">' +
      '<a class="nav-niche" href="/weight-loss">Weight loss</a><a class="nav-niche" href="/mens-health">Men\'s health</a><a class="nav-niche" href="/sleep">Sleep support</a>' +
      '<span class="nav-sep" aria-hidden="true"></span><a href="/lab-reports">Lab reports</a><a href="/#faq">FAQ</a><a href="/account">Account</a>' +
      '<a class="btn small" href="/#shop"><span>Shop</span><span>→</span></a></nav>' +
      '<button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="nav">MENU</button>' +
      '</div></header>';
    document.querySelectorAll('.nav a').forEach(function (a) { var h = a.getAttribute('href'); if (h && h.replace('.html','') === location.pathname.replace(/\/$/, '').replace('.html','').replace(/^.*\//,'/')) a.classList.add('cur'); });
    var btn = document.getElementById('menuBtn'), nav = document.getElementById('nav');
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'CLOSE' : 'MENU';
    });
  }
  var ftr = document.getElementById('ftr');
  if (ftr) {
    ftr.innerHTML =
      '<footer class="site-foot"><div class="wrap"><div class="top">' +
      '<div><img src="/img/logo-dark.svg" alt="HubCall" width="180" height="48"><p>For men who always say they\'re fine.</p></div>' +
      '<div><h4>Shop</h4><ul><li><a href="/weight-loss">Weight loss · BurnFast</a></li><li><a href="/mens-health">Men\'s health · The Stack</a></li><li><a href="/sleep">Sleep support · Magzen</a></li><li><a href="/vigorx">VigorX</a> · <a href="/veloran">Veloran</a> · <a href="/testocore">Testocore</a></li></ul></div>' +
      '<div><h4>Trust</h4><ul><li><a href="/lab-reports">Lab reports</a></li><li><a href="/#faq">FAQ</a></li><li><a href="/terms">Subscription terms</a></li></ul></div>' +
      '<div><h4>Account</h4><ul><li><a href="/account">Manage subscription</a></li><li><a href="/account">Cancel in two clicks</a></li></ul></div>' +
      '</div><p class="disc">*' + FDA + ' Consult your physician before use if you take medication or have a medical condition. Not for use under 18.</p>' +
      '<p class="disc">© 2026 HubCall. Prototype.</p></div></footer>';
  }
})();

function fmtDate(d) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
function plusDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return d; }

function initCheckout() {
  var agree = document.getElementById('agree'), pay = document.getElementById('payBtn');
  var nd = document.getElementById('nextDate'); if (nd) nd.textContent = fmtDate(plusDays(30));
  agree.addEventListener('change', function () { pay.disabled = !agree.checked; });
  document.getElementById('coForm').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('toast').classList.add('show');
  });
}

function initAccount() {
  var next = plusDays(12);
  var nd = document.getElementById('nextDate'); nd.textContent = fmtDate(next);
  var toast = document.getElementById('toast');
  function say(msg) { toast.textContent = msg; toast.classList.add('show'); }
  document.getElementById('skipBtn').addEventListener('click', function () {
    next.setDate(next.getDate() + 30); nd.textContent = fmtDate(next);
    say('Done. Your next box moved to ' + fmtDate(next) + '.');
  });
  document.getElementById('cancelBtn').addEventListener('click', function () {
    document.getElementById('confirmBox').style.display = 'flex';
  });
  document.getElementById('keepBtn').addEventListener('click', function () {
    document.getElementById('confirmBox').style.display = 'none';
  });
  document.getElementById('confirmCancel').addEventListener('click', function () {
    document.getElementById('confirmBox').style.display = 'none';
    document.getElementById('actions').style.display = 'none';
    var s = document.getElementById('subState'); s.textContent = 'CANCELED'; s.className = 'chip pending';
    nd.textContent = 'None, you won\'t be charged again';
    say('Canceled. A confirmation email is on its way.');
  });
}

(function () {
  var parts = { vigorx: 4, veloran: 4, testocore: 4 }, cache = {};
  function load(k) {
    if (!cache[k]) {
      var reqs = [];
      for (var i = 0; i < parts[k]; i++) reqs.push(fetch('/img/parts/' + k + '.' + i + '.bin').then(function (r) { return r.arrayBuffer(); }));
      cache[k] = Promise.all(reqs).then(function (bufs) { return URL.createObjectURL(new Blob(bufs, { type: 'image/webp' })); });
    }
    return cache[k];
  }
  document.querySelectorAll('img[data-bottle]').forEach(function (img) {
    load(img.getAttribute('data-bottle')).then(function (u) { img.src = u; });
  });
})();

/* ===== interactive layer ===== */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero parallax
  var vis = document.getElementById('heroVis');
  if (vis && !reduce && window.matchMedia('(pointer:fine)').matches) {
    var imgs = vis.querySelectorAll('.bottles img'), depth = [10, 18, 10];
    vis.parentElement.addEventListener('mousemove', function (e) {
      var r = vis.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
      imgs.forEach(function (im, i) { im.style.transform = 'translate(' + (x * depth[i]) + 'px,' + (y * depth[i]) + 'px)'; });
    });
    vis.parentElement.addEventListener('mouseleave', function () { imgs.forEach(function (im) { im.style.transform = ''; }); });
  }

  // Explorer tabs
  var tabs = document.querySelectorAll('.ex-tab');
  function show(k, focus) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-k') === k;
      t.classList.toggle('on', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    document.querySelectorAll('.ex-panel').forEach(function (p) {
      var on = p.id === 'ex-' + k; p.hidden = !on;
      if (on) p.querySelectorAll('.bar-fill').forEach(function (f) { f.style.animation = 'none'; void f.offsetWidth; f.style.animation = ''; });
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t.getAttribute('data-k')); });
    t.addEventListener('keydown', function (e) {
      var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
      if (d) { e.preventDefault(); show(tabs[(i + d + tabs.length) % tabs.length].getAttribute('data-k'), true); }
    });
  });

  // Ingredient explainers
  document.querySelectorAll('.bar-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = document.getElementById(b.getAttribute('aria-controls'));
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', open ? 'true' : 'false'); p.hidden = !open;
    });
  });

  // 30-day timeline
  var range = document.getElementById('tlRange');
  if (range) {
    var fill = document.getElementById('tlFill'), dayEl = document.getElementById('tlDay');
    var marks = document.querySelectorAll('.tl-mark'), cards = document.querySelectorAll('.tl-card');
    function setDay(d) {
      d = +d; range.value = d; dayEl.textContent = d; fill.style.width = (d / 30 * 100) + '%';
      var active = 0;
      cards.forEach(function (c, i) { if (d >= +c.getAttribute('data-from')) active = i; });
      cards.forEach(function (c, i) { c.classList.toggle('on', i === active); });
      marks.forEach(function (m) { m.classList.toggle('hit', d >= +m.getAttribute('data-day')); });
    }
    range.addEventListener('input', function () { setDay(range.value); });
    marks.forEach(function (m) { m.addEventListener('click', function () { setDay(m.getAttribute('data-day')); }); });
    setDay(0);
  }

  // Ticket tilt follows pointer
  var ticket = document.getElementById('ticket');
  if (ticket && !reduce && window.matchMedia('(pointer:fine)').matches) {
    ticket.addEventListener('mousemove', function (e) {
      var r = ticket.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      ticket.style.transform = 'rotate(-1deg) perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg)';
    });
    ticket.addEventListener('mouseleave', function () { ticket.style.transform = ''; });
  }

  // Safety check
  var sfBoxes = document.querySelectorAll('[data-sf]');
  if (sfBoxes.length) {
    var ok = document.getElementById('sfOk');
    function sfUpdate() {
      var any = false;
      sfBoxes.forEach(function (b) {
        var m = document.querySelector('.sf-msg[data-for="' + b.getAttribute('data-sf') + '"]');
        m.hidden = !b.checked; if (b.checked) any = true;
      });
      ok.hidden = any;
    }
    sfBoxes.forEach(function (b) { b.addEventListener('change', sfUpdate); });
    sfUpdate();
  }

  // Try cancelling
  var tryBtn = document.getElementById('tryBtn');
  if (tryBtn) {
    var clicks = 0, cEl = document.getElementById('tryClicks'), conf = document.getElementById('tryConfirm'),
        done = document.getElementById('tryDone'), state = document.getElementById('tryState');
    function count() { clicks++; cEl.textContent = clicks; }
    tryBtn.addEventListener('click', function () { count(); tryBtn.hidden = true; conf.hidden = false; document.getElementById('tryYes').focus(); });
    document.getElementById('tryYes').addEventListener('click', function () {
      count(); conf.hidden = true; done.hidden = false; state.textContent = 'CANCELED'; state.className = 'chip pending'; state.style.color = 'var(--bone)'; state.style.borderColor = 'var(--bone)';
    });
    document.getElementById('tryReset').addEventListener('click', function () {
      clicks = 0; cEl.textContent = 0; done.hidden = true; tryBtn.hidden = false; state.textContent = 'ACTIVE'; state.className = 'chip ok'; state.style.color = ''; state.style.borderColor = ''; tryBtn.focus();
    });
  }

  // Sticky mobile CTA after the hero
  var sticky = document.getElementById('stickyCta'), hero = document.querySelector('.hero');
  if (sticky && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { sticky.classList.toggle('show', !es[0].isIntersecting); }).observe(hero);
  }
})();

function initCheckout() {
  var agree = document.getElementById('agree'), pay = document.getElementById('payBtn');
  var plans = { men: ['$149.90', '30 days', "The Men's Stack"], weight: ['$149.90', '30 days', 'The Weight Stack'], sleep: ['$69.90', '30 days', 'Magzen'] };
  document.querySelectorAll('.next-date').forEach(function (el) { el.textContent = fmtDate(plusDays(+el.getAttribute('data-days'))); });
  function pick() {
    var k = (location.hash || '#men').slice(1); if (!plans[k]) k = window.__wfPlan || 'men'; window.__wfPlan = k;
    var p = plans[k];
    document.querySelectorAll('.plan').forEach(function (el) { el.hidden = el.getAttribute('data-plan') !== k; });
    document.querySelectorAll('[data-plan-tab]').forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-plan-tab') === k); });
    document.getElementById('discText').innerHTML = '<b>' + p[0] + ' today</b>, then <b>' + p[0] + ' every ' + p[1] + '</b> until you cancel. Plan: ' + p[2] + '.';
    pay.querySelector('span').textContent = 'Continue to secure checkout · ' + p[0];
    pay.setAttribute('href', '#digistore-' + k);
  }
  window.addEventListener('hashchange', function () { if (/^#(men|weight|sleep)$/.test(location.hash)) pick(); }); pick();
}

/* ===== menu (header is now in the HTML) ===== */
(function () {
  var btn = document.getElementById('menuBtn'), nav = document.getElementById('nav');
  if (btn && nav && !btn.getAttribute('data-bound')) {
    btn.setAttribute('data-bound', '1');
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'CLOSE' : 'MENU';
    });
  }
})();

/* ===== quiz ===== */
(function () {
  var box = document.getElementById('quizBox'); if (!box) return;
  var ans = {}, stepEl = document.getElementById('qStep');
  var plans = {
    weight: ['The Weight Stack', '/weight-loss', 'BurnFast, KetoSlim Drops and GlucoCare, one of each. From $149.90 a month. Works with diet and exercise, not instead of them.'],
    men: ["The Men's Stack", '/mens-health', 'VigorX for blood flow, Veloran for prostate health, Testocore for healthy testosterone levels. From $149.90 a month.'],
    sleep: ['Magzen', '/sleep', '250 mg of magnesium in five forms, one capsule before bed. From $69.90 a month.'],
    unsure: ['Start with sleep', '/sleep', "If you don't know where to start, Magzen is the simplest: one mineral, no stimulants, one capsule at night."]
  };
  function go(n) {
    box.querySelectorAll('.q').forEach(function (q) { q.hidden = +q.getAttribute('data-q') !== n; });
    stepEl.textContent = Math.min(n, 3); box.setAttribute('data-step', n);
    var first = box.querySelector('.q[data-q="' + n + '"] button, .q[data-q="' + n + '"] a'); if (first) first.focus({ preventScroll: true });
  }
  function result() {
    var p = plans[ans.goal] || plans.unsure, warn = document.getElementById('qrWarn'), cta = document.getElementById('qrCta');
    document.getElementById('qrTitle').textContent = p[0];
    document.getElementById('qrBody').textContent = p[2];
    cta.hidden = false; cta.setAttribute('href', p[1]); document.getElementById('qrEyebrow').textContent = 'Your match';
    var w = '';
    if (ans.flag === 'stop') { w = "HubCall isn't for you right now. Our products are for adults, and not for use while pregnant or nursing."; cta.hidden = true; document.getElementById('qrEyebrow').textContent = 'Hold on'; document.getElementById('qrTitle').textContent = 'Not right now'; document.getElementById('qrBody').textContent = ''; }
    else if (ans.flag === 'dm' && ans.goal === 'weight') w = 'Talk to your doctor before the Weight Stack. BurnFast and GlucoCare can both lower blood sugar, and with diabetes medication that can go too low.';
    else if (ans.flag === 'dm') w = 'Show your doctor the labels first, since you take blood sugar medication.';
    else if (ans.rx === 'rx-yes') w = 'Since you take prescription medication, show your doctor or pharmacist the labels before you start.';
    warn.textContent = w; warn.hidden = !w;
    go(4);
  }
  box.querySelectorAll('.q-opt').forEach(function (b) {
    b.addEventListener('click', function () {
      var q = +b.closest('.q').getAttribute('data-q'), a = b.getAttribute('data-a');
      if (q === 1) { ans.goal = a; go(2); } else if (q === 2) { ans.rx = a; go(3); } else { ans.flag = a; result(); }
    });
  });
  document.getElementById('qRestart').addEventListener('click', function () { ans = {}; go(1); });
})();

/* ===== cookie banner ===== */
(function () {
  var el = document.getElementById('cookie'); if (!el) return;
  var key = 'wf-cookie', v = null;
  try { v = localStorage.getItem(key); } catch (e) {}
  if (!v) { el.hidden = false; document.body.classList.add('cookie-open'); }
  function set(val) { try { localStorage.setItem(key, val); } catch (e) {} el.hidden = true; document.body.classList.remove('cookie-open'); }
  var ckY = document.getElementById('ckYes'); if (ckY) ckY.addEventListener('click', function () { set('all'); });
  document.getElementById('ckNo').addEventListener('click', function () { set('necessary'); });
})();

/* ===== copy support address ===== */
document.querySelectorAll('.copy-mail').forEach(function (b) {
  b.addEventListener('click', function () {
    var t = b.getAttribute('data-copy'), label = b.textContent;
    function done(ok) { b.textContent = ok ? 'Copied' : t; setTimeout(function () { b.textContent = label; }, 2200); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });
});

/* ===== ingredient library ===== */
(function () {
  var grid = document.getElementById('ingGrid'); if (!grid) return;
  var cards = [].slice.call(grid.querySelectorAll('.ic')), q = document.getElementById('ingQ'),
      count = document.getElementById('ingCount'), empty = document.getElementById('ingEmpty');
  var stack = 'all', evs = {};
  function apply() {
    var t = (q.value || '').trim().toLowerCase(), any = Object.keys(evs).length > 0, n = 0;
    cards.forEach(function (c) {
      var ok = (stack === 'all' || c.getAttribute('data-stacks').split(' ').indexOf(stack) > -1) &&
               (!any || evs[c.getAttribute('data-ev')]) && (!t || c.getAttribute('data-text').indexOf(t) > -1);
      c.hidden = !ok; if (ok) n++;
    });
    document.querySelectorAll('.ing-table tbody tr').forEach(function (r) {
      r.hidden = !((stack === 'all' || r.getAttribute('data-stacks').split(' ').indexOf(stack) > -1) &&
                   (!any || evs[r.getAttribute('data-ev')]) && (!t || r.getAttribute('data-text').indexOf(t) > -1));
    });
    count.textContent = n + (n === 1 ? ' ingredient' : ' ingredients'); empty.hidden = n > 0;
  }
  document.querySelectorAll('.fchip').forEach(function (b) {
    b.addEventListener('click', function () {
      stack = b.getAttribute('data-f');
      document.querySelectorAll('.fchip').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      apply();
    });
  });
  document.querySelectorAll('.echip').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-e'), on = !evs[k];
      if (on) evs[k] = 1; else delete evs[k];
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); apply();
    });
  });
  q.addEventListener('input', apply);
  // deep link: open the card's details
  function openHash() {
    var id = location.hash.slice(1), el = id && document.getElementById(id);
    if (el && el.classList.contains('ic')) { el.hidden = false; var d = el.querySelector('details'); if (d) d.open = true; }
  }
  window.addEventListener('hashchange', openHash); openHash();

  // stack checker
  var dataEl = document.getElementById('ckData'), out = document.getElementById('ckOut'); if (!dataEl || !out) return;
  var D = JSON.parse(dataEl.textContent);
  function fmt(v) { return (Math.round(v * 10) / 10) + ' mg'; }
  function run() {
    var plans = [].slice.call(document.querySelectorAll('.ck-plan input:checked')).map(function (i) { return i.value; });
    var prods = []; plans.forEach(function (p) { prods = prods.concat(D.plans[p]); });
    if (!prods.length) { out.innerHTML = '<p class="ck-none">Pick at least one plan.</p>'; return; }
    var html = '', shown = 0;
    Object.keys(D.shared).forEach(function (k) {
      var s = D.shared[k], tot = 0, from = [], tbd = [];
      prods.forEach(function (p) { if (s.per[p]) { tot += s.per[p]; from.push(D.names[p] + ' ' + s.per[p]); } if (s.tbd.indexOf(p) > -1) tbd.push(D.names[p]); });
      if (!from.length && !tbd.length) return;
      shown++;
      var pct = Math.min(100, tot / s.ul * 100), over = tot > s.ul;
      var msg = over ? 'Over the ' + s.ul + ' mg upper limit. Talk to your doctor before taking these together.' :
                (tot / s.ul >= 0.75 ? 'Close to the ' + s.ul + ' mg upper limit, before food.' : 'Under the ' + s.ul + ' mg upper limit.');
      if (tbd.length) msg += ' ' + tbd.join(', ') + ' dose not confirmed yet, so the real total may be higher.';
      html += '<div class="ck-row' + (over ? ' over' : '') + '"><div class="ck-top"><b>' + s.name + '</b><span class="ck-val">' + fmt(tot) + ' / ' + s.ul + ' mg</span></div>' +
              '<div class="ck-bar"><i style="width:' + pct.toFixed(1) + '%"></i></div><p class="ck-msg">' + (from.length ? from.join(' + ') + ' mg. ' : '') + msg + '</p></div>';
    });
    out.innerHTML = shown ? html : '<p class="ck-none">No shared minerals between these products.</p>';
  }
  document.querySelectorAll('.ck-plan input').forEach(function (i) { i.addEventListener('change', run); }); run();
})();

/* remote photos: fall back to the brand graphic if the image can't load */
document.querySelectorAll('.photo.remote > img').forEach(function (im) {
  function fail() { im.closest('.photo').classList.add('failed'); }
  if (im.complete && !im.naturalWidth && im.src) fail();
  im.addEventListener('error', fail);
});

/* ===== internal notes: hidden by default; ?notes=1 or Shift+N shows them ===== */
(function () {
  var on = /[?&#]notes(=1)?\b/.test(location.search + location.hash);
  function set(v) { on = v; document.body.classList.toggle('show-notes', v); }
  set(on);
  document.addEventListener('keydown', function (e) {
    if (e.shiftKey && (e.key === 'N' || e.key === 'n') && !/input|textarea|select/i.test((e.target || {}).tagName || '')) set(!on);
  });
})();

/* ===== quiz: email me my plan ===== */
(function () {
  var f = document.getElementById('qMail'); if (!f) return;
  var em = document.getElementById('qEmail'), ok = document.getElementById('qConsent'), msg = document.getElementById('qMailMsg');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = (em.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { msg.textContent = 'Check the email address.'; msg.className = 'q-mail-msg err'; em.focus(); return; }
    if (!ok.checked) { msg.textContent = 'Tick the box so we can email you.'; msg.className = 'q-mail-msg err'; ok.focus(); return; }
    var plan = (document.getElementById('qrTitle') || {}).textContent || '';
    msg.textContent = 'Done. Your plan (' + plan + ') is on its way to ' + v + '.'; msg.className = 'q-mail-msg ok';
    f.querySelector('button[type=submit]').disabled = true;
  });
})();

/* ===== quiz photo follows the goal ===== */
(function () {
  var box = document.getElementById('quizBox'); if (!box || !box.querySelector('.quiz-photo')) return;
  var imgs = box.querySelectorAll('.quiz-photo img');
  function show(g) { if (g === 'unsure') g = 'sleep'; imgs.forEach(function (i) { i.classList.toggle('on', i.getAttribute('data-goal') === g); }); }
  box.querySelectorAll('.q[data-q="1"] .q-opt').forEach(function (b) {
    var g = b.getAttribute('data-a');
    b.addEventListener('mouseenter', function () { show(g); });
    b.addEventListener('focus', function () { show(g); });
    b.addEventListener('click', function () { show(g); box.setAttribute('data-goal', g); });
  });
  box.querySelector('.q[data-q="1"]').addEventListener('mouseleave', function () { show(box.getAttribute('data-goal') || 'weight'); });
  var r = document.getElementById('qRestart'); if (r) r.addEventListener('click', function () { box.removeAttribute('data-goal'); show('weight'); });
})();


/* ===== plan pickers (pricing v2) ===== */
document.querySelectorAll('.picker').forEach(function (pk) {
  var btns = pk.querySelectorAll('.tier'), cta = pk.querySelector('a[data-cta]'), fine = pk.querySelector('p[data-fine]');
  function pick(b, focus) {
    btns.forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; });
    cta.setAttribute('href', cta.getAttribute('href').replace(/#.*$/, '') + '#' + b.getAttribute('data-key'));
    cta.querySelector('[data-price]').textContent = b.getAttribute('data-price');
    fine.textContent = b.getAttribute('data-renew');
    if (focus) b.focus();
  }
  btns.forEach(function (b, i) {
    b.tabIndex = b.classList.contains('on') ? 0 : -1;
    b.addEventListener('click', function () { pick(b); });
    b.addEventListener('keydown', function (e) {
      var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
      if (d) { e.preventDefault(); pick(btns[(i + d + btns.length) % btns.length], true); }
    });
  });
});

/* bottle-count visual for JS-rendered tiers */
function packHtml(q) {
  var any = document.querySelector('img[src*="img/"][src$=".webp"]'), pre = any ? any.getAttribute('src').replace(/[^\/]+\.webp$/, '') : '/img/';
  var seq = []; (q.items || []).forEach(function (it) { for (var i = 0; i < it[1]; i++) seq.push(it[0]); });
  var rows = seq.length <= 6 ? [seq] : [seq.filter(function (_, i) { return i % 2 === 0; }), seq.filter(function (_, i) { return i % 2 === 1; })];
  return '<span class="t-pack c' + seq.length + '" aria-hidden="true">' + rows.map(function (r, ri) {
    return '<span class="t-row' + (rows.length === 2 && ri === 0 ? ' back' : '') + '">' + r.map(function (k) { return '<img src="' + pre + k + '.webp" alt="">'; }).join('') + '</span>';
  }).join('') + '</span>';
}

/* ===== checkout (pricing v2): every plan from one JSON ===== */
function initCheckout() {
  var el = document.getElementById('wfPlans'); if (!el) return;
  var D = JSON.parse(el.textContent), P = D.plans, N = D.names;
  var tiers = document.getElementById('coTiers'), sum = document.getElementById('coSum'), sel = document.getElementById('coSingle');
  function money(x) { return '$' + x.toFixed(2); }
  function addDays(d) { var t = new Date(); t.setDate(t.getDate() + d); return t.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  function render() {
    var k = (location.hash || '').slice(1); if (!P[k]) k = window.__wfKey || 'men-1'; window.__wfKey = k;
    var pl = P[k], group = Object.keys(P).filter(function (x) { return P[x].group === pl.group; });
    document.getElementById('coName').textContent = pl.name;
    tiers.innerHTML = group.map(function (x) {
      var q = P[x], on = x === k;
      return '<a class="tier' + (on ? ' on' : '') + '" role="radio" aria-checked="' + on + '" href="#' + x + '">' +
        (x === group[group.length - 1] ? '<span class="t-badge">Best value</span>' : '') +
        packHtml(q) + '<span class="t-len"><i class="t-dot" aria-hidden="true"></i>' + q.label + '</span><span class="t-price">' + money(q.price) + '</span>' +
        '<span class="t-per">' + q.bottles + (q.bottles > 1 ? ' bottles<br><span class="t-pb">' + money(q.perBottle) + ' a bottle</span>' : ' bottle') + '</span>' +
        (q.save > 0 ? '<span class="t-save">Save ' + money(q.save) + '</span>' : '<span class="t-save t-none">&nbsp;</span>') + '</a>';
    }).join('');
    document.getElementById('discText').innerHTML = '<b>' + money(pl.price) + ' today</b>, then <b>' + money(pl.price) + ' every ' + pl.days + ' days</b> until you cancel. Plan: ' + pl.name + ', ' + pl.label + ' (' + pl.what + ').';
    document.getElementById('payPrice').textContent = money(pl.price);
    document.getElementById('payBtn').setAttribute('href', '#digistore-' + k);
    var items = pl.items.map(function (it) {
      return '<div class="sum-item"><img src="/img/' + it[0] + '.webp" alt="' + N[it[0]] + ' bottle" width="300" height="540"><div><b>' + N[it[0]] + '</b><br><span class="fine">' + it[1] + (it[1] > 1 ? ' bottles' : ' bottle') + '</span></div></div>';
    }).join('');
    sum.innerHTML = '<span class="mono muted">Order summary</span>' + items +
      '<div class="sum-line"><span>' + pl.name + ' · ' + pl.label + '</span><span>' + money(pl.price) + '</span></div>' +
      (pl.save > 0 ? '<div class="sum-line"><span>You save</span><span>' + money(pl.save) + '</span></div>' : '') +
      '<div class="sum-line"><span>Shipping</span><span>Free <span class="note">confirm</span></span></div>' +
      '<div class="sum-line" style="font-weight:700;font-size:20px;border-bottom:0"><span>Due today</span><span>' + money(pl.price) + '</span></div>' +
      '<p class="fine">Then ' + money(pl.price) + ' every ' + pl.days + ' days (about ' + money(pl.perDay) + ' a day). Next charge: <b>' + addDays(pl.days) + '</b>.</p>';
    document.querySelectorAll('[data-plan-tab]').forEach(function (t) { t.classList.toggle('on', t.getAttribute('data-plan-tab') === pl.niche); });
    if (sel) sel.value = pl.kind === 'single' ? pl.group + '-1' : '';
  }
  if (sel) sel.addEventListener('change', function () { if (sel.value) location.hash = sel.value; });
  window.addEventListener('hashchange', render); render();
}

/* ===== pricing v3: one single-product picker with a product switch ===== */
document.querySelectorAll('.single-one').forEach(function (host) {
  var pk = host.querySelector('.picker'), chips = host.querySelectorAll('.pchip'), cta = pk.querySelector('a[data-cta]');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var p = c.getAttribute('data-p'), nm = c.getAttribute('data-name'), pg = c.getAttribute('data-page');
      chips.forEach(function (x) { var on = x === c; x.classList.toggle('on', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
      pk.setAttribute('data-group', p);
      pk.querySelectorAll('.tier').forEach(function (t) { t.setAttribute('data-key', t.getAttribute('data-key').replace(/^[a-z]+/, p)); });
      pk.querySelectorAll('.t-pack img').forEach(function (im) { im.setAttribute('src', im.getAttribute('src').replace(/[a-z]+\.webp$/, p + '.webp')); });
      var on = pk.querySelector('.tier.on') || pk.querySelector('.tier');
      cta.setAttribute('href', cta.getAttribute('href').replace(/#.*$/, '') + '#' + on.getAttribute('data-key'));
      host.querySelectorAll('[data-pname]').forEach(function (e) { e.textContent = nm; });
      host.querySelectorAll('.sc-link[data-for]').forEach(function (a) { a.hidden = a.getAttribute('data-for') !== p; });
    });
  });
});

/* ===== checkout form: not live yet — never sends anything ===== */
(function () {
  var f = document.getElementById('coPay'); if (!f) return;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var live = document.getElementById('coLive'); live.hidden = false; live.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
})();
