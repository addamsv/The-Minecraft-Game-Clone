class SoundModel {
    audioContext: AudioContext;

    audioBufferSourceNode: AudioBufferSourceNode;

    audioBufferSourceNodeJump: AudioBufferSourceNode;

    audioBufferSourceNodeBackground: AudioBufferSourceNode;

    walkJumpBuffer: AudioBuffer;

    backgroundBuffer: AudioBuffer;

    gainNodeBackground: GainNode;

    initSounds() {
        this.audioContext = new window.AudioContext();

        fetch('/assets/sounds/walk_jump.ogg')
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
          this.audioContext.decodeAudioData(buffer, (decoded) => {
            this.walkJumpBuffer = decoded;
          });
        });

      fetch('/assets/sounds/background.mp3')
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
          this.audioContext.decodeAudioData(buffer, (decoded) => {
            this.backgroundBuffer = decoded;
          });
        });
    }

    startWalkSound() {
      this.audioBufferSourceNode = this.audioContext.createBufferSource();
      this.audioBufferSourceNode.loop = true;
      this.audioBufferSourceNode.buffer = this.walkJumpBuffer;
      this.audioBufferSourceNode.connect(this.audioContext.destination);

      this.audioBufferSourceNode.start();
    }

    stopWalkSound() {
      this.audioBufferSourceNode.stop();
    }

    jump() {
      this.audioBufferSourceNodeJump = this.audioContext.createBufferSource();
      this.audioBufferSourceNodeJump.buffer = this.walkJumpBuffer;
      this.audioBufferSourceNodeJump.connect(this.audioContext.destination);

      this.audioBufferSourceNodeJump.start();
    }

    backgroundStart() {
      this.audioBufferSourceNodeBackground = this.audioContext.createBufferSource();
      this.audioBufferSourceNodeBackground.buffer = this.backgroundBuffer;
      this.audioBufferSourceNodeBackground.loop = true;

      this.gainNodeBackground = this.audioContext.createGain();
      this.gainNodeBackground.gain.value = 0.15; // 15 %
      this.gainNodeBackground.connect(this.audioContext.destination);
      this.audioBufferSourceNodeBackground.connect(this.gainNodeBackground);

      this.audioBufferSourceNodeBackground.start();
    }

    backgroundStop() {
      this.audioBufferSourceNodeBackground.stop();
    }
}

export default SoundModel;
