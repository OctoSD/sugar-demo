const SCREENS = [
  'socio-home', 'socio-catalogo', 'socio-strain', 'socio-pedido',
  'socio-confirmacion', 'socio-historial', 'socio-educacion',
  'socio-edu-strain', 'socio-perfil', 'socio-membresia',
  'socio-eventos', 'socio-evento', 'socio-qr', 'socio-edu-article'
];

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
    attachBehaviors(root);
  } catch(err) {
    root.innerHTML = `<div class="screen-error">Error cargando ${id}: ${err.message}</div>`;
  }
}

function attachBehaviors(container) {
  container.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); goTo(el.dataset.goto); });
  });
  container.querySelectorAll('.qty-counter').forEach(c => {
    const val = c.querySelector('.qty-val');
    const btns = c.querySelectorAll('button');
    btns[0]?.addEventListener('click', () => { let n = parseInt(val.textContent)||0; if(n>0) val.textContent=n-1; });
    btns[1]?.addEventListener('click', () => { let n = parseInt(val.textContent)||0; val.textContent=n+1; });
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
  // Filter chips
  container.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.closest('.filter-chips');
      if (group) group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#','') || 'socio-home';
  if (SCREENS.includes(hash)) goTo(hash);
  else goTo('socio-home');
});
window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#','');
  if (id && SCREENS.includes(id)) goTo(id);
});
