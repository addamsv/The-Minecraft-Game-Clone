import settingsConfig from '../../configs/settingsConfig';

class SoundModel {
  public backgroundBuffer: AudioBuffer;

  public gainNodeBackground: GainNode;

  public surface: string;

  private audioContext: AudioContext;

  private audioBufferSourceNode: AudioBufferSourceNode;

  private audioBufferSourceNodeJump: AudioBufferSourceNode;

  private audioBufferSourceNodeBackground: AudioBufferSourceNode;

  private walkGrassBuffer: AudioBuffer;

  private walkSandBuffer: AudioBuffer;

  private swimBuffer: AudioBuffer;

  private jumpBuffer: AudioBuffer;

  private gainNodeMove: GainNode;

  private gainNodeJump: GainNode;

  private moveVolume: number;

  initSounds() {
    this.audioContext = new window.AudioContext();

    fetch('/assets/sounds/grass_walk.wav')
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        this.audioContext.decodeAudioData(buffer, (decoded) => {
          this.walkGrassBuffer = decoded;
        });
      });

    fetch('/assets/sounds/sand_walk.wav')
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        this.audioContext.decodeAudioData(buffer, (decoded) => {
          this.walkSandBuffer = decoded;
        });
      });

    fetch('/assets/sounds/swim.wav')
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        this.audioContext.decodeAudioData(buffer, (decoded) => {
          this.swimBuffer = decoded;
        });
      });

    fetch('/assets/sounds/jump.wav')
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        this.audioContext.decodeAudioData(buffer, (decoded) => {
          this.jumpBuffer = decoded;
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

  public setBackgroundVolume() {
    this.gainNodeBackground.gain.value = 0.3 * Number(settingsConfig.music.cur);
  }

  startWalkSound() {
    this.audioBufferSourceNode = this.audioContext.createBufferSource();
    this.audioBufferSourceNode.loop = true;
    this.audioBufferSourceNode.playbackRate.value = 1.2;
    this.moveVolume = 0.3 * Number(settingsConfig.sounds.cur);
    switch (this.surface) {
      case 'grass': {
        this.audioBufferSourceNode.buffer = this.walkGrassBuffer;
        break;
      }
      case 'sand': {
        this.audioBufferSourceNode.buffer = this.walkSandBuffer;
        break;
      }
      case 'water': {
        this.audioBufferSourceNode.buffer = this.swimBuffer;
        this.moveVolume *= 0.2;
        break;
      }
      default: break;
    }

    this.gainNodeMove = this.audioContext.createGain();
    this.gainNodeMove.gain.value = this.moveVolume;
    this.gainNodeMove.connect(this.audioContext.destination);
    this.audioBufferSourceNode.connect(this.gainNodeMove);

    this.audioBufferSourceNode.start();
  }

  stopWalkSound() {
    this.audioBufferSourceNode.stop();
  }

  jump() {
    this.audioBufferSourceNode = this.audioContext.createBufferSource();
    this.audioBufferSourceNode.playbackRate.value = 1.2;
    this.audioBufferSourceNode.buffer = this.jumpBuffer;

    this.gainNodeJump = this.audioContext.createGain();
    this.gainNodeJump.gain.value = 0.15 * Number(settingsConfig.sounds.cur);
    this.gainNodeJump.connect(this.audioContext.destination);
    this.audioBufferSourceNode.connect(this.gainNodeJump);

    this.audioBufferSourceNode.start();
  }

  backgroundStart() {
    this.audioBufferSourceNodeBackground = this.audioContext.createBufferSource();
    this.audioBufferSourceNodeBackground.buffer = this.backgroundBuffer;
    this.audioBufferSourceNodeBackground.loop = true;

    this.gainNodeBackground = this.audioContext.createGain();
    this.setBackgroundVolume();
    this.gainNodeBackground.connect(this.audioContext.destination);
    this.audioBufferSourceNodeBackground.connect(this.gainNodeBackground);

    this.audioBufferSourceNodeBackground.start();
  }

  backgroundStop() {
    this.audioBufferSourceNodeBackground.stop();
  }
}

export default SoundModel;
