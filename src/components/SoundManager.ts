export namespace SoundManager {
  const frequencies = [
    196.00, // G3
    220.00, // A3
    246.94, // B3
    261.63, // C4
    293.66, // D4
    329.63, // E4
    349.23, // F4
    392.00, // G4
    440.00, // A4
    493.88, // B4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    698.46, // F5
    783.99, // G5
    880.00, // A5
    987.77, // B5
    1046.50, // C6
  ];
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
      playSound(audioCtx, frequencies[10], 0, 0.4);
      playSound(audioCtx, frequencies[8], 0.2, 0.4);
    });
  }
}
