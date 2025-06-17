const grid = document.getElementById("grid");
const puntosEl = document.getElementById("puntos");
const tiempoEl = document.getElementById("tiempo");
const inicioBtn = document.getElementById("inicioBtn");

const sonidoAcierto = document.getElementById("sonidoAcierto");
const sonidoError = document.getElementById("sonidoError");
const sonidoInicio = document.getElementById("sonidoInicio");

let botones = [];
let puntos = 0;
let tiempo = 30;
let tiempoTotal = 30;
let juegoActivo = false;
let encendido = -2;
let intervalo;
let cuentaRegresiva;

let velocidad = 700;

function crearBotones() {
  for (let i = 0; i < 9; i++) {
    const btn = document.createElement("button");
    btn.classList.add("boton");
    btn.dataset.index = i;
    btn.addEventListener("click", () => manejarToque(i, btn));
    grid.appendChild(btn);
    botones.push(btn);
  }
}

function manejarToque(indice, btn) {
  if (!juegoActivo) return;
  if (indice === encendido) {
    puntos++;
    sonidoAcierto.currentTime = 0;
    sonidoAcierto.play();
    btn.classList.add("correcto");
  } else {
    puntos -= 0;
    sonidoError.currentTime = 0;
    sonidoError.play();
    btn.classList.add("incorrecto");
  }
  puntosEl.textContent = `Puntos: ${puntos}`;
  setTimeout(() => {
    btn.classList.remove("correcto", "incorrecto");
  }, 300);
}

function encenderAleatorio() {
  botones.forEach(btn => btn.classList.remove("activo"));
  const nuevo = Math.floor(Math.random() * botones.length);
  botones[nuevo].classList.add("activo");
  encendido = nuevo;
}

function actualizarVelocidad() {
  const tiempoTranscurrido = tiempoTotal - tiempo;
  let nuevaVelocidad = 700 - (tiempoTranscurrido * 10);
  return Math.max(nuevaVelocidad, 200);
}

function loopJuego() {
  if (!juegoActivo) return;

  encenderAleatorio();
  velocidad = actualizarVelocidad();
  clearTimeout(intervalo);
  intervalo = setTimeout(loopJuego, velocidad);
}

function iniciarJuego() {
  sonidoInicio.play();
  puntos = 0;
  tiempo = 30;
  juegoActivo = true;
  puntosEl.textContent = "Puntos: 0";
  tiempoEl.textContent = "Tiempo: 30";
  inicioBtn.disabled = true;

  velocidad = actualizarVelocidad();
  loopJuego();
  cuentaRegresiva = setInterval(() => {
    tiempo--;
    tiempoEl.textContent = `Tiempo: ${tiempo}`;
    if (tiempo <= 0) {
      terminarJuego();
    }
  }, 1000);
}

function terminarJuego() {
  juegoActivo = false;
  clearInterval(intervalo);
  clearInterval(cuentaRegresiva);
  botones.forEach(btn => btn.classList.remove("activo"));
  encendido = -1;
  inicioBtn.disabled = false;

  const nombre = prompt("Ingresa tu nombre:");
  if (nombre && typeof guardarPuntaje === "function") {
    guardarPuntaje(nombre, puntos);
  }
  mostrarRankingEnPantalla();
}

function mostrarRankingEnPantalla() {
  const lista = document.getElementById("rankingLista");
  if (!lista || typeof obtenerRanking !== "function") return;

  obtenerRanking().then(top10 => {
    lista.innerHTML = "";
    top10.forEach((jugador, i) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${i + 1}</td>
        <td>${jugador.nombre}</td>
        <td>${jugador.puntos}</td>
      `;
      lista.appendChild(fila);
    });
  });
}

crearBotones();
inicioBtn.addEventListener("click", iniciarJuego);
document.addEventListener("DOMContentLoaded", () => {
  mostrarRankingEnPantalla();
});

