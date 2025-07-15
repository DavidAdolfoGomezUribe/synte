const xevEmitter = require("xev-emitter")(process.stdin);
const Speaker = require("speaker");

const speaker = new Speaker({
  channels: 1,
  bitDepth: 16,
  sampleRate: 44100
});

const sampleRate = 44100;
const bufferDuration = 0.2;
const samplesPerBuffer = Math.floor(sampleRate * bufferDuration);

const keyToFreq = {
  a: 261.63, s: 293.66, d: 329.63, f: 349.23,
  g: 392.00, h: 440.00, j: 493.88, k: 523.25
};

const cumpleaños = [
  261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
  261.63, 261.63, 293.66, 261.63, 392.00, 349.23,
  261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66,
  466.16, 466.16, 440.00, 349.23, 392.00, 349.23
];

let activeNotes = {};
let phaseMap = {};
let modo = "menu";

function generatePolyBuffer() {
  const buf = Buffer.alloc(samplesPerBuffer * 2);
  for (let i = 0; i < samplesPerBuffer; i++) {
    let sampleValue = 0, count = 0;
    for (const key in activeNotes) {
      const freq = activeNotes[key];
      const phase = phaseMap[key] || 0;
      const inc = (2 * Math.PI * freq) / sampleRate;
      sampleValue += Math.sin(phase + i * inc);
      count++;
    }

    if (count > 0) {
      const avg = sampleValue / count;
      const intVal = Math.max(-1, Math.min(1, avg)) * 32767;
      buf.writeInt16LE(intVal, i * 2);
    }
  }

  for (const key in activeNotes) {
    const freq = activeNotes[key];
    const inc = (2 * Math.PI * freq) / sampleRate;
    phaseMap[key] = ((phaseMap[key] || 0) + samplesPerBuffer * inc) % (2 * Math.PI);
  }

  return buf;
}

setInterval(() => {
  if (modo === "synth" || modo === "auto") {
    speaker.write(generatePolyBuffer());
  }
}, bufferDuration * 1000);

// 🎶 Reproducción automática
function reproducirCancion(notas, duracion = 400) {
  modo = "auto";
  let i = 0;

  function siguiente() {
    if (i >= notas.length) {
      modo = "menu";
      activeNotes = {};
      console.log("\n🎉 Fin de la canción.");
      mostrarMenu();
      return;
    }
    const freq = notas[i++];
    activeNotes["auto"] = freq;
    setTimeout(() => {
      delete activeNotes["auto"];
      delete phaseMap["auto"];
      setTimeout(siguiente, 50);
    }, duracion);
  }

  console.clear();
  console.log("🎶 Reproduciendo 'Cumpleaños feliz'...\n");
  siguiente();
}

// 🎹 Sintetizador interactivo
function iniciarSintetizador() {
  modo = "synth";
  console.clear();
  console.log("🎹 Sintetizador polifónico activo");
  console.log("Presiona teclas A–K. Ctrl+C para salir.\n");
}

function mostrarMenu() {
  modo = "menu";
  activeNotes = {};
  phaseMap = {};
  console.clear();
  console.log("🎛️  Menú principal");
  console.log("[1] Usar sintetizador");
  console.log("[2] Reproducir 'Cumpleaños feliz'");
  console.log("\nPresiona 1 o 2 para seleccionar.\n");
}

// 🎯 Evento de teclado
xevEmitter.on("KeyPress", (key) => {
  const k = key.toLowerCase();

  if (modo === "menu") {
    if (k === "1") iniciarSintetizador();
    else if (k === "2") reproducirCancion(cumpleaños);
    else console.log("❌ Opción no válida:", k);
    return;
  }

  if (modo === "synth" && keyToFreq[k] && !activeNotes[k]) {
    activeNotes[k] = keyToFreq[k];
    console.log(`🎵 ON  ${k} – ${keyToFreq[k]} Hz`);
  }
});

xevEmitter.on("KeyRelease", (key) => {
  const k = key.toLowerCase();
  if (modo === "synth" && activeNotes[k]) {
    delete activeNotes[k];
    delete phaseMap[k];
    console.log(`🔇 OFF ${k}`);
  }
});

// ▶️ Inicio
mostrarMenu();
