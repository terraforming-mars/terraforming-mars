export namespace SoundManager {
  enum NOTES {
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
  };

  function setupGainNode(audioCtx: AudioContext, time: number) {
    time += audioCtx.currentTime;

    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(1, time + 0.01);

    return gainNode;
  }

  function setupOscillator(audioCtx: AudioContext, frequency: number, gainNode: GainNode) {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);

    return oscillator;
  }

  function createAudioContext() {
    const audioCtx = window.AudioContext || (window as any).webkitAudioContext ? new AudioContext() : undefined;

    if (audioCtx === undefined) console.log('This web browser doesn\'t support Web Audio API');
    return audioCtx;
  }

  function playSound(audioCtx: AudioContext, frequency: number, time: number, len: number) {
    const gainNode = setupGainNode(audioCtx, time);
    const oscillator = setupOscillator(audioCtx, frequency, gainNode);

    oscillator.start(time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + len);
    oscillator.stop(time + len);
  }

  export function playActivePlayerSound() {
    const audioCtx = createAudioContext();
    if (audioCtx === undefined) return;

    audioCtx.resume().then(() => {
      playSound(audioCtx, NOTES.C5, 0, 0.4);
      playSound(audioCtx, NOTES.A4, 0.2, 0.4);
    });
  }
}
