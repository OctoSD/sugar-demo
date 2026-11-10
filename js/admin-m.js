const SCREENS = ['admin-m-home', 'admin-m-pedidos', 'admin-m-socios', 'admin-m-tokens', 'admin-reportes', 'admin-config'];

const root = document.getElementById('screen-root');

async function goTo(id) {
  root.innerHTML = '<div class="screen-loading">Cargando…</div>';
  try {
    const resp = await fetch(`screens/${id}.html`, { cache: 'no-store' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const html = await resp.text();
    root.innerHTML = html;
    root.scrollTop = 0;
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    window.__portalGoTo = goTo;
    attachBehaviors(root);
  } catch(err) {
    root.innerHTML = `<div class="screen-error">Error cargando ${id}: ${err.message}</div>`;
  }
}

function attachBehaviors(container) {
  container.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); goTo(el.dataset.goto); });
  });
  container.querySelectorAll('[data-tab-group]').forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.dataset.tabGroup;
      const target = tab.dataset.tabTarget;
      document.querySelectorAll(`[data-tab-group="${group}"]`).forEach(t => t.classList.remove('active-tab'));
      document.querySelectorAll(`[data-tab-pane="${group}"]`).forEach(p => p.style.display = 'none');
      tab.classList.add('active-tab');
      const pane = document.querySelector(`[data-tab-pane="${group}"][data-tab-id="${target}"]`);
      if (pane) pane.style.display = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#','') || 'admin-m-home';
  if (SCREENS.includes(hash)) goTo(hash);
  else goTo('admin-m-home');
});
window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#','');
  if (id && SCREENS.includes(id)) goTo(id);
});
