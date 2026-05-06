/* =====================
   NOVO STILO – script.js
   ===================== */

// ── Hamburger ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Fechar menu ao clicar em link
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Navbar scroll ──────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.5)' : '';
});

// ── Tabs Serviços ──────────────────────────────────
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ── Barbeiro ────────────────────────────────────────
let selectedBarbeiro = 'Anderson Mendes';
document.querySelectorAll('.barbeiro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.barbeiro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedBarbeiro = btn.dataset.name;
    updateSummary();
  });
});

// ── Horário ─────────────────────────────────────────
let hours = 14, mins = 0;

function pad(n) { return String(n).padStart(2, '0'); }

function updateClock() {
  document.getElementById('horaDisplay').textContent = `${pad(hours)}:${pad(mins)}`;
  updateSummary();
}

window.changeHour = function(dir) {
  hours = (hours + dir + 24) % 24;
  updateClock();
};

window.changeMin = function(dir) {
  mins = (mins + dir * 30 + 60) % 60;
  updateClock();
};

// ── Calendário ──────────────────────────────────────
let calYear, calMonth, selectedDay = null;

(function initCal() {
  const now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();
  renderCal();
})();

function renderCal() {
  const container = document.getElementById('calendario');
  const now = new Date();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  let html = `
    <div class="cal-header">
      <button onclick="prevMonth()">&#8249;</button>
      <span>${monthNames[calMonth]} ${calYear}</span>
      <button onclick="nextMonth()">&#8250;</button>
    </div>
    <div class="cal-grid">
      <div class="cal-day-label">D</div>
      <div class="cal-day-label">S</div>
      <div class="cal-day-label">T</div>
      <div class="cal-day-label">Q</div>
      <div class="cal-day-label">Q</div>
      <div class="cal-day-label">S</div>
      <div class="cal-day-label">S</div>
  `;

  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === now.getDate() && calMonth === now.getMonth() && calYear === now.getFullYear();
    const isSel   = d === selectedDay && calMonth === now.getMonth() && calYear === now.getFullYear();
    let cls = 'cal-day';
    if (isToday) cls += ' today';
    if (isSel)   cls += ' selected';
    html += `<div class="${cls}" onclick="selectDay(${d})">${d}</div>`;
  }

  html += `</div>`;
  container.innerHTML = html;
}

window.prevMonth = function() {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCal();
};

window.nextMonth = function() {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCal();
};

window.selectDay = function(d) {
  selectedDay = d;
  renderCal();
  updateSummary();
};

// ── Summary ─────────────────────────────────────────
function updateSummary() {
  const el = document.getElementById('agSummary');
  if (!selectedDay) { el.textContent = ''; return; }
  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  el.textContent = `${selectedBarbeiro} – ${pad(selectedDay)} ${monthNames[calMonth]} ${calYear} às ${pad(hours)}:${pad(mins)}`;
}

// ── Agendar ─────────────────────────────────────────
document.getElementById('btnAgendar').addEventListener('click', () => {
  if (!selectedDay) {
    showToast('⚠️  Selecione uma data no calendário!');
    return;
  }
  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  showToast(`✅  Agendamento confirmado!\n${selectedBarbeiro} – ${pad(selectedDay)} ${monthNames[calMonth]} às ${pad(hours)}:${pad(mins)}`);
});

// ── Login Form ────────────────────────────────────
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast('✅  Login realizado com sucesso!');
});

// ── Toast ────────────────────────────────────────
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// ── Scroll reveal (simples) ──────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.servico-card, .social-card, .ag-card, .sobre-right p').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

function Login() {
  let nome = document.getElementById("input-nome-usuario")
  let senha = document.getElementById("input-senha-usuario")

  fetch("https://api.site.com/algumacoisa", {
    method: "POST",
    headers: {
      // Se precisar de header
    },
    body: {
      name: nome.value,
      password: senha.value
    }
  }).then((response) => {
    if(!response.ok) {
      alert("Credenciais inválidas")
      return
    }
    window.location.href="outrapágina"
  })
}