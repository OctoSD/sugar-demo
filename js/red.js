const SCREENS = [
  'red-dashboard', 'red-clubes', 'red-club-detalle',
  'red-beneficios', 'red-eventos'
];

const root = document.getElementById('screen-root');

async function goTo(id) {
  root.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#F59E0B;font-size:14px;font-family:Inter,sans-serif">Cargando…</div>';
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

function showLogin() {
  root.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#060A06;font-family:'Inter',sans-serif">
      <div style="width:360px;text-align:center">
        <div style="font-size:48px;margin-bottom:16px">⬡</div>
        <div style="font-size:24px;font-weight:800;color:#F59E0B;margin-bottom:4px">Panel Federación</div>
        <div style="font-size:13px;color:rgba(245,158,11,0.5);margin-bottom:32px">Acceso restringido · Federación de Clubes Cannábicos</div>
        <div style="background:#0C1008;border:1px solid rgba(245,158,11,0.2);border-radius:14px;padding:28px">
          <label style="display:block;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(245,158,11,0.5);margin-bottom:8px">Clave de acceso</label>
          <input id="red-pwd" type="password" placeholder="••••••••"
            style="width:100%;box-sizing:border-box;background:#060A06;border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:12px 14px;font-size:16px;color:white;font-family:'Inter',sans-serif;outline:none;letter-spacing:.15em"
          />
          <div id="red-err" style="font-size:12px;color:#ef4444;margin-top:8px;min-height:18px"></div>
          <button id="red-btn"
            style="width:100%;margin-top:4px;padding:14px;background:#F59E0B;color:#060A06;border:none;border-radius:8px;font-size:14px;font-weight:800;cursor:pointer;font-family:'Inter',sans-serif;letter-spacing:.03em">
            Ingresar →
          </button>
        </div>
        <div style="margin-top:20px;font-size:11px;color:rgba(245,158,11,0.25)">redclubes.ar</div>
      </div>
    </div>`;

  const input = document.getElementById('red-pwd');
  const btn   = document.getElementById('red-btn');
  const err   = document.getElementById('red-err');

  function tryLogin() {
    if (input.value === 'redclub26') {
      sessionStorage.setItem('red-auth', '1');
      const hash = location.hash.replace('#', '');
      goTo(SCREENS.includes(hash) ? hash : 'red-dashboard');
    } else {
      err.textContent = 'Clave incorrecta';
      input.style.borderColor = '#ef4444';
      input.value = '';
      setTimeout(() => { err.textContent = ''; input.style.borderColor = 'rgba(245,158,11,0.3)'; }, 2000);
    }
  }

  btn.addEventListener('click', tryLogin);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
  setTimeout(() => input.focus(), 100);
}

// Gate: require auth
if (sessionStorage.getItem('red-auth') === '1') {
  const hash = location.hash.replace('#', '');
  goTo(SCREENS.includes(hash) ? hash : 'red-dashboard');
} else {
  showLogin();
}
