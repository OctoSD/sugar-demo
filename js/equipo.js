const SCREENS = ['equipo-login', 'equipo-hub', 'equipo-admision', 'equipo-armado', 'equipo-entrega', 'equipo-fin-turno', 'equipo-medico', 'equipo-fichaje'];

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
    // Execute scripts injected via innerHTML (browser doesn't run them automatically)
    root.querySelectorAll('script').forEach(old => {
      const s = document.createElement('script');
      [...old.attributes].forEach(a => s.setAttribute(a.name, a.value));
      s.textContent = old.textContent;
      old.parentNode.replaceChild(s, old);
    });
    attachBehaviors(root);
  } catch(err) {
    root.innerHTML = `<div class="screen-error">Error cargando ${id}: ${err.message}</div>`;
  }
}

function attachBehaviors(container) {
  container.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); goTo(el.dataset.goto); });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#','') || 'equipo-login';
  if (SCREENS.includes(hash)) goTo(hash);
  else goTo('equipo-login');
});
window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#','');
  if (id && SCREENS.includes(id)) goTo(id);
});
