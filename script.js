import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =====================
   NOVO STILO – script.js
   ===================== */

// ── Hamburger ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Fechar menu ao clicar em link
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── Navbar scroll ──────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.5)' : '';
});

// ── Tabs Serviços ──────────────────────────────────
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = document.getElementById('tab-' + btn.dataset.tab);
    if (!content) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    content.classList.add('active');
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
  const horaDisplay = document.getElementById('horaDisplay');
  if (horaDisplay) horaDisplay.textContent = `${pad(hours)}:${pad(mins)}`;
  updateSummary();
}

function changeHour(dir) {
  hours = (hours + dir + 24) % 24;
  updateClock();
}

function changeMin(dir) {
  mins = (mins + dir * 30 + 60) % 60;
  updateClock();
}

// Listeners dos botões de hora/minuto (substituem os onclick inline)
const hourUp   = document.getElementById('hourUp');
const hourDown = document.getElementById('hourDown');
const minUp    = document.getElementById('minUp');
const minDown  = document.getElementById('minDown');

if (hourUp)   hourUp.addEventListener('click',   () => changeHour(1));
if (hourDown) hourDown.addEventListener('click', () => changeHour(-1));
if (minUp)    minUp.addEventListener('click',    () => changeMin(1));
if (minDown)  minDown.addEventListener('click',  () => changeMin(-1));

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
  if (!container) return;
  const now = new Date();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  let html = `
    <div class="cal-header">
      <button id="calPrev">&#8249;</button>
      <span>${monthNames[calMonth]} ${calYear}</span>
      <button id="calNext">&#8250;</button>
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
    html += `<div class="${cls}" data-day="${d}">${d}</div>`;
  }

  html += `</div>`;
  container.innerHTML = html;

  // Listeners do calendário (sem onclick inline)
  container.querySelector('#calPrev')?.addEventListener('click', prevMonth);
  container.querySelector('#calNext')?.addEventListener('click', nextMonth);
  container.querySelectorAll('.cal-day:not(.empty)').forEach(el => {
    el.addEventListener('click', () => selectDay(Number(el.dataset.day)));
  });
}

function prevMonth() {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCal();
}

function nextMonth() {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCal();
}

function selectDay(d) {
  selectedDay = d;
  renderCal();
  updateSummary();
}

// ── Summary ─────────────────────────────────────────
function updateSummary() {
  const el = document.getElementById('agSummary');
  if (!el) return;
  if (!selectedDay) { el.textContent = ''; return; }
  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  el.textContent = `${selectedBarbeiro} – ${pad(selectedDay)} ${monthNames[calMonth]} ${calYear} às ${pad(hours)}:${pad(mins)}`;
}

// ── Agendar ─────────────────────────────────────────
const btnAgendar = document.getElementById('btnAgendar');
if (btnAgendar) {
  btnAgendar.addEventListener('click', () => {
    if (!selectedDay) {
      showToast('⚠️  Selecione uma data no calendário!');
      return;
    }
    const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    showToast(`✅  Agendamento confirmado!\n${selectedBarbeiro} – ${pad(selectedDay)} ${monthNames[calMonth]} às ${pad(hours)}:${pad(mins)}`);
  });
}

// ── Modal de login ─────────────────────────────────
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.classList.add('open');
  const emailInput = document.getElementById('loginEmail');
  if (emailInput) emailInput.focus();
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.remove('open');
}

// Botão LOGIN na navbar
const loginNavBtn = document.getElementById('loginNavBtn');
if (loginNavBtn) {
  loginNavBtn.addEventListener('click', openLoginModal);
}

// Botão fechar (X) do modal
const modalCloseBtn = document.getElementById('modalCloseBtn');
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeLoginModal);
}

// Fechar ao clicar no backdrop
const modalBackdrop = document.getElementById('modalBackdrop');
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeLoginModal);
}

// Fechar com Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLoginModal();
});

// ── Login Form ────────────────────────────────────
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      closeLoginModal();
      showToast('✅ Login realizado com sucesso!');
    } catch (error) {
      console.error(error);

      if (error.code === 'auth/user-not-found') {
        showToast('❌ Usuário não encontrado!');
      } else if (error.code === 'auth/wrong-password') {
        showToast('❌ Senha incorreta!');
      } else if (error.code === 'auth/invalid-email') {
        showToast('❌ E-mail inválido!');
      } else if (error.code === 'auth/invalid-credential') {
        showToast('❌ E-mail ou senha incorretos!');
      } else {
        showToast('❌ Erro ao fazer login!');
      }
    }
  });
}

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

// ── Scroll reveal ──────────────────────────────────
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

// ── Usuário logado ────────────────────────────────
onAuthStateChanged(auth, (user) => {
  const userStatus  = document.getElementById('userStatus');
  const cadastro    = document.getElementById('cadastro');
  const loginNavBtn = document.getElementById('loginNavBtn');

  if (user) {
    if (cadastro)    cadastro.style.display    = 'none';
    if (loginNavBtn) loginNavBtn.style.display = 'none';
    if (!userStatus) return;

    console.log("Usuário logado:", user.email);

    userStatus.innerHTML = `
      <span style="color:#FFD700;font-weight:bold;margin-right:10px;">
        👤 ${user.email}
      </span>
      <button id="logoutBtn" style="
        padding:6px 12px;border:none;border-radius:6px;
        cursor:pointer;background:#FFD700;font-weight:bold;
      ">SAIR</button>
    `;

    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await signOut(auth);
      showToast('👋 Logout realizado!');
    });

  } else {
    console.log("Nenhum usuário logado");
    if (cadastro)    cadastro.style.display    = 'block';
    if (loginNavBtn) loginNavBtn.style.display = '';
    if (!userStatus) return;

    userStatus.innerHTML = `<span style="color:white;">Não logado</span>`;
  }
});

// =====================
// ACESSIBILIDADE
// =====================

const FONTE_MIN    = 12;
const FONTE_MAX    = 24;
const FONTE_PADRAO = 16;

function alterarFonte(delta) {
  const tamanhoAtual = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const novoTamanho  = Math.min(FONTE_MAX, Math.max(FONTE_MIN, tamanhoAtual + delta));
  document.documentElement.style.fontSize = novoTamanho + 'px';
}

function resetarFonte() {
  document.documentElement.style.fontSize = FONTE_PADRAO + 'px';
}

const FILTROS = {
  protanopia:   'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'p\'><feColorMatrix type=\'matrix\' values=\'0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0\'/></filter></svg>#p")',
  deuteranopia: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'d\'><feColorMatrix type=\'matrix\' values=\'0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0\'/></filter></svg>#d")',
  tritanopia:   'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'t\'><feColorMatrix type=\'matrix\' values=\'0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0\'/></filter></svg>#t")',
};

function aplicarFiltro(tipo) {
  document.body.style.filter = FILTROS[tipo] || '';
}

function removerFiltros() {
  document.body.style.filter = '';
}

// Listeners do menu de acessibilidade (substituem os onclick inline)
const btnAcessibilidade  = document.getElementById('acessibilidade-btn');
const menuAcessibilidade = document.getElementById('acessibilidade-menu');

if (btnAcessibilidade && menuAcessibilidade) {
  btnAcessibilidade.addEventListener('click', () => {
    const aberto = menuAcessibilidade.style.display === 'block';
    menuAcessibilidade.style.display = aberto ? 'none' : 'block';
    btnAcessibilidade.setAttribute('aria-expanded', String(!aberto));
  });

  document.addEventListener('click', (e) => {
    if (
      menuAcessibilidade.style.display === 'block' &&
      !menuAcessibilidade.contains(e.target) &&
      !btnAcessibilidade.contains(e.target)
    ) {
      menuAcessibilidade.style.display = 'none';
      btnAcessibilidade.setAttribute('aria-expanded', 'false');
    }
  });
}

document.getElementById('btnAumentarFonte')?.addEventListener('click',  () => alterarFonte(2));
document.getElementById('btnDiminuirFonte')?.addEventListener('click',  () => alterarFonte(-2));
document.getElementById('btnResetarFonte')?.addEventListener('click',   () => resetarFonte());
document.getElementById('btnProtanopia')?.addEventListener('click',     () => aplicarFiltro('protanopia'));
document.getElementById('btnDeuteranopia')?.addEventListener('click',   () => aplicarFiltro('deuteranopia'));
document.getElementById('btnTritanopia')?.addEventListener('click',     () => aplicarFiltro('tritanopia'));
document.getElementById('btnRemoverFiltros')?.addEventListener('click', () => removerFiltros());
