import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {

  apiKey: "AIzaSyDCkT9dE4Cy-AlbAQ1Y5jZ1DzPcFgF1JyA",

  authDomain: "projeto-integrador-f35bb.firebaseapp.com",

  projectId: "projeto-integrador-f35bb",

  storageBucket: "projeto-integrador-f35bb.firebasestorage.app",

  messagingSenderId: "507150247467",

  appId: "1:507150247467:web:474297d608f3c95ac4ec6e"

};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

// Exporta
export { auth, db };