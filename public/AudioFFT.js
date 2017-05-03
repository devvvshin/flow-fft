class AudioFFT {
  constructor(frequeuncy) {
    this.DATA_SIZE = frequeuncy || 1024;
    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";

    this.context = new (window.AudioContext ||
                   window.webAudioContext ||
                   window.webkitAudioContext)();
    this.processor = this.context.createScriptProcessor(this.DATA_SIZE);
    this.processor.connect(this.context.destination);

    this.analyser = this.context.createAnalyser();
    this.analyser.connect(this.processor);
    this.data = new Uint8Array(this.analyser.frequencyBinCount);

    this.listeners = [];
  }

  play() {
    const { audio, context, processor, analyser, listeners, data } = this;

    let source = context.createMediaElementSource(audio);
    audio.onended = () => {
      source.disconnect();
      source = null;

      processor.onaudioprocess = null;
    }

    source.connect(analyser);
    source.connect(context.destination);

    processor.onaudioprocess = () => {
      analyser.getByteTimeDomainData(data);
      listeners.forEach((listener) => listener(data));
    }

    audio.play();
  }

  stop() {
    this.audio.stop();
  }

  addEventListener(listener) {
    this.listeners.push(listener);
  }

  removeEventListener(listener) {
    this.listeners.forEach((listener_, i) => {
      if(listener_ == listener) {
        this.listeners.splice(i, 1);
      }
    })
  }

  load(url){
    const { audio, context } = this;
    return new Promise((resolve, reject) => {

      audio.oncanplay = () => {
        resolve();
      };

      audio.onerror = () => {
        reject();
      }

      audio.src = url;
    })
  }
}
