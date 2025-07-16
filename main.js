const xevEmitter = require("xev-emitter")(process.stdin);
const Speaker = require("speaker");

const speaker = new Speaker({
  channels: 1,
  bitDepth: 16,
  sampleRate: 44100
});

const sampleRate = 44100;
const bufferDuration = 0.1;
const samplesPerBuffer = Math.floor(sampleRate * bufferDuration);

const keyToFreq = {
  a: 261.63, s: 293.66, d: 329.63, f: 349.23,
  g: 392.00, h: 440.00, j: 493.88, k: 523.25
};

const cumpleaños = [
  { freq: 261.63, duracion: 400 },
  { freq: 261.63, duracion: 400 },
  { freq: 293.66, duracion: 600 },
  { freq: 261.63, duracion: 400 },
  { freq: 349.23, duracion: 400 },
  { freq: 329.63, duracion: 800 },

  { freq: 261.63, duracion: 400 },
  { freq: 261.63, duracion: 400 },
  { freq: 293.66, duracion: 600 },
  { freq: 261.63, duracion: 400 },
  { freq: 392.00, duracion: 400 },
  { freq: 349.23, duracion: 800 },

  { freq: 261.63, duracion: 400 },
  { freq: 261.63, duracion: 400 },
  { freq: 523.25, duracion: 600 },
  { freq: 440.00, duracion: 400 },
  { freq: 349.23, duracion: 400 },
  { freq: 329.63, duracion: 400 },
  { freq: 293.66, duracion: 800 },

  { freq: 466.16, duracion: 400 },
  { freq: 466.16, duracion: 400 },
  { freq: 440.00, duracion: 600 },
  { freq: 349.23, duracion: 400 },
  { freq: 392.00, duracion: 400 },
  { freq: 349.23, duracion: 800 }
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
function reproducirCancion(notas) {
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

    const nota = notas[i++];
    activeNotes["auto"] = nota.freq;

    setTimeout(() => {
      delete activeNotes["auto"];
      delete phaseMap["auto"];
      setTimeout(siguiente, 50);
    }, nota.duracion);
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

const acordes = [
  [
    { key: "acorde1_1", freq: 261.63 },
    { key: "acorde1_2", freq: 329.63 },
    { key: "acorde1_3", freq: 392.00 }
  ],
  [
    { key: "acorde2_1", freq: 349.23 },
    { key: "acorde2_2", freq: 440.00 },
    { key: "acorde2_3", freq: 523.25 }
  ],
  [
    { key: "acorde3_1", freq: 392.00 },
    { key: "acorde3_2", freq: 493.88 },
    { key: "acorde3_3", freq: 587.33 }
  ],
  [
    { key: "acorde4_1", freq: 440.00 },
    { key: "acorde4_2", freq: 523.25 },
    { key: "acorde4_3", freq: 659.25 }
  ]
];
function reproducirAcordes(acordes, duracion = 1000) {
  modo = "auto";
  let i = 0;

  function siguiente() {
    if (i >= acordes.length) {
      modo = "menu";
      activeNotes = {};
      console.log("\n🎶 Fin de los acordes.");
      mostrarMenu();
      return;
    }

    const acorde = acordes[i++];
    for (const nota of acorde) {
      activeNotes[nota.key] = nota.freq;
    }

    setTimeout(() => {
      for (const nota of acorde) {
        delete activeNotes[nota.key];
        delete phaseMap[nota.key];
      }
      setTimeout(siguiente, 200); // pequeño espacio entre acordes
    }, duracion);
  }

  console.clear();
  console.log("🎵 Reproduciendo acordes...\n");
  siguiente();
}



// 🧭 Menú
function mostrarMenu() {
  modo = "menu";
  activeNotes = {};
  phaseMap = {};
  console.clear();
  console.log("🎛️  Menú principal");
  console.log("[1] Usar sintetizador");
  console.log("[2] Reproducir 'Cumpleaños feliz'");
  console.log("[3] Reproducir acordes");
  console.log("\nPresiona 1, 2 o 3 para seleccionar.\n");
}


// 🎯 Eventos de teclado
xevEmitter.on("KeyPress", (key) => {
  const k = key.toLowerCase();

  if (modo === "menu") {
    if (k === "1") iniciarSintetizador();
    else if (k === "2") reproducirCancion(cumpleaños);
    else if (k === "3") reproducirAcordes(acordes)
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
