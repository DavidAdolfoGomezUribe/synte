const readline = require("readline");
const keypress = require("keypress");
const Speaker  = require("speaker");
const tone     = require("tonegenerator");

const speaker = new Speaker({
  channels: 1,
  bitDepth: 16,
  sampleRate: 44100
});

// Mapeo de notas por tecla
const keyToFreq = {
  a: 261.63, // C4
  s: 293.66, // D4
  d: 329.63, // E4
  f: 349.23, // F4
  g: 392.00, // G4
  h: 440.00, // A4
  j: 493.88, // B4
  k: 523.25  // C5
};

// Notas de la canción de cumpleaños (en Hz)
const happyBirthday = [
  261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
  261.63, 261.63, 293.66, 261.63, 392.00, 349.23,
  261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66,
  466.16, 466.16, 440.00, 349.23, 392.00, 349.23,349.23
];

// Reproduce una nota (bloque PCM)
function playTone(freq, durationMs = 400) {
  const samples = tone({
    freq,
    lengthInSecs: durationMs / 1000,
    volume: tone.MAX_16,
    rate: 44100,
    shape: "sine"
  });
  const buf = Buffer.alloc(samples.length * 2);
  samples.forEach((v, i) => buf.writeInt16LE(v, i * 2));
  speaker.write(buf);
}

// Modo sintetizador (manual con teclado)
function startSynthMode() {
  console.clear();
  console.log("🎹 Modo sintetizador activo. Presiona teclas (a–k). Ctrl+C para salir.");
  keypress(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdin.on("keypress", (ch, key) => {
    if (key && key.ctrl && key.name === "c") process.exit();
    if (key && keyToFreq[key.name]) {
      const freq = keyToFreq[key.name];
      console.log(`🎵 Nota ${key.name.toUpperCase()} – ${freq} Hz`);
      playTone(freq);
    }
  });
}

// Reproduce la canción completa
function playBirthdaySong() {
  console.clear();
  console.log("🎶 Reproduciendo 'Cumpleaños feliz'...");
  let index = 0;

  const interval = setInterval(() => {
    if (index >= happyBirthday.length) {
      clearInterval(interval);
      console.log("🎉 Fin de la canción.");
      process.exit(); // Puedes regresar al menú si prefieres
      return;
    }
    const freq = happyBirthday[index++];
    playTone(freq, 400); // cada nota dura 400ms
  }, 450); // le damos un pequeño espacio entre notas
}

// Menú principal
function showMenu() {
  console.clear();
  console.log("🎛️  Menú principal");
  console.log("[1] Usar sintetizador");
  console.log("[2] Reproducir 'Cumpleaños feliz'");
  console.log("[Ctrl+C] Salir\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Selecciona una opción: ", (answer) => {
    rl.close();
    if (answer === "1") {
      startSynthMode();
    } else if (answer === "2") {
      playBirthdaySong();
    } else {
      console.log("❌ Opción no válida.");
      process.exit();
    }
  });
}

// Iniciar
showMenu();
