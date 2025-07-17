//Estas son las libreias a usar para este proyecto
const xevEmitter = require("xev-emitter")(process.stdin); //Para captura eventos de teclado en consola
const Speaker = require("speaker"); //Esto permite reproducir audio a travez de los altavoces

//Primero se configura el speaker
const speaker = new Speaker({
  channels: 1, //esto es para audio mono
  bitDepth: 16, //esto es para represntar cada muestra de audio de 2 bytes ,dejar en 16
  sampleRate: 44100 // esto es la cantidad de veces que se generan muestras de audio por segundo
});

const sampleRate = 44100; 
const bufferDuration = 0.25; //esta variable declara cuando tiempo debe durar en memoria cada nota,editar esto segun sea conveniente
const samplesPerBuffer = Math.floor(sampleRate * bufferDuration); //esto calcula cuantas muestras caben en un buffer de 0.25s.

//este es el objeto que permite mapear las notas del teclado, peronalicelo a su antojo
const keyToFreq = {
  less: 130.81,     // C3
  z: 146.83,        // D3
  x: 164.81,        // E3
  c: 174.61,        // F3
  v: 196.00,        // G3
  b: 220.00,        // A3
  n: 246.94,        // B3
  m: 261.63,        // C4
  comma: 293.66,    // D4
  period: 329.63,   // E4
  minus: 349.23     // F4

};

//este es un array de objetos que permite tener una plantilla de como usar

// Constantes de notas
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F4 = 349.23;
const G4 = 392.00;
const A4 = 440.00;
const Bb4 = 466.16;
const B4 = 493.88;
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;


//ejemplo simple de como construir melodias simples desde el codigo
const cumpleaños = [
  { freq: C4, duracion: 500 },
  { freq: C4, duracion: 500 },
  { freq: D4, duracion: 750 },
  { freq: C4, duracion: 500 },
  { freq: F4, duracion: 500 },
  { freq: E4, duracion: 1000 },

  { freq: C4, duracion: 500 },
  { freq: C4, duracion: 500 },
  { freq: D4, duracion: 750 },
  { freq: C4, duracion: 500 },
  { freq: G4, duracion: 500 },
  { freq: F4, duracion: 1000 },

  { freq: C4, duracion: 500 },
  { freq: C4, duracion: 500 },
  { freq: C5, duracion: 750 },
  { freq: A4, duracion: 500 },
  { freq: F4, duracion: 500 },
  { freq: E4, duracion: 500 },
  { freq: D4, duracion: 1000 },

  { freq: Bb4, duracion: 500 },
  { freq: Bb4, duracion: 500 },
  { freq: A4, duracion: 750 },
  { freq: F4, duracion: 500 },
  { freq: G4, duracion: 500 },
  { freq: F4, duracion: 1000 }
];

// plantilla para creacion de acordes
const acordes = [
  {
    notas: [
      { key: "acorde1_1", freq: C4 },
      { key: "acorde1_2", freq: E4 },
      { key: "acorde1_3", freq: G4 }
    ],
    duracion: 800
  },
  {
    notas: [
      { key: "acorde2_1", freq: F4 },
      { key: "acorde2_2", freq: A4 },
      { key: "acorde2_3", freq: C5 }
    ],
    duracion: 1000
  },
  {
    notas: [
      { key: "acorde3_1", freq: G4 },
      { key: "acorde3_2", freq: B4 },
      { key: "acorde3_3", freq: D5 }
    ],
    duracion: 600
  },
  {
    notas: [
      { key: "acorde4_1", freq: A4 },
      { key: "acorde4_2", freq: C5 },
      { key: "acorde4_3", freq: E5 }
    ],
    duracion: 1200
  }
];


let activeNotes = {}; //notas que deben sonar
let phaseMap = {}; //Guarda la fase continua de cada nota activa
let modo = "menu"; //para controlar el estado del programa ("menu", "synth", "auto").


// funciones a usar 

//esta funcion permite la generacion de polyfonias 
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

function reproducirAcordes(acordes) {
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

    const acordeActual = acordes[i++];
    const { notas, duracion } = acordeActual;

    for (const nota of notas) {
      activeNotes[nota.key] = nota.freq;
    }

    setTimeout(() => {
      for (const nota of notas) {
        delete activeNotes[nota.key];
        delete phaseMap[nota.key];
      }
      setTimeout(siguiente, 10); 
    }, duracion);
  }

  console.clear();
  console.log("🎵 Reproduciendo acordes...\n");
  siguiente();
}




function reproducirCancion(notas) {
  modo = "auto";
  let i = 0;

  function siguiente() {
    if (i >= notas.length) {
      modo = "menu";
      activeNotes = {};
      
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

setInterval(() => {
  if (modo === "synth" || modo === "auto") {
    speaker.write(generatePolyBuffer());
  }
}, bufferDuration * 1000);


// 🎹 Sintetizador interactivo
function iniciarSintetizador() {
  modo = "synth";
  console.clear();
  console.log("🎹 Sintetizador polifónico activo");
  console.log("Presiona teclas < z x c v b n m , . -  Ctrl+C para salir.\n");
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
