export namespace SoundManager {
  enum Notes {
    G3 = 196.00,
    A3 = 220.00,
    B3 = 246.94,
    C4 = 261.63,
    D4 = 293.66,
    E4 = 329.63,
    F4 = 349.23,
    G4 = 392.00,
    A4 = 440.00,
    B4 = 493.88,
    C5 = 523.25,
    D5 = 587.33,
    E5 = 659.25,
    F5 = 698.46,
    G5 = 783.99,
    A5 = 880.00,
    B5 = 987.77,
    C6 = 1046.50,
  }

  function setupGainNode(audioCtx: AudioContext, time: number, value: number) {
    time += audioCtx.currentTime;

    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(value, time + 0.01);

    return gainNode;
  }

  function setupOscillator(audioCtx: AudioContext, frequency: number, gainNode: GainNode) {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);

    return oscillator;
  }

  function playSound(audioCtx: AudioContext, frequency: number, time: number, len: number, gainValue: number = 1) {
    const gainNode = setupGainNode(audioCtx, time, gainValue);
    const oscillator = setupOscillator(audioCtx, frequency, gainNode);

    oscillator.start(time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + len);
    oscillator.stop(time + len);
  }

  function playInContext(cb: (audioCtx: AudioContext) => void) {
    if (!window.AudioContext) {
      console.log('This web browser does not support Web Audio API');
      return;
    }

    const audioCtx = new AudioContext();

    audioCtx.resume().then(() => {
      cb(audioCtx);
    });
  }

  export function playActivePlayerSound() {
    playInContext((audioCtx) => {
      playSound(audioCtx, Notes.C5, 0, 0.4);
      playSound(audioCtx, Notes.A4, 0.2, 0.4);
    });
  }

  export function newLog() {
    playInContext((audioCtx) => {
      playSound(audioCtx, Notes.G3, 0.02, 0.05, .1);
    });
  }
}
