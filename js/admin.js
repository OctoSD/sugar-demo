const SCREENS = [
  'admin-dashboard', 'admin-catalogo', 'admin-pedidos', 'admin-socios',
  'admin-admision', 'admin-tokens', 'admin-eventos', 'admin-membresias', 'admin-equipo',
  'admin-reportes', 'admin-config', 'admin-socio-perfil'
];

const root = document.getElementById('screen-root');

async function goTo(id) {
  root.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#52B788;font-size:14px;font-family:Inter,sans-serif">Cargando…</div>';
  try {
    const resp = await fetch(`screens/${id}.html`, { cache: 'no-store' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const html = await resp.text();
    root.innerHTML = html;
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    attachBehaviors(root);
  } catch(err) {
    root.innerHTML = `<div style="padding:20px;color:#ef4444;font-family:Inter,sans-serif">Error cargando ${id}: ${err.message}</div>`;
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
  const hash = location.hash.replace('#','') || 'admin-dashboard';
  if (SCREENS.includes(hash)) goTo(hash);
  else goTo('admin-dashboard');
});
window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#','');
  if (id && SCREENS.includes(id)) goTo(id);
});
