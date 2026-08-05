class TTSService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    this.isSpeaking = false;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const updateVoices = () => {
      this.voices = this.synth.getVoices();
      // Select best natural sounding English voice
      this.selectedVoice = this.voices.find(v => 
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Alex") || v.name.includes("Daniel")) && v.lang.startsWith("en")
      ) || this.voices.find(v => v.lang.startsWith("en")) || this.voices[0];
    };

    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  isSupported() {
    return !!this.synth;
  }

  speak(text, { onStart, onEnd, onError } = {}) {
    if (!this.synth || !text) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any ongoing speech
    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      console.warn("TTS Error:", e);
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

export const ttsService = new TTSService();
