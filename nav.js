// Thanh điều hướng nổi cho các trang menu. Trang bundle thay cả <html> sau khi
// giải nén, nên kiểm tra định kỳ và gắn lại nếu thanh bị mất.
(function () {
  var m = location.pathname.match(/(speisekarte|mittag)-(1[abc])\.html$/);
  if (!m) return;
  var kind = m[1], variant = m[2];
  var kinds = [['speisekarte', 'Speisekarte'], ['mittag', 'Mittag']];
  var variants = [['1a', 'Seigaiha'], ['1b', 'Sumi'], ['1c', 'Yoru']];

  var css =
    '#tayo-nav{position:fixed;left:0;top:0;transform-origin:0 0;z-index:2147483000;' +
    'display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px;' +
    'padding:6px;background:rgba(30,39,64,.92);border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.25);' +
    'font:600 13px/1 system-ui,-apple-system,sans-serif;backdrop-filter:blur(6px)}' +
    '#tayo-nav a{color:#F3ECDD;text-decoration:none;padding:8px 12px;border-radius:999px;white-space:nowrap}' +
    '#tayo-nav a:hover{background:rgba(243,236,221,.15)}' +
    '#tayo-nav a[aria-current]{background:#C8412A;color:#fff}' +
    '#tayo-nav .g{display:flex;gap:2px}' +
    '#tayo-nav .sep{width:1px;height:18px;background:rgba(243,236,221,.3)}' +
    '@media print{#tayo-nav{display:none!important}}';

  function link(href, text, current, title) {
    return '<a href="' + href + '"' + (current ? ' aria-current="page"' : '') +
      (title ? ' title="' + title + '"' : '') + '>' + text + '</a>';
  }

  function build() {
    var nav = document.createElement('nav');
    nav.id = 'tayo-nav';
    nav.setAttribute('aria-label', 'Menü-Navigation');
    nav.innerHTML =
      '<style>' + css + '</style>' +
      link('index.html', '← Übersicht') +
      '<span class="sep"></span><span class="g">' +
      kinds.map(function (k) { return link(k[0] + '-' + variant + '.html', k[1], k[0] === kind); }).join('') +
      '</span><span class="sep"></span><span class="g">' +
      variants.map(function (v) { return link(kind + '-' + v[0] + '.html', v[0], v[0] === variant, v[1]); }).join('') +
      '</span>';
    return nav;
  }

  // Trang menu rộng hơn màn hình điện thoại nên layout viewport bị kéo giãn;
  // đặt thanh theo visual viewport để luôn nằm giữa đáy vùng đang nhìn thấy.
  function place() {
    var nav = document.getElementById('tayo-nav'), vv = window.visualViewport;
    if (!nav || !vv) return;
    var k = 1 / vv.scale;
    nav.style.maxWidth = (vv.width * vv.scale - 32) + 'px';
    var x = vv.offsetLeft + (vv.width - nav.offsetWidth * k) / 2;
    var y = vv.offsetTop + vv.height - (nav.offsetHeight + 16) * k;
    nav.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + k + ')';
  }

  function ensure() {
    if (document.body && !document.getElementById('tayo-nav')) document.body.appendChild(build());
    place();
  }
  ensure();
  setInterval(ensure, 400);
  if (window.visualViewport) {
    visualViewport.addEventListener('resize', place);
    visualViewport.addEventListener('scroll', place);
  }
  addEventListener('resize', place);
})();
