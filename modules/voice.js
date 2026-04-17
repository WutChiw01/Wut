/**
 * voice.js โ€” Speech Synthesis Module
 * Provides eyes-free feedback for measurements and status changes.
 */

export class VoiceAssistant {
  constructor() {
    this.enabled = false;
    this.synth = window.speechSynthesis;
    this.voice = null;
    
    // Attempt to find a Thai voice
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      this.voice = voices.find(v => v.lang.includes('th')) || voices[0];
    };

    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }

  setEnabled(val) {
    this.enabled = !!val;
    if (this.enabled) {
      this.speak('เน€เธเธดเธ”เธเธฒเธฃเธเนเธงเธขเน€เธซเธฅเธทเธญเธ—เธฒเธเน€เธชเธตเธขเธ');
    }
  }

  speak(text) {
    if (!this.enabled || !this.synth) return;
    
    // Cancel any pending speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) utterance.voice = this.voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'th-TH';
    
    this.synth.speak(utterance);
  }

  speakMeasurement(label, value, unit = 'เน€เธกเธ•เธฃ') {
    const text = `เธเธธเธ” ${label} : ${value} ${unit}`;
    this.speak(text);
  }

  speakQuick(value, unit = 'เน€เธกเธ•เธฃ') {
    this.speak(`${value} ${unit}`);
  }
}
