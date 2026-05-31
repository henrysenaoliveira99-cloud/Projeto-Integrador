import { auth, db } from "./js/firebase-config.js";
    import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
    import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

    /* ── STEP NAVIGATION ── */
    let currentStep = 0;
    const totalSteps = 3;

    window.nextStep = function() {
      if (!validateStep(currentStep)) return;
      currentStep++;
      updateUI();
    };

    window.prevStep = function() {
      currentStep--;
      updateUI();
    };

    function updateUI() {
      document.querySelectorAll('.form-step').forEach((s, i) => {
        s.classList.toggle('active', i === currentStep);
      });
      document.querySelectorAll('.step-dot').forEach((d, i) => {
        d.classList.remove('active', 'done');
        if (i === currentStep) d.classList.add('active');
        if (i < currentStep) d.classList.add('done');
      });
      const pct = ((currentStep + 1) / totalSteps * 100).toFixed(0);
      document.getElementById('progressBar').style.width = pct + '%';
      document.getElementById('stepLabel').textContent = `PASSO ${currentStep + 1} DE ${totalSteps}`;
    }

    /* ── VALIDATION ── */
    function validateStep(step) {
      let ok = true;

      if (step === 0) {
        ok = validate('f-nome', 'nome', v => v.trim().split(' ').length >= 2) && ok;
        ok = validate('f-nascimento', 'nascimento', v => v !== '') && ok;
        ok = validate('f-cpf', 'cpf', v => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v)) && ok;
        ok = validate('f-telefone', 'telefone', v => v.replace(/\D/g,'').length >= 10) && ok;
      }

      if (step === 1) {
        ok = validate('f-cep', 'cep', v => /^\d{5}-\d{3}$/.test(v)) && ok;
        ok = validate('f-endereco', 'endereco', v => v.trim().length > 5) && ok;
      }

      if (step === 2) {
        ok = validate('f-email', 'email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) && ok;
        ok = validate('f-senha', 'senha', v => v.length >= 6) && ok;
        ok = validate('f-confirma', 'confirma', v => v === document.getElementById('senha').value) && ok;
      }

      return ok;
    }

    function validate(fieldId, inputId, check) {
      const field = document.getElementById(fieldId);
      const val   = document.getElementById(inputId).value;
      const valid = check(val);
      field.classList.toggle('invalid', !valid);
      return valid;
    }

    /* ── MASKS ── */
    document.getElementById('cpf').addEventListener('input', function() {
      let v = this.value.replace(/\D/g,'').slice(0,11);
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      this.value = v;
    });

    document.getElementById('telefone').addEventListener('input', function() {
      let v = this.value.replace(/\D/g,'').slice(0,11);
      if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, '($1) $2');
      this.value = v;
    });

    document.getElementById('cep').addEventListener('input', function() {
      let v = this.value.replace(/\D/g,'').slice(0,8);
      if (v.length > 5) v = v.replace(/(\d{5})(\d)/, '$1-$2');
      this.value = v;
      if (v.replace('-','').length === 8) fetchCep(v.replace('-',''));
    });

    async function fetchCep(cep) {
      try {
        const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const d = await r.json();
        if (!d.erro) {
          document.getElementById('endereco').value = `${d.logradouro}, ${d.bairro}`;
          document.getElementById('cidade').value   = `${d.localidade} - ${d.uf}`;
        }
      } catch {}
    }

    /* ── PASSWORD STRENGTH ── */
    window.checkPwd = function(v) {
      const bar  = document.getElementById('pwdBar');
      const hint = document.getElementById('pwdHint');
      const levels = [
        { min: 0,  w: '20%',  bg: '#ff4444', msg: 'Muito fraca' },
        { min: 4,  w: '40%',  bg: '#ff8800', msg: 'Fraca' },
        { min: 6,  w: '60%',  bg: '#ffcc00', msg: 'Razoável' },
        { min: 9,  w: '80%',  bg: '#88cc00', msg: 'Boa' },
        { min: 12, w: '100%', bg: '#00cc66', msg: 'Forte' },
      ];
      const lvl = [...levels].reverse().find(l => v.length >= l.min) || levels[0];
      bar.style.width  = v.length ? lvl.w  : '0';
      bar.style.background = lvl.bg;
      hint.textContent = v.length ? lvl.msg : 'Digite sua senha';
    };

    /* ── SUBMIT ── */
    document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateStep(2)) return;

      const btn = document.getElementById('submitBtn');
      btn.classList.add('loading');

      try {
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        const { user } = await createUserWithEmailAndPassword(auth, email, senha);

        await setDoc(doc(db, "usuarios", user.uid), {
          nome:       document.getElementById('nome').value,
          nascimento: document.getElementById('nascimento').value,
          cpf:        document.getElementById('cpf').value,
          cep:        document.getElementById('cep').value,
          endereco:   document.getElementById('endereco').value,
          cidade:     document.getElementById('cidade').value,
          telefone:   document.getElementById('telefone').value,
          email,
          criadoEm: new Date()
        });

        document.getElementById('cadastroForm').style.display   = 'none';
        document.querySelector('.steps-indicator').style.display = 'none';
        document.querySelector('.login-link').style.display      = 'none';
        document.getElementById('successState').classList.add('visible');

      } catch (err) {
        console.error(err);
        const msgs = {
          'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
          'auth/weak-password': 'Senha muito fraca.',
          'auth/invalid-email': 'E-mail inválido.',
        };
        alert(msgs[err.code] || 'Erro ao cadastrar. Tente novamente.');
      } finally {
        btn.classList.remove('loading');
      }
    });
