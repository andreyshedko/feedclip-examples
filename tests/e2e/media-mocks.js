(() => {
  const state = { stopCalls: 0 };
  window.__FEEDCLIP_EXAMPLE_E2E__ = state;

  class FakeTrack extends EventTarget {
    constructor(kind) {
      super();
      this.kind = kind;
    }
    stop() {}
  }

  class FakeStream {
    constructor(tracks = [new FakeTrack("video")]) {
      this.tracks = tracks;
    }
    getTracks() {
      return this.tracks;
    }
    getVideoTracks() {
      return this.tracks.filter((track) => track.kind === "video");
    }
    getAudioTracks() {
      return this.tracks.filter((track) => track.kind === "audio");
    }
  }

  Object.defineProperty(window, "MediaStream", { configurable: true, value: FakeStream });
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: {
      getDisplayMedia: async () => new FakeStream(),
      getUserMedia: async (constraints) =>
        new FakeStream([
          new FakeTrack("video"),
          ...(constraints?.audio ? [new FakeTrack("audio")] : []),
        ]),
    },
  });
  Object.defineProperty(HTMLMediaElement.prototype, "srcObject", {
    configurable: true,
    get() {
      return this.__feedclipSrcObject ?? null;
    },
    set(value) {
      this.__feedclipSrcObject = value;
    },
  });
  HTMLMediaElement.prototype.play = async () => undefined;
  HTMLMediaElement.prototype.load = () => undefined;

  class FakeMediaRecorder {
    static isTypeSupported() {
      return true;
    }
    constructor(_stream, options = {}) {
      this.mimeType = options.mimeType || "video/webm";
      this.state = "inactive";
      this.ondataavailable = null;
      this.onerror = null;
      this.onstop = null;
    }
    start() {
      this.state = "recording";
    }
    pause() {
      this.state = "paused";
    }
    resume() {
      this.state = "recording";
    }
    stop() {
      state.stopCalls += 1;
      this.state = "inactive";
      this.ondataavailable?.({
        data: new Blob(["example-browser-video"], { type: this.mimeType }),
      });
      window.setTimeout(() => this.onstop?.(), 0);
    }
  }

  Object.defineProperty(window, "MediaRecorder", {
    configurable: true,
    value: FakeMediaRecorder,
  });
})();
