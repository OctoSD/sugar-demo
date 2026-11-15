const SCREENS = [
  'cultivo-dashboard', 'cultivo-cultivos', 'cultivo-cultivo-nuevo',
  'cultivo-plantas', 'cultivo-lote-detalle',
  'cultivo-solicitudes', 'cultivo-cepa-nueva'
];

const root = document.getElementById('screen-root');

async function goTo(id) {
  root.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#52B788;font-size:14px;font-family:Inter,sans-serif">Cargando…</div>';
  try {
    const resp = await fetch(`screens/${id}.html`, { cache: 'no-store' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const html = await resp.text();
    root.innerHTML = html;
    root.querySelectorAll('script').forEach(s => {
      const ns = document.createElement('script');
      if (s.src) { ns.src = s.src; } else { ns.textContent = s.textContent; }
      s.parentNode.replaceChild(ns, s);
    });
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
}

const hash = location.hash.replace('#', '');
goTo(SCREENS.includes(hash) ? hash : 'cultivo-dashboard');
