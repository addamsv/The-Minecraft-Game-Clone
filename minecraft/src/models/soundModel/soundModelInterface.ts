/* eslint-disable no-unused-vars */

interface soundModelInterface {
    audioContext: AudioContext;

    audioBufferSourceNode: AudioBufferSourceNode;

    audioBufferSourceNodeJump: AudioBufferSourceNode;

    audioBufferSourceNodeBackground: AudioBufferSourceNode;

    walkGrassBuffer: AudioBuffer;

    walkSandBuffer: AudioBuffer;

    swimBuffer: AudioBuffer;

    jumpBuffer: AudioBuffer;

    backgroundBuffer: AudioBuffer;

    gainNodeMove: GainNode;

    gainNodeJump: GainNode;

    gainNodeBackground: GainNode;
}
