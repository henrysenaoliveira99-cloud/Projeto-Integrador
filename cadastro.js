import { auth, db } from "./js/firebase-config.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById('cadastroForm');

form.addEventListener('submit', async (e) => {

  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const nascimento = document.getElementById('nascimento').value;
  const cpf = document.getElementById('cpf').value;
  const cep = document.getElementById('cep').value;
  const endereco = document.getElementById('endereco').value;
  const telefone = document.getElementById('telefone').value;
  const email = "teste@gmail.com";
const senha = "123456";
  
  try {

    console.log("Email:", email);
console.log("Senha:", senha);

    // cria usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );

    const user = userCredential.user;

    // salva dados no Firestore
    await setDoc(doc(db, "usuarios", user.uid), {

      nome,
      nascimento,
      cpf,
      cep,
      endereco,
      telefone,
      email,
      criadoEm: new Date()

    });

    document.getElementById('msgCadastro')
      .innerText = "✅ Cadastro realizado!";

    form.reset();

  } catch (error) {

    console.error(error);

    document.getElementById('msgCadastro')
      .innerText = "❌ Erro ao cadastrar.";

  }

});