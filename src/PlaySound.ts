window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
if (!window.AudioContext) { 
    console.log("当前浏览器不支持Web Audio API"); 
}

// 创建新的音频上下文接口
let audioCtx = new AudioContext();
let arrFrequency = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];

let frequency = function(index: number){
    if(!index){
        index = 0;
    }
    return  arrFrequency[index];
}

function playSound (frequency: number , time: number , len: number) {
    time = audioCtx.currentTime + time;
    let  oscillator = audioCtx.createOscillator();
    let  gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(1, time + 0.01);
    oscillator.start(time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + len);
    oscillator.stop(time + len);
};

export function playTips(){
    playSound(frequency(10),0,0.8);
    playSound(frequency(8),0.6,0.8);
}