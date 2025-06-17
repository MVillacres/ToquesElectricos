import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoqM0tpAjWnYlaw2bbFcifbzGhH0k3B6c",
  authDomain: "toqueselectrico-92438.firebaseapp.com",
  databaseURL: "https://toqueselectrico-92438-default-rtdb.firebaseio.com",
  projectId: "toqueselectrico-92438",
  storageBucket: "toqueselectrico-92438.appspot.com",
  messagingSenderId: "884213774029",
  appId: "1:884213774029:web:bc94d291a8be3c1e809b84"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.guardarPuntaje = function (nombre, puntos) {
  set(ref(db, 'puntajes/' + nombre), {
    nombre: nombre,
    puntos: puntos,
    tiempo: Date.now()
  });
};

window.obtenerRanking = async function () {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, 'puntajes'));
    if (snapshot.exists()) {
      const datos = Object.values(snapshot.val());
      return datos
        .sort((a, b) => b.puntos - a.puntos)
        .slice(0, 10);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al leer el ranking:", error);
    return [];
  }
};
