/* eslint-disable no-unused-vars */

interface SoundModelInterface {
    backgroundBuffer: AudioBuffer;

    gainNodeBackground: GainNode;

    surface: string;

    initSounds(): void;

    setBackgroundVolume(): void;

    startWalkSound(): void;

    stopWalkSound(): void;

    jump(): void;

    backgroundStart(): void;

    backgroundStop(): void;
}

export default SoundModelInterface;
