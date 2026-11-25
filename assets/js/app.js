// Customer Success hub: loads content from /data/*.json and renders the page.
// Content editors only need to change the JSON files in /data — not this file.

(function () {
  'use strict';

  var SHOW_LIMIT = 6;

  var INTROS = {
    internal: 'For the Customer Success team: Synthesia videos, guides and GitHub training.',
    external: 'Synthesia videos we share with customers.'
  };

  var GROUPS = [
    { type: 'video', title: 'Synthesia videos', format: 'Synthesia video', icon: 'play-circle', label: 'videos' },
    { type: 'guide', title: 'Guides', format: 'Guide', icon: 'book-open', label: 'guides' },
    { type: 'github', title: 'GitHub training', format: 'GitHub training', icon: 'code-bracket', label: 'items' }
  ];

  var state = { audience: 'internal', product: 'SmartSearch', query: '', expanded: {} };
  var training = [];

  // ---------- helpers ----------

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === 'text') node.textContent = attrs[key];
      else if (key === 'html') node.innerHTML = attrs[key]; // only used for our own bundled icons
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) { if (child) node.appendChild(child); });
    return node;
  }

  function icon(name) {
    var span = el('span', { html: (window.HUB_ICONS && window.HUB_ICONS[name]) || '' });
    return span.firstChild || span;
  }

  // Only allow http(s) and same-site links; anything else (e.g. a placeholder) becomes "#".
  function safeUrl(url) {
    if (typeof url !== 'string') return '#';
    if (/^https?:\/\//i.test(url) || url.charAt(0) === '/' || url.charAt(0) === '#') return url;
    return '#';
  }

  function isExternal(url) { return /^https?:\/\//i.test(url); }

  function loadJson(path) {
    return fetch(path, { credentials: 'same-origin' }).then(function (res) {
      if (!res.ok) throw new Error(path + ' returned ' + res.status);
      return res.json();
    });
  }

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return iso || '';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function showError(container, message) {
    container.innerHTML = '';
    var msg = el('p', { class: 'empty', text: message });
    container.appendChild(container.tagName === 'UL' ? el('li', { style: 'padding: 16px 20px' }, [msg]) : msg);
  }

  // ---------- signed-in user (Azure Static Web Apps) ----------

  function loadUser() {
    fetch('/.auth/me', { credentials: 'same-origin' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        var principal = data && data.clientPrincipal;
        if (principal && principal.userDetails) {
          document.getElementById('user-name').textContent = principal.userDetails;
        }
      })
      .catch(function () { /* not running on Static Web Apps (e.g. local preview) */ });
  }

  // ---------- quick links ----------

  function renderLinks(links) {
    var container = document.getElementById('links');
    container.innerHTML = '';
    links.forEach(function (link) {
      var url = safeUrl(link.url);
      var attrs = { class: 'link-card', href: url };
      if (isExternal(url)) { attrs.target = '_blank'; attrs.rel = 'noopener noreferrer'; }
      container.appendChild(el('a', attrs, [
        el('span', { class: 'icon-circle' }, [icon(link.icon)]),
        el('span', {}, [
          el('strong', { text: link.name }),
          el('small', { text: link.description || '' })
        ])
      ]));
    });
  }

  // ---------- news ----------

  function renderNews(items) {
    var container = document.getElementById('news-list');
    container.innerHTML = '';
    if (!items.length) { showError(container, 'No news yet.'); return; }
    items
      .slice()
      .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); })
      .forEach(function (item, index) {
        var meta = el('p', { class: 'meta' });
        if (index === 0) meta.appendChild(el('span', { class: 'tag-new', text: 'New' }));
        meta.appendChild(document.createTextNode(formatDate(item.date) + (item.author ? ', ' + item.author : '')));
        container.appendChild(el('article', { class: 'news-item' }, [
          meta,
          el('h3', {}, [el('a', { href: safeUrl(item.url), text: item.title })]),
          el('p', { text: item.summary || '' })
        ]));
      });
  }

  // ---------- documents ----------

  function renderDocs(docs) {
    var list = document.getElementById('doc-list');
    list.innerHTML = '';
    docs.forEach(function (doc) {
      var url = safeUrl(doc.url);
      var attrs = { href: url };
      if (isExternal(url)) { attrs.target = '_blank'; attrs.rel = 'noopener noreferrer'; }
      list.appendChild(el('li', {}, [el('a', attrs, [icon('document-text'), el('span', { text: doc.title })])]));
    });
  }

  // ---------- training ----------

  // Search covers all training, whichever tab or product is selected.
  // Matches the title, description, format (e.g. "GitHub training") and any keywords.
  function searchText(item) {
    var group = GROUPS.filter(function (g) { return g.type === item.type; })[0];
    return [item.title, item.description, item.product, group ? group.format : '', (item.keywords || []).join(' ')]
      .join(' ').toLowerCase();
  }

  function searchTraining(query) {
    var words = query.split(/\s+/).filter(Boolean);
    var seen = {};
    return training.filter(function (item) {
      var text = searchText(item);
      var match = words.every(function (w) { return text.indexOf(w) !== -1; });
      if (!match || seen[item.url + item.title]) return false;
      seen[item.url + item.title] = true;
      return true;
    });
  }

  function card(item, group) {
    var url = safeUrl(item.url);
    var attrs = { href: url, text: item.title };
    if (isExternal(url)) { attrs.target = '_blank'; attrs.rel = 'noopener noreferrer'; }
    return el('div', { class: 'card' }, [
      el('span', { class: 'format' }, [icon(group.icon), el('span', { text: group.format })]),
      el('a', attrs),
      el('p', { text: item.description || '' })
    ]);
  }

  function renderTraining() {
    var container = document.getElementById('groups');
    container.innerHTML = '';
    document.getElementById('panel-title').textContent =
      state.audience === 'internal' ? 'Internal training' : 'External training';
    document.getElementById('panel-intro').textContent = INTROS[state.audience];

    var query = state.query.trim().toLowerCase();
    var visible = query ? searchTraining(query) : training.filter(function (item) {
      var forAudience = (item.audience || []).indexOf(state.audience) !== -1;
      var forProduct = item.product === state.product || item.product === 'Both';
      return forAudience && forProduct;
    });

    if (query && !visible.length) {
      showError(container, 'Nothing matches “' + state.query.trim() + '”. Try a different word, or clear the search.');
      return;
    }

    GROUPS.forEach(function (group) {
      var items = visible.filter(function (item) { return item.type === group.type; });
      if (!items.length) return;
      var key = state.audience + '|' + state.product + '|' + group.type;
      var expanded = !!state.expanded[key] || !!query;
      var shown = expanded ? items : items.slice(0, SHOW_LIMIT);

      var grid = el('div', { class: 'cards' });
      shown.forEach(function (item) { grid.appendChild(card(item, group)); });

      var section = el('div', { class: 'group' }, [
        el('h4', { text: group.title + ' (' + items.length + ')' }),
        grid
      ]);

      if (!query && items.length > SHOW_LIMIT) {
        var more = el('button', { class: 'more', type: 'button', text: expanded ? 'Show fewer' : 'Show all ' + items.length + ' ' + group.label });
        more.addEventListener('click', function () {
          state.expanded[key] = !expanded;
          renderTraining();
        });
        section.appendChild(more);
      }
      container.appendChild(section);
    });

    // Space between groups
    Array.prototype.forEach.call(container.children, function (child, i) {
      if (i > 0) child.style.marginTop = '32px';
    });
  }

  function setupTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      document.getElementById('training-panel').setAttribute('aria-labelledby', tab.id);
      state.audience = tab.getAttribute('data-audience');
      renderTraining();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        select(next);
      });
    });

    var pills = Array.prototype.slice.call(document.querySelectorAll('.pill'));
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'); });
        state.product = pill.getAttribute('data-product');
        renderTraining();
      });
    });
  }

  function setupSearch() {
    document.getElementById('search-icon').appendChild(icon('magnifying-glass'));
    var input = document.getElementById('search-input');
    input.addEventListener('input', function () {
      state.query = input.value;
      renderTraining();
    });
    // Press Enter: if exactly one item matches, open it straight away; otherwise jump to the results.
    document.getElementById('search-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var query = input.value.trim().toLowerCase();
      var results = query ? searchTraining(query) : [];
      var url = results.length === 1 ? safeUrl(results[0].url) : '#';
      if (url !== '#') {
        window.open(url, isExternal(url) ? '_blank' : '_self', 'noopener');
        return;
      }
      document.getElementById('training').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---------- start ----------

  document.addEventListener('DOMContentLoaded', function () {
    loadUser();
    setupTabs();
    setupSearch();

    loadJson('data/links.json').then(renderLinks)
      .catch(function () { showError(document.getElementById('links'), 'Quick links could not be loaded. Check data/links.json.'); });
    loadJson('data/news.json').then(renderNews)
      .catch(function () { showError(document.getElementById('news-list'), 'News could not be loaded. Check data/news.json.'); });
    loadJson('data/documents.json').then(renderDocs)
      .catch(function () { showError(document.getElementById('doc-list'), 'Documents could not be loaded. Check data/documents.json.'); });
    loadJson('data/training.json').then(function (items) { training = items; renderTraining(); })
      .catch(function () { showError(document.getElementById('groups'), 'Training could not be loaded. Check data/training.json.'); });
  });
})();
