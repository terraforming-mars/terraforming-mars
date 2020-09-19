const frequencies = [
    196.00,
    220.00,
    246.94,
    261.63,
    293.66,
    329.63,
    349.23,
    392.00,
    440.00,
    493.88,
    523.25,
    587.33,
    659.25,
    698.46,
    783.99,
    880.00,
    987.77,
    1046.50
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
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    
    return oscillator;
}

function createAudioContext() {
    const audioCtx = window.AudioContext || (window as any).webkitAudioContext ?  new AudioContext() : undefined;

    if (audioCtx === undefined) console.log("This web browser doesn't support Web Audio API");
    return audioCtx;
}

function playSound(audioCtx: AudioContext, frequency: number, time: number , len: number) {
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
