import { useContext, useState } from "preact/hooks";
import { tw } from "twind";
import { Tracks } from "../../context/tracks";
import { playerService, playerSignal } from "../../lib/audio-player-machine";
import { HorizontalSlider, VerticalSlider } from "../core/slider";
import { PauseCircle } from "../icons/pause-circle";
import { PlayCircle } from "../icons/play-circle";
import { Volume } from "../icons/volume";

const visibleStates = ['paused', 'playing', 'resumed', 'loading'];

const seek = (progress: number) => {
  playerService.send({
    type: 'SEEK',
    value: progress
  });
}


const updateVolume = (value: number) => {
  const volume = value / 100;
  playerService.send({
    type: 'VOLUME_SET',
    value: volume
  });
}

const PlayerControls = () => {
	const tracks = useContext(Tracks);

  const [volumeVisible, setVolumeVisible] = useState(false);

  if (!visibleStates.includes(playerSignal.value.value as string)) {
    return null;
  }

  const toggleVolumeVisible = () => setVolumeVisible(current => !current);

  const volume = playerSignal.value.context.volume * 100;
  const playing = tracks.find(track => track.id === playerSignal.value.context.playing.id);
  const progress = playerSignal.value.context.playing.progress ?? 0;


  return (
    <div className={tw('absolute inset(x-0) bottom-0 p-4 border-t(1 gray.300)')}>
      <div className={tw('flex mb-4')}>
        <div>
          <button onClick={() => playerService.send('PLAY')} className={tw('focus:border(none) focus:outline(none)')}>
            <PlayCircle />
          </button>
          <button onClick={() => playerService.send('PAUSE')} className={tw('focus:border(none) focus:outline(none)')}>
            <PauseCircle />
          </button>
        </div>
        <div className={tw('flex flex(grow) items-center justify-center')}>
          {playing && (
            <p>{playing.title}</p>
          )}
        </div>
        <div className={tw('relative')}>
          <button onClick={toggleVolumeVisible} className={tw('focus:border(none) focus:outline(none)')}>
            <Volume />
          </button>
          {volumeVisible && (
            <div className={tw('absolute -left-0.5  bottom-8 p-2 rounded bg-white')}>
              <VerticalSlider min={0} max={100} value={volume} onChange={updateVolume} className={tw('h-24')} />
            </div>
          )}
        </div>
      </div>
      <HorizontalSlider min={0} max={100} value={progress} onChange={seek} />
    </div>
  );
};

export { PlayerControls };