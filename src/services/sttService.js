class STTService {
  constructor() {
    const SpeechRecognition = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;

    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.isListening = false;

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  isSupported() {
    return !!this.recognition;
  }

  startListening({ onResult, onEnd, onError }) {
    if (!this.recognition) {
      if (onError) onError("Speech Recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    let finalTranscript = '';

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (onResult) {
        onResult({ final: finalTranscript.trim(), interim: interim.trim() });
      }
    };

    this.recognition.onerror = (event) => {
      console.warn("STT error:", event.error);
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error("STT start error:", e);
      this.isListening = false;
      if (onError) onError(e.message);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn("STT stop warning:", e);
      }
      this.isListening = false;
    }
  }
}

export const sttService = new STTService();
